# Troubleshooting: Port Permission Denied (EACCES) on Windows

If you encounter a `Permission Denied` or `EACCES` error when trying to run Vitest (or any other dev server) on a specific port (e.g., `63315`), but `netstat` shows that no process is currently using that port, you are likely experiencing a **Windows NAT (WinNAT) / Hyper-V Port Reservation** conflict.

## The Problem

Windows reserves ranges of "ephemeral" ports for system services, WSL2, and Hyper-V. These are called **Excluded Port Ranges**. If a tool tries to bind to a port that falls within one of these excluded ranges, Windows will block the process with a permission error, even if the port is technically "idle."

Because these ranges are often assigned dynamically upon reboot, a project that worked yesterday might suddenly fail today.

## How to Verify

Run the following command in PowerShell (as Administrator) to see if your target port is blocked:

```powershell
netsh int ipv4 show excludedportrange protocol=tcp
```

Look for a range that includes your port. For example: `63300    63399` -> This range would block port `63315`.

---

## Solutions

### 1. The Quick Fix (Restart WinNAT)

Restarting the Windows NAT driver often clears dynamic reservations and solves the issue immediately without a reboot.

**Run as Administrator:**

```powershell
net stop winnat
net start winnat
```

*Try running your command again after this.*

### 2. The Project Fix (Change Port)

If you want to avoid system-level conflicts entirely, configure Vitest to use a port outside the common dynamic range (typically below `10000`).

In `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    api: {
      port: 3001, // Manually set a lower port
    },
  },
})
```

### 3. The Permanent Fix (Reconfigure Dynamic Ranges)

If you frequently run into this, you can force Windows to start its dynamic port range at a higher offset, leaving the lower-middle range free for development tools.

**Run as Administrator and Reboot:**

```powershell
netsh int ipv4 set dynamicport tcp start=49152 num=16384
netsh int ipv6 set dynamicport tcp start=49152 num=16384
```

---

## Why `taskkill` Doesn't Work

Standard commands like `taskkill` or `Stop-Process` will fail because **there is no process to kill**. The port is being held by the Windows kernel/network driver itself, not a user-space application.

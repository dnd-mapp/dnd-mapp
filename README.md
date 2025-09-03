# Dnd Mapp

[![License](https://img.shields.io/github/license/dnd-mapp/dnd-mapp)](LICENSE)
[![CI](https://github.com/dnd-mapp/dnd-mapp/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/dnd-mapp/dnd-mapp/actions/workflows/ci.yml)

## Overview

**@dnd-mapp/dnd-mapp** contains the source code of the DnD-Mapp platform.

---

## Getting started

Follow these steps to get started developing **@dnd-mapp/dnd-mapp**

### Prerequisites

Ensure that you have the following requirements prepared:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) v22.14 and npm v10.9.  
  We recommend using tools like [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to make it easier for yourself to switch between different versions of Node. Once installed, you can run one of the following commands to install the right version of Node.js:

    - When using nvm:

      ```bash 
      nvm install
      ````

    - When using nvm-windows

      ```bash
      nvm install 22.14
      nvm use 22.14
      ```
- [mkcert](https://github.com/FiloSottile/mkcert)  
  This tool is required to generate a local certificate and key in order to serve the application over https. Visit the GitHub repository of the tool in order to find out more how to install it on your machine.

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/dnd-mapp/dnd-mapp.git
    ```

2. Navigate to the project directory

    ```bash
    cd dnd-mapp
    ```

3. Install Dependencies

    ```bash
    npm ci
    ```

4. Generate the local certificate and key
    - If you've not done so already, install mkcert in the root CA like so:

      ```bash
      mkcert -install
      ```
      A browser restart is required if you've done this step, and you've got a browser open.

    - Generate the certificate and key with the following command:

      ```bash
      mkcert -cert-file certificate.pem -key-file certificate-key.pem localhost.shared-ui.dnd-mapp.net localhost.auth.dnd-mapp.net localhost.api.dnd-mapp.net localhost.desktop-app.dnd-mapp.net localhost.www.dnd-mapp.net localhost
      ```

5. Add the `localhost.*` host names to the hosts file on your machine.

   #### For Mac / Linux

   In order to add the host name on a machine running mac, you'll need to:

    - Open a terminal and enter the following command (you may need to enter your password):

      ```bash
      sudo nano /etc/hosts
      ```

    - Add the following lines at the end of the file:

      ```text
      127.0.0.1 localhost.www.dnd-mapp.net          # Address for the main platform application.
      127.0.0.1 localhost.api.dnd-mapp.net          # Address for the client of the API.
      127.0.0.1 localhost.auth.dnd-mapp.net         # Address for the client of the Authorization server.
      127.0.0.1 localhost.desktop-app.dnd-mapp.net  # Address for the UI of the desktop-app.
      127.0.0.1 localhost.shared-ui.dnd-mapp.net    # Address for the Storybook app for the shared-ui project.
      ```

    - Save the file by pressing `Ctrl + O` and close the editor with `CTRL + X`.

   #### For Windows

   In order to add the host name on a machine running Windows, you'll need to:

    - Open Notepad in Administrator mode
    - Open the following file in Notepad:

      ```
      C:\Windows\System32\Drivers\etc\hosts
      ```

    - Add the following line at the end of the file:

      ```
      127.0.0.1 localhost.auth.dnd-mapp.net            # Address for the client of the Authorization server.
      127.0.0.1 localhost.shared-ui.dnd-mapp.net      # Address for the Storybook app for the shared-ui project.
      127.0.0.1 localhost.api.dnd-mapp.net            # Address for the client of the API.
      127.0.0.1 localhost.desktop-app.dnd-mapp.net    # Address for the UI of the desktop-app.
      127.0.0.1 localhost.dnd-mapp.net                # Address for the main platform application.
      ```

    - Save the file by pressing `Ctrl + S` after which you may close Notepad.

6. Make sure that the generated certificate is trusted. This will make it so that the browser won't prompt any warnings about using a locally generated certificate.

   #### Trusting the certificate on macOS

   Double-click the `certificate.pem` file, you'll be prompted to add the certificate to the login keychain app.

   Once added to the keychain, you can then select the created certificate from the `Keychain Access` window.
   It can be difficult to find when there are multiple certificates.

   Select the created certificate and right-click to select `Get Info` from the context menu. Then expand the `Trust` triangle.
   You should then be able to select to `Always Trust` the certificate for `SSL`.

   Close the panel and confirm the changes with password or fingerprint.

   Now you should not see https warnings serving the applications with https. Applications already opened in the Chrome browser should be reloaded.

   #### Trusting the certificate on Windows

   To add certificate.pem to the Trusted Root Certification Authorities store on Windows I need to start `Microsoft Management Console`.
   This can be done by pressing `<Windows Key> + R` or searching for the `Run` desktop app. Then running run `mmc`.

   Then go to `File > Add/Remove Snap-in…` and select `Certificates` for the current user:

   Once that has been added, you should be able to navigate to:
   Console Root \ Certificates - Current User \ Trusted Root Certification Authorities \ Certificates

   Right-click on `Certificates` under `Trusted Root Certification Authorities` and select `All Tasks > Import…`.
   Locate your `certificate.pem` file and import it. Once imported, you should be able to find it listed as a trusted certificate.

   Close Microsoft Management Console (you do not need to save the console). Then **restart** your browser.

### Running a project

To serve an application locally you can run one of the following commands:

| Project     | Command                    | Address                                       |
|-------------|----------------------------|-----------------------------------------------|
| shared-ui   | npx nx storybook shared-ui | https://localhost.shared-ui.dnd-mapp.net:8000 |
| api-gateway | npx nx serve api-gateway   | https://localhost.api.dnd-mapp.net:3000       |
| auth        | npx nx serve auth          | https://0.0.0.0:7200                          |
| users       | npx nx serve users         | 0.0.0.0:5000                                  |
| dnd-mapp    | npx nx serve dnd-mapp      | https://localhost.www.dnd-mapp.net:7300       |
| roles       | npx nx serve roles         | 0.0.0.0:5100                                  |
| auth-client | npx nx serve auth-client   | https://localhost.auth.dnd-mapp:7000          |
| desktop-app | npx nx serve desktop-app   | https://localhost.desktop-app.dnd-mapp:7100   |

---

## Usage

### Building

In order to compile for a particular application, run the following command format and replace the name of the project with the desired project name that you wish to compile

```bash
npx nx build <project-name>
```

### Testing

In order to run tests for a particular library or application, run the following command format and replace the name of the project with the desired project of which you want to run tests:

```bash
npx nx test <project-name>
```

Or run them in dev mode, which will rerun the tests after each file change:

```bash
npx nx test <project-name> -c dev
```

For creating and writing tests, we make use of different frameworks depending on the application or library:
- For an Angular project, we typically use [Karma]() in combination with [Jasmine]().
- For a NestJs project, we typically use [Jest](https://jestjs.io/).
- For an Electron project, we typically use [Vitest]().
- For a plain Typescript library we also use Vitest.

---

## Contributing

Contributions are welcome! Please have a look at the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on how to contribute to the project.

---

## License

This project is licensed under the [AGPL-3.0 License](LICENSE). See the LICENSE.md file for details.

---

## Acknowledgments

- This repository contains [ESLint](https://eslint.org/) to maintain linting and [Prettier](https://prettier.io/) maintain formatting. Please make sure that your IDEA is correctly configured to run these tools automatically. For the JetBrains editors configuration files are already included to automatically configure the Prettier and ESLint tools so that they're run on every save.

import { DMA_DESKTOP_APP_API_NAMESPACE, DmaDesktopAppApi } from '@dnd-mapp/shared-desktop-app';

declare global {
    interface Window {
        [DMA_DESKTOP_APP_API_NAMESPACE]: DmaDesktopAppApi;
    }
}

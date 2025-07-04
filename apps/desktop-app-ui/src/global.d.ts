import { DMA_DESKTOP_APP_API_NAMESPACE, DmaDesktopAppApi } from '@dnd-mapp/desktop-shared';

declare global {
    interface Window {
        [DMA_DESKTOP_APP_API_NAMESPACE]: DmaDesktopAppApi;
    }
}

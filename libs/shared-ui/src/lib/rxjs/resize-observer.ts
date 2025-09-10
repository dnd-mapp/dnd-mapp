import { Observable } from 'rxjs';

export function observeWidth(element: HTMLElement) {
    let currentWidth = element.clientWidth;

    return new Observable<number>((observer) => {
        const resizeObserver = new ResizeObserver(() => {
            if (currentWidth === element.clientWidth) return;
            currentWidth = element.clientWidth;
            observer.next(currentWidth);
        });
        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    });
}

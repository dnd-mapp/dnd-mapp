import { AppWindowController } from './app-window.controller';
import { Constructable, WindowController } from './models';

export class ControllerManager {
    public static instance() {
        if (this._instance) return this._instance;
        this._instance = new ControllerManager();

        return this._instance;
    }
    private static _instance: ControllerManager;

    private controllers: Map<string, WindowController> = new Map();

    private constructor() {}

    public destroy(): null {
        this.destroyControllers();

        ControllerManager._instance = null;
        return null;
    }

    public async openAppWindow() {
        if (this.hasController(AppWindowController.name)) return false;
        const controller = await AppWindowController.instance();
        await controller.showWindow();

        this.setController(controller);
        return true;
    }

    /** Sends messages to all controllers and windows. */
    public sendIpcMessages(channel: string, ...args: unknown[]) {
        [...this.controllers.values()].forEach((controller) => controller.sendIpcMessage(channel, ...args));
    }

    public getController<T extends WindowController>(ControllerType: Constructable<T>) {
        const controllerName = ControllerType.name;

        if (!this.hasController(controllerName)) return null;
        return this.controllers.get(controllerName) as T;
    }

    public removeController<T extends WindowController>(controller: T) {
        const controllerName = controller.constructor.name;

        if (!this.hasController(controllerName)) return;

        controller.destroy();
        this.controllers.delete(controllerName);
    }

    private setController<T extends WindowController>(instance: T) {
        const controllerName = instance.constructor.name;

        if (this.hasController(controllerName)) return;
        this.controllers.set(controllerName, instance);
    }

    private hasController(controllerName: string) {
        return this.controllers.has(controllerName);
    }

    private destroyControllers() {
        [...this.controllers.values()].forEach((controller) => this.removeController(controller));
    }
}

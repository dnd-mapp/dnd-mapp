import { LogService } from '../logging';
import { AppWindowController } from './app-window.controller';
import { Constructable, WindowController } from './models';

export class ControllerManager {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new ControllerManager();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: ControllerManager;

    private logService = LogService.withContext('ControllerManager');

    private controllers: Map<string, WindowController> = new Map();

    private constructor() {}

    private async initialize() {
        await this.logService.info('Initializing ControllerManager');
    }

    public async destroy(): Promise<null> {
        await this.logService.info('Destroying ControllerManager');
        await this.destroyControllers();

        this.logService = await this.logService.destroy();
        ControllerManager._instance = null;
        return null;
    }

    public async openAppWindow() {
        await this.logService.info('Creating main application window');

        if (this.hasController(AppWindowController.name)) {
            await this.logService.info('Main application window already exists. Aborting controller creation');
            return false;
        }
        const controller = await AppWindowController.instance();
        await controller.showWindow();

        this.setController(controller);
        return true;
    }

    /** Sends messages to all controllers and windows. */
    public async sendIpcMessages(channel: string, ...args: unknown[]) {
        await this.logService.debug(`Sending message "${channel}" over IPC to all controllers`);
        await Promise.all(
            [...this.controllers.values()].map((controller) => controller.sendIpcMessage(channel, ...args))
        );
    }

    public async getController<T extends WindowController>(ControllerType: Constructable<T>) {
        const controllerName = ControllerType.name;
        await this.logService.debug(`Getting controller of type "${controllerName}"`);

        if (!this.hasController(controllerName)) {
            await this.logService.debug(`Controller of type "${controllerName}" has not been created yet`);
            return null;
        }
        return this.controllers.get(controllerName) as T;
    }

    public async removeController<T extends WindowController>(controller: T) {
        const controllerName = controller.constructor.name;
        await this.logService.debug(`Removing controller of type "${controllerName}"`);

        if (!this.hasController(controllerName)) return;
        await this.logService.debug(`Deregistering controller of type "${controllerName}"`);

        await controller.destroy();
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

    private async destroyControllers() {
        await this.logService.debug('Destroying remaining controllers');
        await Promise.all([...this.controllers.values()].map((controller) => this.removeController(controller)));
    }
}

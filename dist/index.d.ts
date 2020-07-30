import { App } from './types';
export declare function register(tag: string, component: App['component'], route: string): void;
export declare function start(): void;
export declare class Sandbox {
    proxy: ProxyConstructor;
    constructor();
}

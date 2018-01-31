import { BrowserWindow } from 'electron';

export interface IMenuContext {
    mainWindow: BrowserWindow,
    windows?: BrowserWindow[],
}

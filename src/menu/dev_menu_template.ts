import { app, BrowserWindow, MenuItemConstructorOptions as MenuItemConstOptions } from 'electron';
import { Context } from '../Context';
export function devMenuTemplateFactory(ctx: Context): MenuItemConstOptions {
    const { mainWindow } = ctx;
    return {
        label: 'Development',
        submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
                mainWindow.webContents.reloadIgnoringCache();
            }
        },
        {
            label: 'Open DevTools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click: () => {
                if (!mainWindow.webContents.isDevToolsOpened()) {
                    mainWindow.webContents.openDevTools({ mode: 'detach' });
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            }
        },
        {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                app.quit();
            }
        }]
    };
};

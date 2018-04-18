import { app, BrowserWindow, MenuItemConstructorOptions as MenuItemConstOptions } from 'electron';
import { Context } from '../Context';
export function devMenuTemplateFactory(ctx: Context): MenuItemConstOptions {
    const { lastFocusedWindow } = ctx;
    return {
        label: 'Development',
        submenu: [
            // {
            //     label: 'Open Timer',
            //     // accelerator: 'Alt+CmdOrCtrl+I',
            //     click: () => { ctx.createTimerWindow(); }
            // },
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: () => {
                    var window = BrowserWindow.getFocusedWindow();
                    if (!window) window = lastFocusedWindow;
                    if (!window) return;
                    window.webContents.reloadIgnoringCache();
                }
            },
            {
                label: 'Open DevTools',
                accelerator: 'Alt+CmdOrCtrl+I',
                click: () => {
                    var window = BrowserWindow.getFocusedWindow();
                    if (!window) window = lastFocusedWindow;
                    if (!window) return;
                    if (!window.webContents.isDevToolsOpened()) {
                        window.webContents.openDevTools({ mode: 'detach' });
                    } else {
                        window.webContents.closeDevTools();
                    }
                }
            },
            {
                label: 'Quit App',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    };
};

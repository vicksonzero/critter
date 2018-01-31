// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import * as path from 'path';
import * as url from 'url';

// to use
import { app, Menu, Tray } from 'electron';

// for its type
import { BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { devMenuTemplateFactory } from './menu/dev_menu_template';
import { editMenuTemplateFactory } from './menu/edit_menu_template';
import { IMenuContext } from './menu/menuTemplateFactory';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

// windows need to be created globally
let mainWindow: BrowserWindow;
let tray: Tray;

var setApplicationMenu = function (ctx: IMenuContext) {
    const menus: MenuItemConstructorOptions[] = [];
    menus.push(editMenuTemplateFactory(ctx));

    if (env.name !== 'production') {
        menus.push(devMenuTemplateFactory(ctx));
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    const userDataPath: string = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
    mainWindow = createWindow('main', {
        width: 150,
        height: 150,
        transparent: true,
        alwaysOnTop: true,
        frame: false,
        skipTaskbar: true,
    });

    setApplicationMenu({ mainWindow });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.webContents.send('mainWindow', mainWindow);
    });

    if (env.name === 'development') {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    tray = new Tray(path.join(__dirname, 'sprites/exit.png'));

    const template = devMenuTemplateFactory({ mainWindow });
    tray.setContextMenu(Menu.buildFromTemplate([template]));
    tray.setToolTip('critter');
});

app.on('window-all-closed', function () {
    app.quit();
});

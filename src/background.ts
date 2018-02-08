// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import * as path from 'path';
import * as url from 'url';

import { app, Menu, Tray } from 'electron';
import { BrowserWindow, MenuItemConstructorOptions } from 'electron';

import * as fs from 'fs'; // module loaded from npm

import { safeLoad, safeDump } from 'js-yaml';
import { LoadOptions } from 'js-yaml';

import { devMenuTemplateFactory } from './menu/dev_menu_template';
import { editMenuTemplateFactory } from './menu/edit_menu_template';
import { Context } from './Context';

import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

// windows need to be created globally
let context = new Context();
context.loadConfig('config/preference.yaml');

var setApplicationMenu = function (ctx: Context) {
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
    context.mainWindow = createWindow('main', {
        width: 150,
        height: 150,
        transparent: true,
        alwaysOnTop: true,
        frame: false,
        skipTaskbar: true,
    });

    setApplicationMenu(context);

    context.mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app.html'),
        protocol: 'file:',
        slashes: true
    }));

    context.mainWindow.webContents.on('dom-ready', () => {
        context.mainWindow.webContents.send('context', context);
    });

    if (env.name === 'development') {
        context.mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    context.tray = new Tray(path.join(__dirname, 'sprites/exit.png'));

    const template = devMenuTemplateFactory(context);
    context.tray.setContextMenu(Menu.buildFromTemplate([template]));
    context.tray.setToolTip('critter');
});

app.on('window-all-closed', function () {
    app.quit();
});

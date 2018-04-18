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
context.loadAnimations(['config/esheep.yaml']);

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    const userDataPath: string = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
    createMainWindow(context);
    // if (env.name === 'development') {
    //     context.mainWindow.webContents.openDevTools({ mode: 'detach' });
    // }
    // context.timerWindow = createTimerWindow(context);

    context.tray = new Tray(path.join(__dirname, 'sprites/exit.png'));

    context.createCritterWindow = () => { createMainWindow(context) };
    context.createTimerWindow = () => { createTimerWindow(context, false) };
    context.createTimerWindowWithFrame = () => { createTimerWindow(context, true) };

    const template = [
        {
            label: 'Open Critter',
            // accelerator: 'Alt+CmdOrCtrl+I',
            click: () => { context.createCritterWindow(); }
        },
        {
            label: 'Open Timer',
            // accelerator: 'Alt+CmdOrCtrl+I',
            click: () => { context.createTimerWindow(); }
        },
        {
            label: 'Open Timer with frame',
            // accelerator: 'Alt+CmdOrCtrl+I',
            click: () => { context.createTimerWindowWithFrame(); }
        },
        devMenuTemplateFactory(context)
    ];
    context.tray.setContextMenu(Menu.buildFromTemplate(template));
    context.tray.setToolTip('critter');

    setApplicationMenu(context);
});

app.on('window-all-closed', function () {
    app.quit();
});

function setApplicationMenu(ctx: Context) {
    const menus: MenuItemConstructorOptions[] = [];
    menus.push(editMenuTemplateFactory(ctx));

    if (env.name !== 'production') {
        menus.push(devMenuTemplateFactory(ctx));
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

function createMainWindow(ctx: Context): BrowserWindow {
    var window = createWindow('main', {
        width: 150,
        height: 150,
        transparent: true,
        alwaysOnTop: true,
        frame: false,
        skipTaskbar: true,
        resizable: false,
    });

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    window.webContents.on('dom-ready', () => {
        window.webContents.send('context', ctx);
    });

    ctx.mainWindow = window;
    ctx.lastFocusedWindow = window;

    return window;
}

function createTimerWindow(ctx: Context, withFrame: boolean): BrowserWindow {
    var window = createWindow('timer', {
        width: 200,
        height: 300,
        transparent: false,
        alwaysOnTop: true,
        frame: withFrame,
        skipTaskbar: true,
        resizable: true,
    });

    setApplicationMenu(ctx);

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'timer.html'),
        protocol: 'file:',
        slashes: true,
    }));

    window.webContents.on('dom-ready', () => {
        window.webContents.send('context', ctx);
    });

    ctx.timerWindow = window;
    ctx.lastFocusedWindow = window;

    return window;
}
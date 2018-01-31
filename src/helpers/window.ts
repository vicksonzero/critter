// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.

// use
import { app, BrowserWindow, screen } from 'electron';
// type
import { BrowserWindowConstructorOptions, Rectangle } from 'electron';
const jetpack = require('fs-jetpack');

interface IRectangle {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export default function (name: string, options: BrowserWindowConstructorOptions): BrowserWindow {

    var userDataDir = jetpack.cwd(app.getPath('userData'));
    var stateStoreFile = 'window-state-' + name + '.json';
    var defaultSize: IRectangle = {
        width: options.width,
        height: options.height
    };
    var state = {};
    var win: BrowserWindow;

    var restore = function (): IRectangle {
        var restoredState: IRectangle = {};
        try {
            restoredState = userDataDir.read(stateStoreFile, 'json');
        } catch (err) {
            // For some reason json can't be read (might be corrupted).
            // No worries, we have defaults.
        }
        return Object.assign({}, defaultSize, restoredState);
    };

    var getCurrentPosition = function (): IRectangle {
        var position = win.getPosition();
        var size = win.getSize();
        return {
            x: position[0],
            y: position[1],
            width: size[0],
            height: size[1]
        };
    };

    var windowWithinBounds = function (windowState: IRectangle, bounds: IRectangle) {
        return windowState.x >= bounds.x &&
            windowState.y >= bounds.y &&
            windowState.x + windowState.width <= bounds.x + bounds.width &&
            windowState.y + windowState.height <= bounds.y + bounds.height;
    };

    var resetToDefaults = function (windowState) {
        var bounds = screen.getPrimaryDisplay().bounds;
        return Object.assign({}, defaultSize, {
            x: (bounds.width - defaultSize.width) / 2,
            y: (bounds.height - defaultSize.height) / 2
        });
    };

    var ensureVisibleOnSomeDisplay = function (windowState: IRectangle) {
        var visible = screen.getAllDisplays().some(function (display) {
            return windowWithinBounds(windowState, display.bounds);
        });
        if (!visible) {
            // Window is partially or fully not visible now.
            // Reset it to safe defaults.
            return resetToDefaults(windowState);
        }
        return windowState;
    };

    var saveState = function () {
        if (!win.isMinimized() && !win.isMaximized()) {
            Object.assign(state, getCurrentPosition());
        }
        userDataDir.write(stateStoreFile, state, { atomic: true });
    };

    // state = ensureVisibleOnSomeDisplay(restore());

    win = new BrowserWindow(Object.assign({}, options, state));

    win.on('close', saveState);

    return win;
}

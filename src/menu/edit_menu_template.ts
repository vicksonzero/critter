import { MenuItemConstructorOptions as MenuItemConstOptions } from 'electron';
import { Context } from "../Context";

export function editMenuTemplateFactory(ctx: Context): MenuItemConstOptions {
    return {
        label: 'Edit',
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X" },
            { label: "Copy", accelerator: "CmdOrCtrl+C" },
            { label: "Paste", accelerator: "CmdOrCtrl+V" },
            { label: "Select All", accelerator: "CmdOrCtrl+A" }
        ]
    };
}

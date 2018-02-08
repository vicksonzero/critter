
import { Tray } from 'electron';
import { BrowserWindow } from 'electron';
import { safeLoad } from "js-yaml";
import * as path from "path";
import * as fs from "fs";

export interface Preference {
    greetings: string;
}

export class Context {

    public mainWindow?: BrowserWindow;
    public windows?: BrowserWindow[];
    public tray?: Tray;
    public config?: Preference;

    public loadConfig(filename: string): void {
        try {
            var doc: Preference = safeLoad(fs.readFileSync(path.join(__dirname, filename), 'utf8'));
            this.config = doc;
            console.log(this.config);
        } catch (e) {
            console.log(e);
        }
    }
}

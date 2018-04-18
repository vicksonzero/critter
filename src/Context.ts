
import { Tray } from 'electron';
import { BrowserWindow } from 'electron';
import { safeLoad } from "js-yaml";
import * as path from "path";
import * as fs from "fs";

import { Animation, AnimationSet } from "./Animation";

export interface Preference {
    greetings: string;
}

export class Context {

    public lastFocusedWindow?: BrowserWindow;
    public mainWindow?: BrowserWindow;
    public timerWindow?: BrowserWindow;

    public windows?: BrowserWindow[];
    public tray?: Tray;
    public config?: Preference;
    public animationSets?: AnimationSet[];
    public animationSet?: AnimationSet;

    public createCritterWindow?: () => void;
    public createTimerWindow?: () => void;
    public createTimerWindowWithFrame?: () => void;
    

    public loadConfig(filename: string): void {
        try {
            var doc: Preference = safeLoad(fs.readFileSync(path.join(__dirname, filename), 'utf8'));
            this.config = doc;
            console.log(this.config);
        } catch (e) {
            console.warn(e);
        }
    }

    public loadAnimations(filenames: string[]): void {
        try {
            this.animationSets = (filenames
                .map((filename) => {
                    var anim: AnimationSet = safeLoad(
                        fs.readFileSync(path.join(__dirname, filename), 'utf8')
                    );
                    return anim;
                })
            );
            console.log(this.animationSets.length);
            this.animationSet = (this.animationSets
                .reduce((result, set) =>
                    result.combine(set),
                new AnimationSet()
                )
            );
        } catch (e) {
            console.warn(e);
        }
    }
}

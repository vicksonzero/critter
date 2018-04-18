
// import { Tray } from 'electron';
// import { BrowserWindow } from 'electron';
import { safeLoad } from "js-yaml";
import * as path from "path";
import * as fs from "fs";


export class TimerContext {
    public timerString: string = `
        // 2018-04-18
        15:00:00 百 XIN哥來了 prep
        15:10:00 百 XIN哥來了
        16:00:00 百 金龍珠 prep
        16:10:00 百 金龍珠
        17:00:00 百 金拉霸 prep
        17:15:00 百 金拉霸
        19:30:00 百 猛龍傳奇 prep
        19:45:00 百 猛龍傳奇
        20:05:00 金 金拉霸 prep
        20:15:00 金 金拉霸
        22:00:00 金 金龍珠 prep
        22:10:00 金 金龍珠
    `
}

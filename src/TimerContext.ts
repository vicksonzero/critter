
// import { Tray } from 'electron';
// import { BrowserWindow } from 'electron';
import { safeLoad } from "js-yaml";
import * as path from "path";
import * as fs from "fs";


export class TimerContext {
    public timerString: string = "\
17:00:00\n\
17:15:00\n\
17:15:15\n\
16:15:00\n\
16:30:00\n\
16:30:15\n\
18:00:00\n\
18:15:00\n\
18:15:15\n\
20:00:00\n\
20:15:00\n\
20:15:15\n\
21:00:00\n\
21:15:00\n\
21:15:15\n\
21:18:00\n\
21:33:00\n\
21:33:15\n\
22:00:00\n\
22:15:00\n\
22:15:15\n\
22:30:00\n\
22:45:00\n\
22:45:15";
}

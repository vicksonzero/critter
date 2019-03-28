
import * as _moment from 'moment';

const moment = _moment;
import { Context } from "../Context";
import { Preference } from "../Context";

var helloWorldString = 'Hello World! time=%1';

export var greet = function (context: Context) {
    if (!context) return 'Hello World!';
    
    var config: Preference = context.config;
    return config.greetings;
    // return helloWorldString.replace('%1', moment().format(timeFormat));
};

export var time = function (timeFormat: string = 'HH:mm:ss') {
    return moment().format(timeFormat);
};

export var bye = function () {
    return 'See ya!';
};

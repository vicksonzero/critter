
import moment from 'moment';

var hellowWorldString = 'Hello World! time=%1';

export var greet = function () {
    // return hellowWorldString.replace('%1', moment().format(timeFormat));
    return 'Hello World!';
};

export var time = function (timeFormat: string = 'HH:mm:ss') {
    return moment().format(timeFormat);
};

export var bye = function () {
    return 'See ya!';
};

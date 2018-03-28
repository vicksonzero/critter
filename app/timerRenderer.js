(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = require('electron');
var moment = _interopDefault(require('moment'));

var time = function (timeFormat) {
    if (timeFormat === void 0) { timeFormat = 'HH:mm:ss'; }
    return moment().format(timeFormat);
};

// Simple wrapper exposing environment variables to rest of the code.
var jetpack$1 = require('fs-jetpack');
// The variables have been written to `env.json` by the build process.
var env = jetpack$1.cwd(__dirname).read('env.json', 'json');

var TimerContext = /** @class */ (function () {
    function TimerContext() {
        this.timerString = "\
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
    return TimerContext;
}());

var TimerEvent = /** @class */ (function () {
    function TimerEvent(time, title) {
        if (time === void 0) { time = ''; }
        if (title === void 0) { title = ''; }
        this.time = time;
        this.title = title;
    }
    TimerEvent.prototype.toString = function () {
        return "TimerEvent " + this.time + " " + this.title;
    };
    TimerEvent.prototype.toJSON = function () {
        var _a = this, time = _a.time, title = _a.title;
        return { time: time, title: title };
    };
    TimerEvent.fromString = function (str) {
        var obj = JSON.parse(str);
        return new TimerEvent(obj.time, obj.title);
    };
    return TimerEvent;
}());

/// <reference path="./Window.d.ts" />
// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.
var jetpack = require('fs-jetpack'); // module loaded from npm
console.log('Loaded environment variables:', env);
window['moment'] = moment;
var app = electron.remote.app;
var appDir = jetpack.cwd(app.getAppPath());
var context;
var timerContext;
document.addEventListener('DOMContentLoaded', function () {
    timerContext = new TimerContext();
    window['parseTimerString'] = parseTimerString;
    window['timerContext'] = timerContext;
    window['createEventComponent'] = createEventComponent;
    var newNodes = (parseTimerString(timerContext.timerString)
        .map(createEventComponent));
    var timeline = document.querySelector('.timeline');
    newNodes.sort(function (a, b) {
        var aEvent = TimerEvent.fromString(a.dataset.timerEvent);
        var bEvent = TimerEvent.fromString(b.dataset.timerEvent);
        var isAfter = moment(aEvent.time, 'HH:mm:ss').isAfter(moment(bEvent.time, 'HH:mm:ss'));
        return isAfter ? 1 : -1;
    });
    newNodes.forEach(function (elem, i) {
        elem.style.top = 20 * i + "px";
        timeline.appendChild(elem);
    });
    updateTime();
    updateTimerEvents();
});
electron.ipcRenderer.on('context', function (sender, ctx) {
    console.log('context', ctx);
    context = ctx;
});
function updateTime() {
    document.querySelector('#clock').innerHTML = time();
    setTimeout(function () { return updateTime(); }, 0.5 * 1000);
}
function updateTimerEvents() {
    var shownEvents = 3;
    var timelineHeight = 100;
    var timeline = document.querySelector('div.timeline');
    var doneEventCount = removeDoneEvents(timeline);
    if (doneEventCount > 0)
        console.log('doneEventCount: ', doneEventCount);
    var children = Array.from(timeline.children);
    var lastTimerEvent = TimerEvent.fromString(children[shownEvents - 1].dataset.timerEvent);
    var lastMoment = moment(lastTimerEvent.time, 'HH:mm:ss');
    var totalProgress = lastMoment.diff(moment());
    var lastY = -20;
    children.forEach(function (section, i) {
        if (i >= shownEvents) {
            section.classList.add('hidden-time-event');
            return;
        }
        section.classList.remove('hidden-time-event');
        var timerEvent = TimerEvent.fromString(section.dataset.timerEvent);
        var sectionMoment = moment(timerEvent.time, 'HH:mm:ss');
        var progress = lastMoment.diff(sectionMoment);
        var progressPercent = 1 - (progress / totalProgress);
        // console.log('progressPercent', i, progressPercent);
        var y = ease(progressPercent) * timelineHeight;
        for (var i_1 = 0; y < lastY + 20 && i_1 < 10; i_1++)
            y += 20;
        section.style.top = y + "px";
        lastY = y;
        section.querySelector('.time').innerText = moment.duration(sectionMoment.diff(moment())).humanize();
    });
    setTimeout(function () { return updateTimerEvents(); }, 0.5 * 1000);
}
function removeDoneEvents(timeline) {
    var children = Array.from(timeline.children);
    var doneList = (children
        .filter(function (section) {
        var timerEvent = TimerEvent.fromString(section.dataset.timerEvent);
        return moment(timerEvent.time, 'HH:mm:ss').isBefore();
    }));
    doneList.forEach(function (section) { return timeline.removeChild(section); });
    return doneList.length;
}
function parseTimerString(str) {
    var lines = str.match(/[^\r\n]+/g);
    // console.log('lines', lines);
    var events = lines.map(function (line, i) {
        var tokens = line.match(/\s*(\d{2}:\d{2}:\d{2})\s*?(.*?)\s*/g);
        // console.log('tokens', i, tokens);
        return new TimerEvent(tokens[0], tokens[1] || '');
    });
    return events;
}
function createEventComponent(event) {
    var template = document.querySelector('#timerEventComponentTemplate').children[0];
    var result = template.cloneNode(true);
    var title = event.title;
    if (title === '')
        title = event.time;
    result.querySelector('.time').innerText = event.time;
    result.querySelector('h3').innerText = title;
    result.dataset.timerEvent = JSON.stringify(event.toJSON());
    return result;
}
function ease(t) {
    return (--t) * t * t + 1;
}

}());
//# sourceMappingURL=timerRenderer.js.map
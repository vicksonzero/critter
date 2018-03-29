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
        this.timerString = "12:30:00 Lunch";
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
    window['applyTimes'] = applyTimes;
    constructTimeline();
    updateTime();
});
electron.ipcRenderer.on('context', function (sender, ctx) {
    console.log('context', ctx);
    context = ctx;
});
function applyTimes() {
    timerContext.timerString = document.querySelector('#input-times-textbox').value;
    clearTimeline();
    constructTimeline();
}
function updateTime() {
    document.querySelector('#clock').innerHTML = time();
    updateTimerEvents();
    setTimeout(function () { return updateTime(); }, 0.5 * 1000);
}
function updateTimerEvents() {
    var shownEvents = 3;
    var timelineHeight = 90;
    var timeline = document.querySelector('div.timeline');
    var doneEventCount = removeDoneEvents(timeline);
    if (doneEventCount > 0)
        console.log('doneEventCount: ', doneEventCount);
    var children = Array.from(timeline.querySelectorAll('section'));
    if (children.length > 0) {
        var lastIndex = Math.min(shownEvents - 1, children.length - 1);
        var lastTimerEvent = TimerEvent.fromString(children[lastIndex].dataset.timerEvent);
        var lastMoment_1 = moment(lastTimerEvent.time, 'HH:mm:ss');
        var totalProgress_1 = lastMoment_1.diff(moment());
        var lastY_1 = -20;
        children.forEach(function (section, i) {
            if (i >= shownEvents) {
                section.classList.add('hidden-time-event');
                return;
            }
            section.classList.remove('hidden-time-event');
            var timerEvent = TimerEvent.fromString(section.dataset.timerEvent);
            var sectionMoment = moment(timerEvent.time, 'HH:mm:ss');
            var progress = lastMoment_1.diff(sectionMoment);
            var progressPercent = 1 - (progress / totalProgress_1);
            // console.log('progressPercent', i, progressPercent);
            var y = ease(progressPercent) * timelineHeight;
            for (var i_1 = 0; y < lastY_1 + 20 && i_1 < 10; i_1++)
                y += 20;
            section.style.top = y + "px";
            lastY_1 = y;
            var duration = moment.duration(sectionMoment.diff(moment()));
            section.querySelector('.time').innerText = humanize(duration);
        });
    }
    // setTimeout(function () { return updateTimerEvents(); }, 0.5 * 1000);
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
function clearTimeline() {
    var timeline = document.querySelector('.timeline');
    var children = Array.from(timeline.children);
    children.forEach(function (section) {
        section.dataset.timerEvent = '';
        timeline.removeChild(section);
    });
    timeline.innerHTML = '';
}
function constructTimeline() {
    var timeline = document.querySelector('.timeline');
    var a = parseTimerString(timerContext.timerString);
    if (!a)
        return;
    var newNodes = (a
        .map(createEventComponent));
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
}
function parseTimerString(str) {
    var lines = str.match(/[^\r\n]+/g);
    // console.log('lines', lines);
    if (!lines)
        return;
    var events = lines.map(function (line, i) {
        var tokens = line.match(/\s*(\d{2}:\d{2}:\d{2})(.*)/);
        // console.log('tokens', i, tokens);
        var time$$1 = tokens[1];
        var title = tokens[2] || '';
        if (title !== '') {
            title = title.trim();
        }
        return new TimerEvent(time$$1, title);
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
    // easeOutQuart
    return 1 - (--t) * t * t * t;
}
function humanize(duration) {
    if (duration.years() > 0)
        return ">" + duration.years() + " years";
    if (duration.months() > 0)
        return ">" + duration.months() + " months";
    if (duration.days() > 0)
        return ">" + duration.days() + " days";
    if (duration.hours() > 0)
        return ">" + duration.hours() + " hours";
    if (duration.minutes() > 0) {
        if (duration.minutes() > 10)
            return duration.minutes() + " minutes";
        return duration.minutes() + "min " + duration.seconds() + "sec";
    }
    return duration.seconds() + " seconds";
}

}());
//# sourceMappingURL=timerRenderer.js.map
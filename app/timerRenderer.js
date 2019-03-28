(function () {'use strict';

var electron = require('electron');
var _moment = require('moment');

var moment$1 = _moment;

var time = function (timeFormat) {
    if (timeFormat === void 0) { timeFormat = 'HH:mm:ss'; }
    return moment$1().format(timeFormat);
};

// Simple wrapper exposing environment variables to rest of the code.
var jetpack$1 = require('fs-jetpack');
// The variables have been written to `env.json` by the build process.
var env = jetpack$1.cwd(__dirname).read('env.json', 'json');

var TimerContext = /** @class */ (function () {
    function TimerContext() {
        this.timerString = "\n        // 2018-04-18\n        15:00:00 \u767E XIN\u54E5\u4F86\u4E86 prep\n        15:10:00 \u767E XIN\u54E5\u4F86\u4E86\n        16:00:00 \u767E \u91D1\u9F8D\u73E0 prep\n        16:10:00 \u767E \u91D1\u9F8D\u73E0\n        17:00:00 \u767E \u91D1\u62C9\u9738 prep\n        17:15:00 \u767E \u91D1\u62C9\u9738\n        19:30:00 \u767E \u731B\u9F8D\u50B3\u5947 prep\n        19:45:00 \u767E \u731B\u9F8D\u50B3\u5947\n        20:05:00 \u91D1 \u91D1\u62C9\u9738 prep\n        20:15:00 \u91D1 \u91D1\u62C9\u9738\n        22:00:00 \u91D1 \u91D1\u9F8D\u73E0 prep\n        22:10:00 \u91D1 \u91D1\u9F8D\u73E0\n    ";
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

var chimeAudioString = "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\nGHcKeBFrPJh9qd7WsTD59W3kjQd+R69jeJez6lc0tp81xdMbjFo5vHz3TFbT2SeFerZPBa4KqeNy\n5sq1PRWsDErJOrFtviFK4pl5mjVHYmZwet9V3fSh9pNuTG9yy0evVC/xD1Zl3mZ3aeLa8jK6e58C\nKrRRBRgAA9sU10ppA21HTUl5zYDmXYVtnjAegjDk5URPRl7zpYW0l63p1qL3jhO2kPTt8tJGjsmm\nJitcjnoedS59P3Dn6919pfutrMF8nL2dmj/QN5tFjfesR1aWu4+s/bO+0lausXuUSu3aRL4uZP/7\nkmT1jfYqbL0DDHtwAAANIAAAARcpqvQsPe3IAAA0gAAABOo1OxuWfHo/hQlaY+Qj/FhCXGxaGA7w\nLBxQB3SLC/Y4hLRa1iErVPqQJLvIVz61E8K66E+087fn2Hl1qPuIS5ehYh2LN0xjP4HTB1VboPpX\n9lDOnqeZlL+MueEOAaLkxCZRPQuWeiXZWaizTSz0KhMVciTehxFOP8lpsrPQpPQpuknklclUo1t/\n+62OSuK0EU2Unq4ipq4pPVciSaVcimhpqpWytNCk0s2hWmys9Cqw0rBEq6WS2MVkZKImASIwJBYf\nAKQAaBYTgZGh4KoBMIVzK02USbiJQmKsEybK05eNSjktleSvNiliKaEs2SpamIKaimZccm5AUMTK\n6MJMQU1FMy45NyAoYmV0YSmqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqr/+5Jk9Q31j2w8kyxjcgAADSAAAAEVIbDgLCUtwAAANIAAAASqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuOTcgKGJldGEpqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uSZP+P8AAAaQAAAAgAAA0gAAAB\nAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq\nqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==\n";

/// <reference path="./Window.d.ts" />
// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.
var jetpack = require('fs-jetpack'); // module loaded from npm
var moment = _moment;
console.log('Loaded environment variables:', env);
window['moment'] = moment;
var app = electron.remote.app;
var appDir = jetpack.cwd(app.getAppPath());
var context;
var timerContext;
var shownEvents = 3;
var timelineHeight = 90;
var shownDuration = moment.duration({ minutes: 30 });
// const shownDuration = moment.duration({ minutes: 10 });
// const shownDuration = moment.duration({ hours: 1 });
// example:
// moment.duration({
//     seconds: 2,
//     minutes: 2,
//     hours: 2,
//     days: 2,
//     weeks: 2,
//     months: 2,
//     years: 2
// });
var chimeAudio = null;
document.addEventListener('DOMContentLoaded', function () {
    chimeAudio = new Audio("data:audio/wav;base64," + chimeAudioString);
    document.body.appendChild(chimeAudio);
    if (chimeAudio)
        chimeAudio.play();
    // setTimeout(() => {
    //     if (chimeAudio) chimeAudio.play();
    // }, 5000);
    timerContext = new TimerContext();
    window['parseTimerString'] = parseTimerString;
    window['timerContext'] = timerContext;
    window['createEventComponent'] = createEventComponent;
    window['applyTimes'] = applyTimes;
    document.querySelector('#input-times-textbox').value = timerContext.timerString;
    constructTimeline();
    constructTimelineKnobs(shownEvents);
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
    constructTimelineKnobs(shownEvents);
}
function updateTime() {
    document.querySelector('#clock').innerHTML = time();
    updateTimerEvents();
    setTimeout(function () { return updateTime(); }, 0.5 * 1000);
}
function updateTimerEvents() {
    var timeline = document.querySelector('div.timeline');
    var doneEventCount = removeDoneEvents(timeline);
    if (doneEventCount > 0) {
        console.log('doneEventCount: ', doneEventCount);
        if (chimeAudio)
            chimeAudio.play();
    }
    var timerEventLabels = Array.from(timeline.querySelectorAll('section.timerEventLabel'));
    var knobs = Array.from(timeline.querySelectorAll('div.timerEventDot'));
    if (timerEventLabels.length > 0) {
        var lastIndex = Math.min(shownEvents - 1, timerEventLabels.length - 1);
        var lastTimerEvent = TimerEvent.fromString(timerEventLabels[lastIndex].dataset.timerEvent);
        // const lastMoment = moment(lastTimerEvent.time, 'HH:mm:ss');
        var lastMoment_1 = moment().add(shownDuration);
        // const lastMoment = moment().add(10, 'minutes');
        // const totalProgress = lastMoment.diff(moment());
        // const totalProgress = (moment().add(10, 'minutes')).diff(moment());
        var totalProgress_1 = (moment().add(shownDuration)).diff(moment());
        var lastY_1 = -16;
        timerEventLabels.forEach(function (section, i) {
            if (i >= shownEvents) {
                section.classList.add('hidden-time-event');
                return;
            }
            section.classList.remove('hidden-time-event');
            var timerEvent = TimerEvent.fromString(section.dataset.timerEvent);
            var sectionMoment = moment(timerEvent.time, 'HH:mm:ss');
            var progress = lastMoment_1.diff(sectionMoment);
            var progressPercent = Math.min(1, 1 - (progress / totalProgress_1));
            var trueProgressPercent = 1 - (progress / totalProgress_1);
            // console.log('progressPercent', i, progressPercent);
            // let y = ease(progressPercent) * timelineHeight;
            var y = (progressPercent) * timelineHeight;
            knobs[i].style.top = Math.floor(y) + "px";
            // console.log(
            //     `(${progress} / ${totalProgress}, ${progressPercent * 100}%)`,
            //     `knobs[i].style.top = ${Math.floor(y)}px`
            // );
            // console.log('hi');
            knobs[i].classList.remove('hidden-time-event');
            for (var i_1 = 0; y < lastY_1 + 16 && i_1 < 1000; i_1++)
                y += 1;
            section.style.top = Math.floor(y) + "px";
            // console.log(`${Math.floor(y)}px`);
            lastY_1 = y;
            var isShowActualTime = section.classList.contains('showActualTime');
            if (isShowActualTime) {
                section.querySelector('.time').innerText = timerEvent.time;
            }
            else {
                var duration = moment.duration(sectionMoment.diff(moment()));
                section.querySelector('.time').innerText = humanize(duration);
            }
        });
    }
    // setTimeout(function () { return updateTimerEvents(); }, 0.5 * 1000);
}
function removeDoneEvents(timeline) {
    var children = Array.from(timeline.querySelectorAll('section.timerEventLabel'));
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
function constructTimelineKnobs(count) {
    var timeline = document.querySelector('.timeline');
    var a = new Array(count).fill(1);
    var newNodes = (a
        .map(function () {
        var template = document.querySelector('#timerEventComponentTemplate .timerEventDot');
        var result = template.cloneNode(true);
        return result;
    }));
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
    var events = (lines
        .map(function (line, i) { return line.match(/\s*?(\d{2}:\d{2}:\d{2})(.*)/); })
        .filter(function (tokens) { return tokens; })
        .map(function (tokens) {
        var time$$1 = tokens[1];
        var title = tokens[2] || '';
        if (title !== '') {
            title = title.trim();
        }
        return new TimerEvent(time$$1, title);
    }));
    return events;
}
function createEventComponent(event) {
    var template = document.querySelector('#timerEventComponentTemplate .timerEventLabel');
    var result = template.cloneNode(true);
    var title = event.title;
    if (title === '')
        title = event.time;
    result.querySelector('.time').innerText = event.time;
    result.querySelector('h3').innerText = title;
    result.addEventListener('pointerenter', function (ev) {
        result.classList.add('showActualTime');
        updateTimerEvents();
    });
    result.addEventListener('pointerleave', function (ev) {
        result.classList.remove('showActualTime');
        updateTimerEvents();
    });
    result.dataset.timerEvent = JSON.stringify(event.toJSON());
    return result;
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
        if (duration.minutes() >= 10)
            return duration.minutes() + " minutes";
        return duration.minutes() + "min " + duration.seconds() + "sec";
    }
    return duration.seconds() + " seconds";
}

}());
//# sourceMappingURL=timerRenderer.js.map
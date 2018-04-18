/// <reference path="./Window.d.ts" />
// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import * as path from 'path';
import * as os from 'os'; // native node.js module

import { remote, ipcRenderer } from 'electron'; // native electron module
const jetpack = require('fs-jetpack'); // module loaded from npm
import { greet, time } from './hello_world/hello_world'; // code authored by you in this project
import env from './env';
import moment from 'moment';
import { SpriteSheet } from './SpriteSheet';

import { scheduleJob } from 'node-schedule';
import { Context } from "./Context";
import { TimerContext } from "./TimerContext";
import { TimerEvent } from "./timer/TimerEvent";

console.log('Loaded environment variables:', env);

window['moment'] = moment;
let app = remote.app;
let appDir = jetpack.cwd(app.getAppPath());
let context: Context;
let timerContext: TimerContext;

const shownEvents = 3;
const timelineHeight = 90;
const shownDuration = moment.duration({ minutes: 30 });
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


document.addEventListener('DOMContentLoaded', function () {
    timerContext = new TimerContext();
    window['parseTimerString'] = parseTimerString;
    window['timerContext'] = timerContext;
    window['createEventComponent'] = createEventComponent;
    window['applyTimes'] = applyTimes;

    (<HTMLTextAreaElement>document.querySelector('#input-times-textbox')).value = timerContext.timerString;
    constructTimeline();
    constructTimelineKnobs(shownEvents);

    updateTime();
});

ipcRenderer.on('context', (sender: any, ctx: Context) => {
    console.log('context', ctx);
    context = ctx;
});

function applyTimes() {

    timerContext.timerString = (<HTMLTextAreaElement>document.querySelector('#input-times-textbox')).value;
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
    const timeline = document.querySelector('div.timeline') as HTMLDivElement;
    const doneEventCount = removeDoneEvents(timeline);

    if (doneEventCount > 0) console.log('doneEventCount: ', doneEventCount);

    const timerEventLabels = (<HTMLElement[]>Array.from(timeline.querySelectorAll('section.timerEventLabel')));
    const knobs = (<HTMLElement[]>Array.from(timeline.querySelectorAll('div.timerEventDot')));

    if (timerEventLabels.length > 0) {
        const lastIndex = Math.min(shownEvents - 1, timerEventLabels.length - 1);
        const lastTimerEvent = TimerEvent.fromString(timerEventLabels[lastIndex].dataset.timerEvent);

        // const lastMoment = moment(lastTimerEvent.time, 'HH:mm:ss');
        const lastMoment = moment().add(shownDuration);
        // const lastMoment = moment().add(10, 'minutes');

        // const totalProgress = lastMoment.diff(moment());
        // const totalProgress = (moment().add(10, 'minutes')).diff(moment());
        const totalProgress = (moment().add(shownDuration)).diff(moment());

        let lastY = -16;
        timerEventLabels.forEach((section, i) => {
            if (i >= shownEvents) {
                section.classList.add('hidden-time-event');
                return;
            }
            section.classList.remove('hidden-time-event');
            const timerEvent = TimerEvent.fromString(section.dataset.timerEvent);
            const sectionMoment = moment(timerEvent.time, 'HH:mm:ss');
            const progress = lastMoment.diff(sectionMoment);

            const progressPercent = Math.min(1, 1 - (progress / totalProgress));
            const trueProgressPercent = 1 - (progress / totalProgress);
            // console.log('progressPercent', i, progressPercent);

            // let y = ease(progressPercent) * timelineHeight;
            let y = (progressPercent) * timelineHeight;

            knobs[i].style.top = `${Math.floor(y)}px`;
            console.log(
                `(${progress} / ${totalProgress}, ${progressPercent * 100}%)`,
                `knobs[i].style.top = ${Math.floor(y)}px`
            );
            // console.log('hi');

            knobs[i].classList.remove('hidden-time-event');

            for (let i = 0; y < lastY + 16 && i < 1000; i++) y += 1;
            section.style.top = `${Math.floor(y)}px`;
            // console.log(`${Math.floor(y)}px`);

            lastY = y;

            const isShowActualTime = section.classList.contains('showActualTime');

            if (isShowActualTime) {
                (<HTMLElement>section.querySelector('.time')).innerText = timerEvent.time;
            } else {
                const duration = moment.duration(sectionMoment.diff(moment()));
                (<HTMLElement>section.querySelector('.time')).innerText = humanize(duration);
            }
        });
    }
    // setTimeout(function () { return updateTimerEvents(); }, 0.5 * 1000);
}

function removeDoneEvents(timeline: HTMLDivElement) {
    const children = (<HTMLElement[]>Array.from(timeline.querySelectorAll('section.timerEventLabel')));
    const doneList = (children
        .filter((section) => {
            const timerEvent = TimerEvent.fromString(section.dataset.timerEvent);
            return moment(timerEvent.time, 'HH:mm:ss').isBefore();
        })
    );
    doneList.forEach((section) => timeline.removeChild(section))
    return doneList.length;
}


function clearTimeline() {
    const timeline = document.querySelector('.timeline');
    const children = (<HTMLElement[]>Array.from(timeline.children));
    children.forEach((section) => {
        section.dataset.timerEvent = '';
        timeline.removeChild(section);
    })
    timeline.innerHTML = '';
}

function constructTimeline() {
    const timeline = document.querySelector('.timeline');
    const a = parseTimerString(timerContext.timerString);
    if (!a) return;
    const newNodes = (a
        .map(createEventComponent)
    );

    newNodes.sort((a, b) => {
        const aEvent = TimerEvent.fromString(a.dataset.timerEvent);
        const bEvent = TimerEvent.fromString(b.dataset.timerEvent);
        const isAfter = moment(aEvent.time, 'HH:mm:ss').isAfter(moment(bEvent.time, 'HH:mm:ss'));
        return isAfter ? 1 : -1;
    });

    newNodes.forEach((elem, i) => {
        elem.style.top = `${20 * i}px`;
        timeline.appendChild(elem);
    });
}

function constructTimelineKnobs(count: number) {
    const timeline = document.querySelector('.timeline');
    const a = new Array(count).fill(1);
    const newNodes: HTMLElement[] = (a
        .map(() => {
            const template = document.querySelector('#timerEventComponentTemplate .timerEventDot');
            const result = template.cloneNode(true) as HTMLElement;

            return result;
        })
    );

    newNodes.forEach((elem, i) => {
        elem.style.top = `${20 * i}px`;
        timeline.appendChild(elem);
    });
}

function parseTimerString(str: string) {
    const lines = str.match(/[^\r\n]+/g);
    // console.log('lines', lines);
    if (!lines) return;
    const events: TimerEvent[] = (lines
        .map((line, i) => line.match(/\s*?(\d{2}:\d{2}:\d{2})(.*)/))
        .filter((tokens) => tokens)
        .map((tokens) => {
            const time = tokens[1];
            let title = tokens[2] || '';
            if (title !== '') {
                title = title.trim();
            }

            return new TimerEvent(time, title);
        })
    );

    return events;
}

function createEventComponent(event: TimerEvent): HTMLElement {
    const template = document.querySelector('#timerEventComponentTemplate .timerEventLabel');
    const result = template.cloneNode(true) as HTMLElement;

    let title = event.title;
    if (title === '') title = event.time;

    (<HTMLElement>result.querySelector('.time')).innerText = event.time;
    (<HTMLElement>result.querySelector('h3')).innerText = title;
    result.addEventListener('pointerenter', (ev: PointerEvent) => {
        result.classList.add('showActualTime');
        updateTimerEvents();
    })
    result.addEventListener('pointerleave', (ev: PointerEvent) => {
        result.classList.remove('showActualTime');
        updateTimerEvents();
    })

    result.dataset.timerEvent = JSON.stringify(event.toJSON());
    return result;
}

function ease(t) {
    // easeOutQuart
    return 1 - (--t) * t * t * t;
}

function humanize(duration: moment.Duration): string {
    if (duration.years() > 0) return `>${duration.years()} years`;
    if (duration.months() > 0) return `>${duration.months()} months`;
    if (duration.days() > 0) return `>${duration.days()} days`;
    if (duration.hours() > 0) return `>${duration.hours()} hours`;
    if (duration.minutes() > 0) {
        if (duration.minutes() >= 10) return `${duration.minutes()} minutes`;
        return `${duration.minutes()}min ${duration.seconds()}sec`;
    }
    return `${duration.seconds()} seconds`;
}

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


document.addEventListener('DOMContentLoaded', function () {
    timerContext = new TimerContext();
    window['parseTimerString'] = parseTimerString;
    window['timerContext'] = timerContext;
    window['createEventComponent'] = createEventComponent;
    window['applyTimes'] = applyTimes;

    constructTimeline();

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
}

function updateTime() {
    document.querySelector('#clock').innerHTML = time();
    updateTimerEvents();

    setTimeout(function () { return updateTime(); }, 0.5 * 1000);
}

function updateTimerEvents() {
    const shownEvents = 3;
    const timelineHeight = 90;
    const timeline = document.querySelector('div.timeline') as HTMLDivElement;
    const doneEventCount = removeDoneEvents(timeline);
    if (doneEventCount > 0) console.log('doneEventCount: ', doneEventCount);

    const children = (<HTMLElement[]>Array.from(timeline.querySelectorAll('section')));

    if (children.length > 0) {
        const lastIndex = Math.min(shownEvents - 1, children.length - 1);
        const lastTimerEvent = TimerEvent.fromString(children[lastIndex].dataset.timerEvent);
        const lastMoment = moment(lastTimerEvent.time, 'HH:mm:ss');
        const totalProgress = lastMoment.diff(moment());

        let lastY = -20;
        children.forEach((section, i) => {
            if (i >= shownEvents) {
                section.classList.add('hidden-time-event');
                return;
            }
            section.classList.remove('hidden-time-event');
            const timerEvent = TimerEvent.fromString(section.dataset.timerEvent);
            const sectionMoment = moment(timerEvent.time, 'HH:mm:ss');
            const progress = lastMoment.diff(sectionMoment);
            const progressPercent = 1 - (progress / totalProgress);
            // console.log('progressPercent', i, progressPercent);
            let y = ease(progressPercent) * timelineHeight;
            for (let i = 0; y < lastY + 20 && i < 10; i++) y += 20;
            section.style.top = `${y}px`;
            lastY = y;

            const duration = moment.duration(sectionMoment.diff(moment()));
            (<HTMLElement>section.querySelector('.time')).innerText = humanize(duration);
        });
    }
    // setTimeout(function () { return updateTimerEvents(); }, 0.5 * 1000);
}

function removeDoneEvents(timeline: HTMLDivElement) {
    const children = (<HTMLElement[]>Array.from(timeline.children));
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

function parseTimerString(str: string) {
    const lines = str.match(/[^\r\n]+/g);
    // console.log('lines', lines);
    if (!lines) return;
    const events: TimerEvent[] = lines.map((line, i) => {
        const tokens = line.match(/\s*(\d{2}:\d{2}:\d{2})(.*)/);
        // console.log('tokens', i, tokens);
        const time = tokens[1];
        let title = tokens[2] || '';
        if (title !== '') {
            title = title.trim();
        }

        return new TimerEvent(time, title);
    });

    return events;
}

function createEventComponent(event: TimerEvent): HTMLElement {
    const template = document.querySelector('#timerEventComponentTemplate').children[0];
    const result = template.cloneNode(true) as HTMLElement;

    let title = event.title;
    if (title === '') title = event.time;

    (<HTMLElement>result.querySelector('.time')).innerText = event.time;
    (<HTMLElement>result.querySelector('h3')).innerText = title;

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
        if (duration.minutes() > 10) return `${duration.minutes()} minutes`;
        return `${duration.minutes()}min ${duration.seconds()}sec`;
    }
    return `${duration.seconds()} seconds`;
}

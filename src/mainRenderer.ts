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

console.log('Loaded environment variables:', env);

window['moment'] = moment;
var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());
var context: Context;
var spriteSheet = new SpriteSheet({
  filename: './sprites/sheep.png',
  rows: 11,
  cols: 16,
  frameWidth: 40,
  frameHeight: 40,
  spacingX: 0,
  spacingY: 1,
});

var animID = 1;

window.spriteSheet = spriteSheet; // for debug

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);

document.addEventListener('DOMContentLoaded', function () {
  document.body.appendChild(spriteSheet.createDiv('sheep', 2));
  document.querySelector('#subtitle__edit').innerHTML = greet(context);
  document.querySelector('#subtitle__edit').addEventListener('click', () => {
    console.log('clicked');
    document.querySelector('#subtitle__edit').innerHTML = greet(context);
  });
  document.querySelector('#frame_id_minus').addEventListener('click', () => {
    if (context) {
      animID = (animID - 1) % context.animationSet.animations.length;
      console.log(`animID changed to ${animID}`);

    }
  });

  document.querySelector('#frame_id_plus').addEventListener('click', () => {
    if (context) {
      animID = (animID + 1) % context.animationSet.animations.length;
      console.log(`animID changed to ${animID}`);

    }
  });

  // document.getElementById('subtitle').innerHTML = os.platform();
  // document.getElementById('env-name').innerHTML = env.name;
  initChime();
  updateGreet();
  updateFrame(0, +1);
});

function updateGreet() {
  document.querySelector('#clock').innerHTML = time();
  // console.log('a');

  setTimeout(() => updateGreet(), 0.5 * 1000);
}
var frames = [9, 10, 11, 10];
var i = 0;
function updateFrame(deltaBefore: number, delta: number, delay = 0) {
  // console.log('updateFrame', deltaBefore, delta, delay, context);
  var div = <HTMLDivElement>document.querySelector('#sheep');
  // var frameID = frames[i % frames.length];

  if (!context) {
    var frameID = (i + delta) % spriteSheet.keyCount;
    spriteSheet.setDivStyle(div, frameID);
    i += delta;
    // i++;
    // console.log('a');

    (<HTMLDivElement>document.querySelector('#frame_id')).innerText = '' + frameID;
    setTimeout(() => updateFrame(0, +1), 2 * 1000);
  } else {
    var anim = context.animationSet.animations[animID];
    var frame = anim.frames[i % anim.frames.length];
    var frameID = frame.frameID;
    // console.log('hi1', i, frame);
    spriteSheet.setDivStyle(div, frameID);
    i += delta;
    // i++;
    // console.log('a');

    setTimeout(() => {
      // console.log('hi2');

      (<HTMLDivElement>document.querySelector('#frame_id')).innerText = '' + frameID;
      updateFrame(0, +1);
    }, frame.delay * 1000);
  }
}

function initChime() {
  scheduleJob('0 * * * *', () => {
    console.log('chime', moment().format('HH:mm:ss'));

    document.getElementById('clock').classList.add('clock--chime');
  });
}

ipcRenderer.on('context', (sender: any, ctx: Context) => {
  console.log('context', ctx);
  context = ctx;
});


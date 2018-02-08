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
window['spriteSheet'] = spriteSheet;

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

  // document.getElementById('subtitle').innerHTML = os.platform();
  // document.getElementById('env-name').innerHTML = env.name;
  initChime();
  updateGreet();
  updateFrame();
});

function updateGreet() {
  document.querySelector('#clock').innerHTML = time();
  // console.log('a');

  setTimeout(() => updateGreet(), 0.5 * 1000);
}
var frames = [9, 10, 11, 10];
var i = 0;
function updateFrame() {
  spriteSheet.setDivStyle(
    <HTMLDivElement>document.querySelector('#sheep'),
    frames[(i++) % frames.length]
    // i
  );
  // i = (i + 1) % spriteSheet.keyCount;
  // console.log('a');

  setTimeout(() => updateFrame(), 2 * 1000);
}

function initChime() {
  scheduleJob('0 * * * *', () => {
    console.log('chime', moment().format('HH:mm:ss'));

    document.getElementById('clock').className += ' clock--chime';
  });
}

ipcRenderer.on('context', (sender: any, ctx: Context) => {
  console.log('context', ctx);
  context = ctx;
});

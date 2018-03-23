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
document.addEventListener('DOMContentLoaded', function () {

});

ipcRenderer.on('context', (sender: any, ctx: Context) => {
  console.log('context', ctx);
  context = ctx;
});


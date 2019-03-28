(function () {'use strict';

var electron = require('electron');
var _moment = require('moment');
var nodeSchedule = require('node-schedule');

var moment$1 = _moment;
var greet = function (context) {
    if (!context)
        return 'Hello World!';
    var config = context.config;
    return config.greetings;
    // return helloWorldString.replace('%1', moment().format(timeFormat));
};
var time = function (timeFormat) {
    if (timeFormat === void 0) { timeFormat = 'HH:mm:ss'; }
    return moment$1().format(timeFormat);
};

// Simple wrapper exposing environment variables to rest of the code.
var jetpack$1 = require('fs-jetpack');
// The variables have been written to `env.json` by the build process.
var env = jetpack$1.cwd(__dirname).read('env.json', 'json');

var SpriteSheet = /** @class */ (function () {
    function SpriteSheet(opts) {
        this.filename = '';
        this.rows = 0;
        this.cols = 0;
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.spacingX = 0;
        this.spacingY = 0;
        this._keyCount = 0;
        Object.assign(this, opts);
        this._keyCount = this.rows * this.cols;
    }
    Object.defineProperty(SpriteSheet.prototype, "keyCount", {
        get: function () {
            return this._keyCount;
        },
        enumerable: true,
        configurable: true
    });
    SpriteSheet.prototype.getCoord = function (id) {
        if (id > (this.keyCount)) {
            throw "id " + id + " out of bound";
        }
        var colID = id % this.cols;
        var rowID = Math.floor(id / this.cols);
        // console.log(`getCoord ${id} ${this.cols}: ${colID} ${rowID}`);
        return {
            x: -1 * colID * (this.frameWidth + this.spacingX),
            y: -1 * rowID * (this.frameHeight + this.spacingY),
        };
    };
    SpriteSheet.prototype.setDivStyle = function (div, frameId) {
        var coord = this.getCoord(frameId);
        div.style.backgroundImage = "url(" + this.filename + ")";
        div.style.backgroundPositionX = coord.x + "px";
        div.style.backgroundPositionY = coord.y + "px";
        div.style.width = this.frameWidth + "px";
        div.style.height = this.frameHeight + "px";
        // div.style.transform = (
        //     Math.random() > 0.5 ? 'scaleX(1)' : 'scaleX(-1)'
        // );
    };
    SpriteSheet.prototype.createDiv = function (name, idOrKey) {
        if (typeof idOrKey === "string") {
            var id_1 = this.keyToId(idOrKey);
            return this.createDiv(name, 0);
        }
        var id = idOrKey;
        var div = document.createElement('div');
        div.id = name;
        this.setDivStyle(div, id);
        return div;
    };
    SpriteSheet.prototype.keyToId = function (key) {
        if (this.keyList)
            throw '';
        return this.keyList[key].id;
    };
    
    return SpriteSheet;
}());

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
    document.querySelector('#subtitle__edit').addEventListener('click', function () {
        console.log('clicked');
        document.querySelector('#subtitle__edit').innerHTML = greet(context);
    });
    document.querySelector('#frame_id_minus').addEventListener('click', function () {
        if (context) {
            animID = (animID - 1) % context.animationSet.animations.length;
            console.log("animID changed to " + animID);
        }
    });
    document.querySelector('#frame_id_plus').addEventListener('click', function () {
        if (context) {
            animID = (animID + 1) % context.animationSet.animations.length;
            console.log("animID changed to " + animID);
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
    setTimeout(function () { return updateGreet(); }, 0.5 * 1000);
}
var i = 0;
function updateFrame(deltaBefore, delta, delay) {
    if (delay === void 0) { delay = 0; }
    // console.log('updateFrame', deltaBefore, delta, delay, context);
    var div = document.querySelector('#sheep');
    // var frameID = frames[i % frames.length];
    if (!context) {
        var frameID = (i + delta) % spriteSheet.keyCount;
        spriteSheet.setDivStyle(div, frameID);
        i += delta;
        // i++;
        // console.log('a');
        document.querySelector('#frame_id').innerText = '' + frameID;
        setTimeout(function () { return updateFrame(0, +1); }, 2 * 1000);
    }
    else {
        var anim = context.animationSet.animations[animID];
        var frame = anim.frames[i % anim.frames.length];
        var frameID = frame.frameID;
        // console.log('hi1', i, frame);
        spriteSheet.setDivStyle(div, frameID);
        i += delta;
        // i++;
        // console.log('a');
        setTimeout(function () {
            // console.log('hi2');
            document.querySelector('#frame_id').innerText = '' + frameID;
            updateFrame(0, +1);
        }, frame.delay * 1000);
    }
}
function initChime() {
    nodeSchedule.scheduleJob('0 * * * *', function () {
        console.log('chime', moment().format('HH:mm:ss'));
        document.getElementById('clock').classList.add('clock--chime');
    });
}
electron.ipcRenderer.on('context', function (sender, ctx) {
    console.log('context', ctx);
    context = ctx;
});

}());
//# sourceMappingURL=mainRenderer.js.map
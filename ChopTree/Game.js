// system / library
const schedule = require('node-schedule');
const moment = require('moment');

// my stuff
const Player = require('./Player');

// init modules


function getTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
}

// class proper
class Game {
    constructor(input) {
        /**
         * @type Input
         */
        this.input = input;
        this.player = null;
        this.modules = {};
    }
    init() {
        this.modules['ChopTree'] = new ChopTree(this, this.input);
        this.input.onLineReceived.add((evt) => {
            const { input } = evt;
            if (input === 'help') {
                this.input.render(`chop desc help`);
            }
            if (input === 'desc') {
                this.input.render(`Description of Player`);
                this.input.render(this.player.desc());
            }
            if (input === 'chop') {
                this.input.render(`Player start chopping`);
                this.player.action = 'chop';
            }
        });
        this.input.init();
    }
    setUpStage() {
        this.player = new Player(this, this.input);
    }
    start() {
        this.setUpStage();
        const chalkDebug = this.input.chalkDebug;
        schedule.scheduleJob('0 * * * * *', (fireDate) => {
            this.input.render(chalkDebug(`/Minute tick ${getTime()}`));
        });
        schedule.scheduleJob('0 /30 * * * *', (fireDate) => {
            this.input.render(chalkDebug(`/Half-hour tick ${getTime()}`));

            this.player.updateState();
        });
        schedule.scheduleJob('10,20,30,40,50,0 * * * * *', (fireDate) => {
            this.input.render(chalkDebug(`/10s tick ${getTime()}`));
            if (this.player.action === 'chop') {
                this.modules['ChopTree'].tryChopTree(this.player);
            }
        });

        this.input.render(
            `Game start\n` +
            `type /help for help, type /exit to leave`);
        this.input.prompt();
    }
}

class ChopTree {
    constructor(game, input) {
        this.game = game;
        this.input = input;
        this.chance = 0.8;
    }

    tryChopTree(player) {
        const diceDraw = Math.random();
        if (diceDraw <= this.chance) {
            // success
            this.input.render(`${player.name} chops a tree and collect 1 piece of wood`);
            player.inventory.add('wood', 1);
        } else {
            // fail
            this.input.render(`${player.name} swings at a tree but no wood come out`);
        }
    }
}
Game.ChopTree = ChopTree;
module.exports = Game;
// system / library
const schedule = require('node-schedule');
const moment = require('moment');

// my stuff
const Player = require('./Player');
const { Tree } = require('./Tree');
const { Room } = require('./Room');

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
        this.modules = {};

        this.player = null;
        this.room = null;
    }
    init() {
        this.modules['ChopTree'] = new ChopTree(this, this.input);
        this.input.onLineReceived.add((evt) => {
            const { input } = evt;
            if (input === 'help') {
                this.input.render(`chop desc room help`);
            }
            if (input === 'desc') {
                this.input.render(this.player.desc());
            }
            if (input === 'room') {
                this.input.render(this.room.desc());
            }
            if (input === 'chop') {
                this.input.render(`Player start chopping`);
                this.player.action = 'chop';
            }
        });
        this.input.init();
    }
    setUpStage() {
        this.room = new Room(this, this.input);
        this.player = new Player(this, this.input);
        this.room.add(new Tree(this, this.input));
    }
    start() {
        this.setUpStage();
        const chalkDebug = this.input.chalkDebug;
        schedule.scheduleJob('0 * * * * *', (fireDate) => {
            // this.input.render(chalkDebug(`/Minute tick ${getTime()}`));
        });
        schedule.scheduleJob('0 /30 * * * *', (fireDate) => {
            // this.input.render(chalkDebug(`/Half-hour tick ${getTime()}`));

            this.player.updateState();
        });
        schedule.scheduleJob('10,20,30,40,50,0 * * * * *', (fireDate) => {
            // this.input.render(chalkDebug(`/10s tick ${getTime()}`));
            if (this.player.action === 'chop') {
                const tree = this.room.getEntityByType('tree');
                if (tree) {
                    this.modules['ChopTree'].tryChopTree(this.player, tree);
                } else {
                    this.input.render(`No tree to chop`);
                    this.player.action = '';
                }
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

    tryChopTree(player, tree) {
        // before chop
        if (player.inventory.get('wood') >= 100) {
            this.input.render(`${player.name}'s bag is full of wood.`);
        }
        if (tree.durability <= 0) {
            this.input.render(`${tree.name} is already fell`);
            player.action = '';
            return;
        }

        // chop
        const items = tree.chop(1);
        items.forEach(({ item, amount, actionDesc }) => {
            this.input.render(actionDesc.replace('%p', player.name));
            player.inventory.add(item, amount);
        })

        // after chop
        if (player.inventory.get('wood') >= 100) {
            this.input.render(`${player.name}'s bag is full of wood.`);
            player.action = '';
        }
        if (tree.durability <= 0) {
            this.input.render(`${tree.name} falls down with a big splash`);
            player.action = '';
        }
    }
}
Game.ChopTree = ChopTree;
module.exports = Game;
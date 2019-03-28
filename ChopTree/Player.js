const { indent } = require('./Utils');
const { wood } = require('./Items');

module.exports = class Player {
    constructor(game, input) {
        this.game = game;
        this.input = input;

        this.name = 'Player';
        this.health = new Health();
        this.hunger = new Hunger();
        this.mood = new Mood();

        this.action = '';

        this.inventory = new Inventory(this);
    }

    updateState() {
        const chalkDebug = this.input.chalkDebug;
        if ((this.hunger.value <= 0 || this.mood.value <= 0) && this.health.value > 0) {
            this.input.render(chalkDebug(`/Player take damage from hunger(${this.hunger.value}) or mood(${this.mood.value})`));
            this.health.value = Math.max(this.health.value - 1, 0);
        }
        if ((this.hunger.value <= 0) && this.mood.value > 0) {
            this.input.render(chalkDebug(`/Player take mood damage from hunger(${this.hunger.value})`));
            this.mood.value = Math.max(this.mood.value - 1, 0);
        }
    }

    desc() {
        return `Player\n` +
            `name: ${this.name}\n` +
            `health: ${this.health.desc()} hunger: ${this.hunger.desc()} mood: ${this.mood.desc()}\n` +
            `action: ${this.action}\n` +
            `inventory: \n` +
            `${indent(this.inventory.desc(), ' ', 2)}\n` +
            ``;
    }
}

class Hunger {
    constructor() {
        this.value = 4;
        this.lastFedTime = null;
    }
    update() {

    }
    desc() {
        return '' + this.value;
    }
}

class Mood {
    constructor() {
        this.value = 4;
        this.lastPlayedTime = null;
    }
    update() {

    }
    desc() {
        return '' + this.value;
    }
}

class Health {
    constructor() {
        this.value = 4;
        this.wounded = false;
    }
    update() {

    }
    desc() {
        return '' + this.value;
    }
}

class Inventory {
    constructor(player) {
        this.player = player;
        this.store = {};
    }
    add(key, val) {
        if (!this.has(key)) this.store[key] = 0;
        this.store[key] += val;

        const deltaString = val > 0 ? '+' + val : val;
        this.player.input.render(`${key} ${deltaString}(${this.store[key]})`);
    }
    has(key) {
        return this.store[key] != null && this.store[key] > 0;
    }
    get(key) {
        return this.store[key];
    }
    set(key, val) {
        this.store[key] = val;
    }
    desc() {
        const entries = Object.entries(this.store);
        if (entries.length <= 0) return `empty`;
        return entries
            .map(([key, val]) => `${key}: ${val}`)
            .join('\n')
            ;
    }
}


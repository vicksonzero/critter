
const { Signal } = require('signals');
const { indent } = require('./Utils');
class Room {
    constructor(game, input) {
        this.game = game;
        this.input = input;
        this.displayList = [];
        this.listUpdated = new Signal();
    }

    desc() {
        return `Room\n` +
            (this.displayList
                .map((item, i) => `${i + 1}.\n${indent(item.desc(), ' ', 2)}`)
                .join('\n')
            ) +
            ``;
    }

    add(entity) {
        this.displayList.push(entity);
        this.listUpdated.dispatch();
    }

    getEntityByType(typeName) {
        const entity = this.displayList.find((entity) => entity.type === typeName);
        return entity;
    }
}

exports.Room = Room;

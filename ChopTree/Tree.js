class Tree {
    constructor(game, input) {
        this.durability = 1000;
        this.type = 'tree';
        this.name = 'tree';
        this.lootTable = [
            { name: '1 wood', item: 'wood', amount: 1, weight: 10, actionDesc: '%p chops a tree and collect 1 piece of wood' },
            { name: '2 wood', item: 'wood', amount: 2, weight: 3, actionDesc: '%p chops extra hard at a tree and collect 2 pieces of wood' },
            { name: '1 apple', item: 'apple', amount: 1, weight: 4, actionDesc: '%p shakes a tree and an apple falls from it' },
            { name: 'none', item: 'wood', amount: 0, weight: 1, actionDesc: '%p swings at a tree but no wood come out' },
        ];
    }

    chop(strength) {
        const items = [];
        let cumulative = 0;
        for (let i = 0; i < this.lootTable.length; i++) {
            cumulative += this.lootTable[i].weight;
            this.lootTable[i].cumulativeWeight = cumulative;
        }
        const totalWeight = cumulative;

        const diceDraw = Math.random() * totalWeight;
        const entry = this.lootTable.find((entry) => entry.cumulativeWeight >= diceDraw);

        if (entry) {
            items.push({ ...entry });
            this.durability -= strength;
        }

        return items;
    }

    desc() {
        return `Tree\n` +
            `name: ${this.name}\n` +
            `durability: ${this.durability}\n` +
            ``;
    }
}

exports.Tree = Tree;

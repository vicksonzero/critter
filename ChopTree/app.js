const readline = require('readline');
const chalk = require('chalk');
const { Signal } = require('signals');
const moment = require('moment');

const Game = require('./Game');

const ChopTree = new Game.ChopTree();

class Input {
    constructor() {
        this.chalkDebug = chalk.underline.gray;
        this.onLineReceived = new Signal();
    }
    init() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: (line) => {
                const completions = 'help /help /error /exit /quit /q :q'.split(' ');
                const hits = completions.filter((c) => c.startsWith(line));
                // show all completions if none found
                return [hits.length ? hits : completions, line];
            }
        });

        this.rl.on('line', (input) => {
            this.render(this.chalkDebug(`/Received: ${input}`));
            const lowInput = input.toLowerCase();
            const evt = {
                input,
                lowInput,
                stopPropagation() { this.allowPropagation = false },
                allowPropagation: true,
            };

            if (evt.allowPropagation) {
                const wantToExit = (
                    evt.lowInput == '/exit' ||
                    evt.lowInput == '/quit' ||
                    evt.lowInput == '/q' ||
                    evt.lowInput == ':q'
                );
                if (wantToExit) {
                    this.render('Goodbye', false);
                    this.rl.close();
                    process.exit(0);
                    evt.stopPropagation();
                }
            }

            if (evt.allowPropagation) {
                this.onLineReceived.dispatch(evt);
            }
        });
        this.rl.setPrompt(`${'Input   '} > `);
    }
    render(str, doPrompt = true) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        const str2 = (str.split('\n')
            .map((line, i) => {
                if (i === 0) return `${this.getTimePart()} ${line}`;
                return `${'        '} ${line}`;
            })
            .join('\n')
        );
        process.stdout.write(str2);
        process.stdout.write("\n"); // end the line
        // const display = `time=${moment().format('YYYY-MM-DD HH:mm:ss')} tick=${i}`;
        if (doPrompt) this.rl.prompt(true);
    }

    prompt() {
        this.rl.prompt(true);
    }

    getTimePart() {
        return chalk.green(moment().format('HH:mm:ss'));
    }
}


const input = new Input();
const game = new Game(input);

game.init();
game.start();
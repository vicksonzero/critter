const readline = require('readline');
const schedule = require('node-schedule');
const moment = require('moment');
const chalk = require('chalk');

const chalkDebug = chalk.underline.gray;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line) => {
        const completions = '/help /error /exit /quit /q'.split(' ');
        const hits = completions.filter((c) => c.startsWith(line));
        // show all completions if none found
        return [hits.length ? hits : completions, line];
    }
});

rl.on('line', (input) => {
    render(`Received: ${input}`);

    if (input == '/exit') {
        rl.close();
        process.exit(0);
    }
});


// rl.question('What is your favorite food? ', (answer) => {
//     render(`Oh, so your favorite food is ${answer}`);
// });

let i = 0;
setInterval(() => {
    i++;
    // render();
}, 500);

schedule.scheduleJob('0 * * * * *', (fireDate) => {
    render(chalkDebug(`/Minute tick ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
});
schedule.scheduleJob('* /30 * * * *', (fireDate) => {
    render(chalkDebug(`/Half-hour tick ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
});
schedule.scheduleJob('10,20,30,40,50,0 * * * * *', (fireDate) => {
    render(chalkDebug(`/10s tick ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
});
rl.prompt(true);


function render(str) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(str);
    process.stdout.write("\n"); // end the line
    // const display = `time=${moment().format('YYYY-MM-DD HH:mm:ss')} tick=${i}`;
    // rl.setPrompt(`${display} > `);
    rl.prompt(true);
}

class Input {

}

class Game {

}

class Player {

}
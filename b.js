const inquirer = require('inquirer');
const Rx = require('rx');

const prompts = new Rx.Subject();
// const ui = new inquirer.ui.BottomBar();
// const moment = require('moment');

// pipe a Stream to the log zone
// process.stdout.pipe(ui.log);
// process.stdin.pipe(ui.log);

onEachAnswer = () => {

};
onError = () => {

};
onComplete = () => {

};
inquirer.prompt(prompts).ui.process.subscribe(
    onEachAnswer,
    onError,
    onComplete
);


// // // Or simply write output
// ui.log.write('something just happened.');
// ui.log.write('Almost over, standby!');

// // // During processing, update the bottom bar content to display a loader
// // // or output a progress bar, etc
// ui.updateBottomBar('new bottom bar content');
// // ui.log.on('data', (chunk) => {
// //     ui.log.write('got it!' + chunk);
// // })

setInterval(() => {
    ui.updateBottomBar('hi' + moment().format('YYYYMMDD HH:mm:ss'));
}, 1000);
console.log('hi');
setInterval(() => { console.log('hi'); }, 1000);
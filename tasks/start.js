'use strict';

var childProcess = require('child_process');
var electron = require('electron');
var gulp = require('gulp');

gulp.task('start', ['build', 'watch'], function () {
    console.log('start electron :)');
    childProcess.spawn(electron, ['.'], {
        stdio: 'inherit'
    })
    .on('close', function () {
        // User closed the app. Kill the host process.
        process.exit();
    });
});

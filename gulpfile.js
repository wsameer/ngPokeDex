'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps');

var PATH = [
    './app/src/app.module.js',
    './app/src/app.config.js',
    './app/src/modules/**/*.js',
    './app/src/shared/**/*.js',
    './app/src/core/**/*.js'
];

var LESS_PATH = [
    'app/assets/less/index.less',
    'app/src/modules/**/*.less',
];

gulp.task('build-js', function () {
    return gulp.src(PATH)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./app/dist'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./app/dist'));
});

gulp.task('less', function () {
    return gulp.src(LESS_PATH)
        .pipe(sourcemaps.init())
        .pipe(concat('./style.less'))
        .pipe(less())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./app/dist/css'));
});

gulp.task('watch', function() {
    gulp.watch(LESS_PATH, ['less']);  // Watch all the .less files, then run the less task
});

gulp.task('default', gulp.series(['build-js', 'less'], function () { }));
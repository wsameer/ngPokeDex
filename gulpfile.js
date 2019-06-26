'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

var PATH = [
    './app/src/app.module.js', 
    './app/src/app.config.js', 
    './app/src/components/**/*.js', 
    './app/src/shared/**/*.js',
    './app/src/core/**/*.js'
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

gulp.task('default', gulp.series('build-js', function () { }));
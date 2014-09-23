'use strict'

var gulp = require('gulp');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var stylus = require('gulp-stylus');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var reload = browserSync.reload;
var traceur = require('gulp-traceur');
var sourcemaps = require('gulp-sourcemaps');


var APP_SRC = './app_src';
var APP_DEPLOY = './dist/public';

var onError = function (err) { 
  console.log(err);
  gutil.beep();
}

gulp.task('clean', function (cb) {
  var rimraf = require('rimraf');
  rimraf('./dist', cb);
});

var paths = {
  scriptsSrc: APP_SRC + '/scripts/*.js',
  scriptsDest: APP_DEPLOY + '/scripts/',
  htmlSrc: APP_SRC + '/index.html',
  htmlDest: APP_DEPLOY,
  stylesSrc: APP_SRC + '/styles/*.styl',
  stylesDest: APP_DEPLOY + '/css/',
  cssSrc: APP_SRC + '/css/*.css',
  imagesSrc: APP_SRC + '/images/*',
  imagesDest: APP_DEPLOY + '/images/',
  partialsSrc: APP_SRC + '/partials/*.html',
  partialsDest: APP_DEPLOY + '/partials/',
  traceurSrc: APP_SRC + '/ecma6/*.js'
}

gulp.src(APP_SRC + '/bower_components/angular/angular.js')
    .pipe(gulp.dest(APP_DEPLOY + '/components/'));
gulp.src(APP_SRC + '/bower_components/angular-ui-router/release/angular-ui-router.js')
    .pipe(gulp.dest(APP_DEPLOY + '/components/'));
gulp.src(APP_SRC + '/bower_components/ui-grid.js')
    .pipe(gulp.dest(APP_DEPLOY + '/components'));

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: APP_DEPLOY
    }
  });
  
  gulp.watch(paths.stylesSrc, ['styles']);
  gulp.watch(paths.cssSrc, ['css']);
  gulp.watch(paths.imagesSrc, ['images']);
  gulp.watch(paths.htmlSrc, ['html']);
  gulp.watch(paths.scriptsSrc, ['lint', 'scripts']);
  gulp.watch(paths.partialsSrc, ['partials']);
  gulp.watch(paths.traceurSrc, ['traceur'])
});

gulp.task('lint', function () {
  return gulp.src(paths.scriptsSrc)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  console.log("Scripting : " + paths.scriptsSrc);
  return gulp.src(paths.scriptsSrc)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest(paths.scriptsDest))
    .pipe(reload({stream:true}));
});

gulp.task('styles', function () {
  console.log("Styling : " + paths.stylesSrc);
  return gulp.src(paths.stylesSrc)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(stylus())
    .pipe(gulp.dest(paths.stylesDest))
    .pipe(reload({stream:true}));
});

gulp.task('css', function () {
  console.log("CSSing : " + paths.cssSrc);
  return gulp.src(paths.cssSrc)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest(paths.stylesDest))
    .pipe(reload({stream:true}));
});

gulp.task('images', function () {
  console.log("Imaging : " + paths.imagesSrc);
  return gulp.src(paths.imagesSrc)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest(paths.imagesDest))
    .pipe(reload({stream:true}));
});

gulp.task('html', function() {
  console.log("Initing : " + paths.htmlSrc);
  return gulp.src(paths.htmlSrc)
   .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest(paths.htmlDest))
    .pipe(reload({stream:true}));
});

gulp.task('partials', function () {
  console.log("Partialing : " + paths.partialsSrc);
  return gulp.src(paths.partialsSrc)
   .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest(paths.partialsDest))
    .pipe(reload({stream:true}));
});

gulp.task('traceur', function () {
  console.log("Traceuring : " + paths.traceurSrc);
  return gulp.src(paths.traceurSrc)
    .pipe(sourcemaps.init())
    .pipe(traceur())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scriptsDest))
});

gulp.task('default', ['server', 'styles', 'css', 'lint', 'scripts', 'html', 'partials', 'images', 'traceur']);

var gulp  = require('gulp');
var browserify = require('gulp-browserify');
var shell = require('gulp-shell')
var concat = require('gulp-concat')
var File = require('vinyl');
var fs = require('fs');
var path = require('path');
var brfs = require('gulp-brfs');
var gutil = require('gulp-util');
var debug = false;

function registerBrowserify(name){
  var taskName = "browserify-"+name;
  gulp.task(taskName, function(){
    gulp.src(name+".js")
    .pipe(brfs())
    .pipe(browserify())
    .on('error', onError)
    .pipe(gulp.dest('../static'));
  });  
}


function onError(err) {
  console.error(err);
  this.emit('end');
}

registerBrowserify('app');

gulp.task('debug', function() {  
  debug = true;
  gutil.log( gutil.colors.green('RUNNING IN DEBUG MODE') );
  gulp.start('default');
});

gulp.task('default', function(){
  gulp.watch(['app.js', '**/*.js' ,'!gulpfile.js'], ['browserify-app']);
})




var gulp   = require('gulp');
var sass   = require('gulp-sass');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var csso   = require('gulp-csso');

gulp.task('jshint', function() {
	return gulp.src('source/js/youtubepicker.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('js', ['jshint'], function() {
	return gulp.src(['source/js/youtubepicker.js'])
		.pipe(rename('youtubepicker.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify({
			preserveComments: 'all'
		}))
		.pipe(rename('youtubepicker.min.js'))
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('css', function() {
	return gulp.src('source/css/youtubepicker.scss')
		.pipe(sass({
			style: 'expanded',
			sourcemap: false
		})
		.on('error', sass.logError))
		.pipe(gulp.dest('dist/css'))
		.pipe(csso())
		.pipe(rename('youtubepicker.min.css'))
		.pipe(gulp.dest('dist/css/'));
});

gulp.task('watch', function() {
	gulp.watch('source/css/*.scss', ['css']);
	gulp.watch('source/js/*.js', ['js']);
});

gulp.task('default', ['js', 'css']);
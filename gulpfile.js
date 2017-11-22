var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cp = require('child_process'),
    rename = require('gulp-rename'),
    cleancss = require('gulp-clean-css'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jekyll = require('gulp-jekyll');

gulp.task('sass', () => {
    gulp.src('src/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleancss())
        .pipe(concat('style.css'))
        .pipe(autoprefixer())
        .pipe(rename({
            basename: 'style',
            extname: '.min.css'
        }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({ message: 'Styles task sdfsdfsdfcomplete' }));
});
gulp.task('js',() => {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('scripts.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});
gulp.task('clean', () => {
    return gulp.src(['sass', 'js'], { read: false })
        .pipe(clean());
});
gulp.task('copy', ['clean'], function () {
    return gulp.src('src/img/*')
        .pipe(gulp.dest('assets/img'));
});
gulp.task('clean', () => {
    return gulp.src('assets/img/')
        .pipe(clean());
});
gulp.task('build-img',  () => {

    return gulp.src('assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('assets/img'));
});
gulp.task('watch',  () => {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch(['assets/css/*.min.css', 'index.html', '_includes/*.html', '_layouts/*.html', '*.md', '_posts/*'], ['jekyll-rebuild']);
});
gulp.task('jekyll-build',  done => {
    browserSync.notify('Building Jekyll');
    return cp.spawn('jekyll', ['build'], { stdio: 'inherit' })
        .on('close', done);
});
gulp.task('jekyll-rebuild', ['jekyll-build'],  () => {
    browserSync.reload();
});
gulp.task('browser-sync', ['jekyll-build'],  () => {
    browserSync({
        server: {
            baseDir: '_site'
        },
        host: "localhost"
    });
});

gulp.task('default', () => {
    gulp.start('sass', 'js', 'copy', 'build-img', 'watch', 'browser-sync');
});

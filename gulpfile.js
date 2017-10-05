var gulp    = require('gulp'),
imagemin    = require('gulp-imagemin'),
clean       = require('gulp-clean'),
plumber     = require('gulp-plumber'),
browserSync = require('browser-sync'),
sass        = require('gulp-sass'),
autoprefixer= require('gulp-autoprefixer'),
cp         = require('child_process'),
rename     = require('gulp-rename'),
minifycss  = require('gulp-minify-css'),
notify     = require('gulp-notify'),
jshint     = require('gulp-jshint'),
concat     = require('gulp-concat'),
uglify     = require('gulp-uglify'),
jekyll     = require ('gulp-jekyll');

/*COMEÇA O SERVIDOR COM O JEKYLL E O BROWSER */
gulp.task('jekyll-build', function (done) {
    browserSync.notify('Building Jekyll');
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});


gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        host: "localhost"
    });
});

/*TERMINA O SERVIDOR COM O JEKYLL E O BROWSER */






gulp.task('sass', function() {
    gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifycss())
        .pipe(concat('style.css'))
        .pipe(rename({
            basename: 'style',
            extname: '.min.css'
        }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Styles task complete' }));
});




/*COMEÇO DO JS*/
gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
/*FINAL DO CSS*/



/*LIMPAR A PASTA css e js*
gulp.task('clean', function() {
  return gulp.src(['sass', 'js'], {read: false})
    .pipe(clean());
});

/* final da LIMPAR A PASTA css e js*/







/*IMAGEM
gulp.task('copy', ['clean'], function() {
    return gulp.src('src/**//*')
        .pipe(gulp.dest('assets'));
});

gulp.task('clean', function() {
    return gulp.src('assets')
        .pipe(clean());
});

gulp.task('build-img', function() {

  return gulp.src('assets/img/**//*')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img'));
});

/*IMAGEM*/


/* COMEÇO ASSISTA OS ARQUIVOS  ALTERAÇÕES*/
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // Watch .js files
  gulp.watch('src/js/**/*.js', ['js']);
  // Watch .html files and posts
  gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '*.md', '_posts/*'], ['jekyll-rebuild']);
});
/*FINAL ASSISTA OS ARQUIVOS ALTERAÇÕES*/


gulp.task('default', function() {
    gulp.start('sass', 'js', 'browser-sync', 'watch'/*, 'build-img'*/);
});
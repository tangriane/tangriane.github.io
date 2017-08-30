var gulp        = require('gulp'),
    sass        = require('gulp-ruby-sass'),
    babel       = require('gulp-babel'),
    cssmin = require("gulp-cssmin"), // Minifica o CSS
    minify = require('gulp-minify'), // Minifica o JS
    imagemin    = require('gulp-imagemin'),
    changed     = require('gulp-changed'),
    
    browserSync = require('browser-sync');
    deploy = require("gulp-gh-pages");
 	uglify = require('gulp-uglify');




gulp.task('sass', function () {
    gulp.src('./assets/sass/*.scss')
        .pipe(sass({compass: true}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('./assents/css'));
});
 
//es6
gulp.task("babel", function () {
return gulp.src("./assets/babel/*.js")
.pipe(sourcemaps.init())
.pipe(babel())
.pipe(concat("babel.js"))
.pipe(sourcemaps.write("."))
.pipe(gulp.dest("./js"));
});

// Processo que agrupará todos os arquivos CSS, removerá comentários CSS e minificará.
gulp.task('minify-css', function(){
    gulp.src('./assents/css')
    .pipe(concat('style.min.css'))
    .pipe(stripCssComments({all: true}))
    .pipe(cssmin())
    .pipe(gulp.dest('./css'));
});

//minificação do js
gulp.task('compress', function() {
  gulp.src('js/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
});



gulp.task('imagemin', function() {
   var imgSrc = 'src/images/*.+(png|jpg|gif)',
   imgDst = 'build/images';
   
   gulp.src(imgSrc)
   .pipe(changed(imgDst))
   .pipe(imagemin())
   .pipe(gulp.dest(imgDst));
});

gulp.task('default',['imagemin'],function(){
});


 gulp.task('browser-sync', function() {
    browserSync.init(['./dist/css/**', './views/**'], {
        server: {
            baseDir: './',
            index: './views/index.html'
        }
    });
});
gulp.task('watch', ['sass', 'browser-sync'], function () {
    gulp.watch('./assets/sass/**/*.scss', ['sass']);
});


//jekyll
gulp.task("deploy", ["jekyll-build"], function () {
    return gulp.src("./_site/**/*")
        .pipe(deploy());
});









//task default gulp
gulp.task('default', ['sass', 'watch','babel','minify-css']);

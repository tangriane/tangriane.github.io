var gulp        = require('gulp'),
    sass        = require('gulp-ruby-sass'),
    imagemin    = require('gulp-imagemin'),
    changed     = require('gulp-changed'),
    browserSync = require('browser-sync');
    deploy = require("gulp-gh-pages");
 	uglify = require('gulp-uglify');
    babel = require('gulp-babel');

gulp.task('sass', function () {
    gulp.src('./assets/sass/*.scss')
        .pipe(sass({compass: true}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('./dist/css'));
});
 
gulp.task('jpg', function() {
    gulp.src('./assets/img/**/*.jpg')
        .pipe(changed('./dist/img/'))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/img/'));
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



gulp.task("deploy", ["jekyll-build"], function () {
    return gulp.src("./_site/**/*")
        .pipe(deploy());
});

//minificação javascript

gulp.task('scripts', function() {
    // corpo da tarefa 
    return gulp
            .src(['src/js/**/*.js'])
            .pipe(uglify())
            .pipe(gulp.dest('build/js'));      
});

var css = [
 './src/css/*.css',
 './src/style.css'
];

// Processo que agrupará todos os arquivos CSS, removerá comentários CSS e minificará.
gulp.task('minify-css', function(){
    gulp.src(css)
    .pipe(concat('style.min.css'))
    .pipe(stripCssComments({all: true}))
    .pipe(cssmin())
    .pipe(gulp.dest('./build/'));
});
//es6
gulp.task("babel", function () {
return gulp.src("babel/*.js")
.pipe(sourcemaps.init())
.pipe(babel())
.pipe(concat("babel.js"))
.pipe(sourcemaps.write("."))
.pipe(gulp.dest("js"));
});


//task default gulp
gulp.task('default', ['sass', 'watch','babel','minify-css']);
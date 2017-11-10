import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

const paths = {
  js: './src/js/**/*.js',
  sass: './src/scss/**/*.scss',
  build: './app/'
};
gulp.task('css', function () {
    return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.build+'css'))
    .pipe(gulp.dest(paths.build+'css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
    return gulp.src([
      'src/js/scripts.js'
    ])
    .pipe(concat('app.js'))
    .pipe(babel())
 
    .pipe(gulp.dest(paths.build+'js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'browser-sync'], function () {
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/**/*.js", ['js']);
    gulp.watch("app/*.html", ['bs-reload']);
});

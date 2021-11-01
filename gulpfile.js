const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const pngSprite = require('coveo-png-sprite');
const svgSprite = require('gulp-svg-sprite');
// const postcss = require('gulp-postcss');
// const concatCss = require('gulp-concat-css');
const browserSync = require('browser-sync').create();

// sass.compiler = require('node-sass');

// gulp.task('sass', function () {
//     return gulp.src('src/sass/styles.sass')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest('src/css/'));
// });

gulp.task('sass', function () {
    return gulp.src('./src/sass/styles.sass')
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'expanded',
            allowEmpty: true
        })).on('error', console.error.bind(console))
        .pipe(sourcemaps.init())
		.pipe(autoprefixer({
            overrideBrowserslist: ['last 6 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src/css'))

        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed',
            allowEmpty: true
        })).on('error', console.error.bind(console))
		.pipe(autoprefixer({
            overrideBrowserslist: ['last 6 versions'],
            cascade: false
        }))
		// .pipe(concatCss('all.css'))
        .pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))

        .pipe(gulp.dest('./src/css'))
        .pipe(gulp.src('./src/css/*'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('pug', () => {
    return gulp.src('./src/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('./dist'))
        
        .pipe(gulp.src('./src/*.pug'))
        .pipe(pug({pretty: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('buildSprites', function (done) {
    return gulp.src('./src/img/sprite/*.png')
        .pipe(pngSprite.gulp({
          cssPath: './sass/sprite.scss',
          pngPath: './img/sprite.png',
          namespace: 'sprite'
        }))
        .pipe(gulp.dest('./src'));
});

gulp.task('svgSprite', function() {
    return gulp.src('./src/img/svg-sprite/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            },
        }))
        .pipe(gulp.dest('./src/img/'));
});


// gulp.task('autoprefixer', () => {
//     const sourcemaps = require('gulp-sourcemaps');
//     const postcss = require('gulp-postcss');

//     return gulp.src('./src/*.css')
//         .pipe(sourcemaps.init())
//         .pipe(postcss([ autoprefixer({
//             overrideBrowserslist: ['last 6 versions'],
//             cascade: false,
//             allowEmpty: true
//             })
//         ]))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('./dist/css/'));
// });

// gulp.task("autoprefixer", function () {
//     return gulp.src('src/css/style.css')
//         .pipe(autoprefixer({
//             overrideBrowserslist: ['last 6 versions'],
//             cascade: false,
//             allowEmpty: true
//         }))
//         .pipe(gulp.dest('dist/css/'));
// });

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });  
    browserSync.watch('./src' , browserSync.reload);
    browserSync.watch('./dist' , browserSync.reload);
});

// gulp.task('concatcss', function () {
//     return gulp.src(['src/css/**/*.css' , '!src/css/style.css'])
//         .pipe(concatCss("style.css"))
//         .pipe(gulp.dest('src/css/'));
// });

// gulp.task('concatPug', function() {
//     return gulp.src(['src/components/*.pug', '!src/components/index.pug'])
//         .pipe(pug())
//         .pipe(gulp.dest('src/pages/'));
// });



gulp.task('styles', function() {
    return gulp.src('./src/css/*')
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('images', function() {
    return gulp.src('./src/img/*.*')
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('scripts', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./dist/js'));
});

// gulp.task('build-dist', function(done) {
//     gulp.src('./src/css/**/*.css')
//         .pipe(gulp.dest('./dist/css'));

//     gulp.src('./src/js/**/*.js')
//         .pipe(gulp.dest('./dist/js'));

//     gulp.src(['./src/img/*', '!./src/img/**/*'])
//         .pipe(gulp.dest('./dist/img'));

//     gulp.src('./src/fonts/**/*')
//         .pipe(gulp.dest('./dist/fonts'));

//     // gulp.src('*.html')
//     //     .pipe(gulp.dest('./dist'));

//     done();
// });
gulp.task('build-dist', gulp.series('fonts', 'images', 'pug', 'sass', 'scripts', 'styles'));


gulp.task('watch', function() {
    gulp.watch(['./src/**/*.pug', './src/pages/*.pug'], gulp.series('pug'));
    gulp.watch(['./src/sass/**/*.sass', './src/sass/*.sass'], gulp.series('sass'));
    gulp.watch('./src/js/**/*.js', gulp.series('scripts'));
    gulp.watch('./src/img/*', gulp.series('images'));
    // gulp.watch('src/css/style.css', gulp.series('autoprefixer'));
    // gulp.watch(['src/css/**/*.css', '!src/css/style.css'], gulp.series('concatcss'));
});

// gulp.task('build', gulp.series('pug', 'sass', 'concatcss', 'autoprefixer', 'build-dist'));

gulp.task('default' , gulp.series(
    gulp.series("build-dist"),
    gulp.parallel('watch', 'serve')
));

// Create all folder when start project
gulp.task('startProject', function(){
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src'))
        .pipe(gulp.dest('./src/css'))
        .pipe(gulp.dest('./src/fonts'))
        .pipe(gulp.dest('./src/img'))
        .pipe(gulp.dest('./src/js'))
        .pipe(gulp.dest('./src/sass'))
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(gulp.dest('./dist/img'))
        .pipe(gulp.dest('./dist/fonts'));
});
const
    gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin');
gutil = require("gulp-util");

const sourcemaps = require('gulp-sourcemaps');

const
    buildFolder = './js/dist/',
    jsSrcFiles = ['./**/*.js', '!./js/*.min.js', '!./js/dist/**'],
    webpackOptions = {
        module: {
            loaders: [{
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['babel-preset-env', 'stage-3'],
                    plugins: [
                        "transform-object-rest-spread",
                        ["transform-runtime", {
                            "helpers": false,
                            "polyfill": true,
                            "regenerator": false,
                        }]
                    ],
                }
            }]
        },
        output: {
            filename: 'app.min.js',
        },
        devtool: 'cheap-module-eval-source-map',
        plugins: [
            new UglifyJSPlugin()
        ]
    };

gulp.task('sass', function () {
    let plugins = [
        autoprefixer({"browsers": [
                ">0.25%",
                "not op_mini all"
            ]}),
    ];
    return gulp.src('./scss/app.scss').pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function (done) {
    gulp.watch('./**/*.scss', gulp.parallel('sass'));
    gulp.watch(jsSrcFiles, gulp.parallel('webpack'));
    done();
});

gulp.task('webpack', function () {
    return gulp
        .src('./js/app.js')
        .pipe(webpackStream(webpackOptions).on('error', function handleError() {
            this.emit('end'); // Recover from errors
        }))
        .pipe(gulp.dest(buildFolder));
});

gulp.task('default', gulp.series('sass', 'webpack'));

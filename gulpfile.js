// gulpfile.js 
var gulp = require("gulp"),
    rimraf = require("rimraf"),
    merge = require("merge-stream");

var paths = {
    webroot: "./wwwroot/",
    node_modules: "./node_modules/"
};

paths.libDest = paths.webroot + "lib/*";

gulp.task("clean:libs", function (callback) {
    rimraf(paths.libDest, callback);
});

gulp.task("copy:libs", gulp.series("clean:libs", function () {
    // jQuery
    var jQuery = gulp.src(paths.node_modules + "jquery/dist/*.js")
        .pipe(gulp.dest("./wwwroot/lib/js/jquery/dist/"));

    // Popper.js
    var popperJs = gulp.src(paths.node_modules + "popper.js/dist/umd/*.js")
        .pipe(gulp.dest("./wwwroot/lib/js/popper.js/dist/"));

    // Bootstrap JS
    var bootstrapJs = gulp.src([paths.node_modules + "bootstrap/dist/js/bootstrap.js",
    paths.node_modules + "bootstrap/dist/js/bootstrap.min.js"
    ]).pipe(gulp.dest("./wwwroot/lib/js/bootstrap/dist/"));

    // Bootstrap CSS
    var bootstrapCss = gulp.src([paths.node_modules + "bootstrap/dist/css/bootstrap.css",
    paths.node_modules + "bootstrap/dist/css/bootstrap.min.css"])
        .pipe(gulp.dest("./wwwroot/lib/css/bootstrap/dist/"));

    // Font Awesome CSS
    var fontAwesomeCss = gulp.src([paths.node_modules + "font-awesome/css/font-awesome.css",
    paths.node_modules + "font-awesome/css/font-awesome.min.css"])
        .pipe(gulp.dest("./wwwroot/lib/css/font-awesome/dist/"));

    // Font Awesome Fonts
    var fontAwesomeFont = gulp.src(paths.node_modules + "font-awesome/fonts/*.*")
        .pipe(gulp.dest("./wwwroot/lib/css/font-awesome/fonts/"));

    return merge(jQuery, popperJs, bootstrapJs, bootstrapCss, fontAwesomeCss, fontAwesomeFont);
}));
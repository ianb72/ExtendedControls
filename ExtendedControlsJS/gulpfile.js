var gulp = require("gulp");
var less = require("gulp-less");
var sass = require("gulp-sass");
var minify = require("gulp-minify");
var path = require("path");
var ng = require("nuget-pckg");
var concat = require("gulp-concat");
var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var ngVersion = require("./UpdateNugetVersion");
var clean = require("gulp-clean");

var pauseProcessing = false;

/**Tasks*/
gulp.task("nuget", gulp.series(nuget));
gulp.task("siteless", gulp.series(siteLess));
gulp.task("images", gulp.series(images));
gulp.task("prebuild", gulp.series(ecJSPreBuild));
gulp.task("ecsass", gulp.series(ecSass, CopyToTest));
gulp.task("cleantemp", gulp.series(CleanBuildTemp));
gulp.task("ecVersion", gulp.series(ecVersion));

gulp.task("build", gulp.series(
    CleanBuildTemp,
    ecVersion,
    ecJSPreBuild,
    "prebuild",
    concatAfterBabelFiles,
    ecJS,
    ecBabel,
    ecAfterBabelIE,
    ecSass,
    images,
    CopyToTest));

gulp.task("publish", gulp.series("build", Publish));
gulp.task("copytotest", gulp.series(CopyToTest));
gulp.task("watch", gulp.parallel(WatchVersion, WatchECJS, WatchECSass, WatchSiteLess, WatchSiteSass));
gulp.task("default", gulp.parallel("watch"));
gulp.task("watchSiteSass",gulp.parallel(WatchSiteSass));

function UpdateVersionText(done) {
    fs.writeFile("./properties/BuildNumber.txt", 0, function (err, data) {});
    done();
}

/**Watch for changes in the version text file */
function WatchVersion() {
    gulp.watch("./properties/Version.text", gulp.series(UpdateVersionText, "build"));
}

/**Watch for changes in EC sass files */
function WatchECSass() {
    gulp.watch("./dev/sass/**/*.scss", gulp.series(ecSass, CopyToTest));
}


/**Watch for changes in EC less files */
function WatchECLess() {
    gulp.watch("./dev/less/**/*.less", gulp.series(ecLess, CopyToTest));
}

/**Watch for changes in the test site specific files */
function WatchSiteLess() {
    gulp.watch("./public/content/**/*.less", gulp.series(siteLess));
}

function WatchSiteSass() {
    gulp.watch("./public/content/**/*.scss", gulp.series(siteSass));
}

/**Watch for changes in the dev JS files */
function WatchECJS() {
    gulp.watch("./dev/js/*.js", gulp.series(ecJSPreBuild, ecVersion, ecJS, ecBabel, CopyToTest));
}

function CleanBuildTemp() {
    return gulp.src(["./dev/build_temp/*.*", "!./dev/build_temp/Version.js"], {
            read: false
        })
        .pipe(clean());
}

function ecVersion(done) {
    var baseVersion = "";
    var buildNumber = 0;
    var versionText = "";

    fs.readFile("./properties/Version.text", "utf-8",
        function (err, data) {
            baseVersion = data;

            fs.readFile("./properties/BuildNumber.txt", "utf-8",
                function (err, data) {
                    buildNumber = parseInt(data) + 1;
                    var fullVersion = baseVersion + "." + buildNumber.toString();

                    versionText = "/*********************/\n";
                    versionText += "/*ExtendedControls.js*/\n";
                    versionText += "/*Version " + baseVersion + "." + buildNumber.toString() + "*/\n";
                    versionText += "/*********************/\n";

                    WriteToConsole("Version", fullVersion);

                    fs.writeFile("./properties/BuildNumber.txt", buildNumber.toString(), function (err, data) {});
                    fs.writeFile("./properties/FullVersion.txt", fullVersion.toString(), function (err, data) {});
                    fs.writeFile("./dev/build_temp/Version.js", versionText, function (err, data) {});
                });

        });

    done();
}

function WriteToConsole(status, text) {
    console.log("\x1b[2m\x1b[32m%s\x1b[1m\x1b[37m%s\x1b[2m\x1b[32m%s %s \x1b[36m \x1b[2m\x1b[32m'\x1b[36m%s\x1b[2m\x1b[32m'", "[", GetTime(), "]", status, text);
}

function Publish() {
    return gulp.src(["./dev/release/js/*.js", "./dev/release/css/*.css"])
        .pipe(gulp.dest("./release/content/Content"))
}

function CopyToTest() {
    return gulp.src(["./dev/release/js/*.js", "./dev/build_temp/ExtendedControls_IE.js", "./dev/release/css/ExtendedControls.css"])
        .pipe(gulp.dest("./public/content"))
}

/**Copy orginal generated JS with any ES6+ entries to output */
function ecJS() {
    return gulp.src(["./dev/build_temp/ExtendedControls.js", "./dev/build_temp/AfterBabel.js"])
        .pipe(concat("ExtendedControls.js"))
        .pipe(gulp.dest("./dev/release/js"))
}

/**Concat and minify EC JS file */
function ecJSPreBuild() {
    if (pauseProcessing) return;

    return gulp.src(["./dev/build_temp/Version.js", "./dev/js/Includes/beforeBabel/*.js", "./dev/js/*.js"])
        .pipe(concat("ExtendedControls.js"))
        .pipe(minify())
        .pipe(gulp.dest("./dev/build_temp"));
}

/**Use Babel to polyfill generated JS file */
function ecBabel() {
    if (pauseProcessing) return;
    return browserify({
            entries: "./dev/build_temp/ExtendedControls.js",
            debug: false
        })
        .transform("babelify", {
            presets: ["es2015"]
        })
        .bundle()
        .pipe(source("ExtendedControls_IE.js"))
        .pipe(gulp.dest("./dev/build_temp/"));
}

function concatAfterBabelFiles() {
    return gulp.src("./dev/js/Includes/afterBabel/*.js")
        .pipe(concat("AfterBabel.js"))
        .pipe(gulp.dest("./dev/build_temp"));
}

function ecAfterBabelIE() {
    return gulp.src(["./dev/build_temp/ExtendedControls_IE.js", "./dev/build_temp/AfterBabel.js"])
        .pipe(concat("ExtendedControls_IE.js"))
        .pipe(gulp.dest("./dev/release/js"));
}

/**Generate nuget package*/
function nuget() {
    if (pauseProcessing) return;

    ngVersion.CheckAndUpdate();

    return ng.getNuspecs({
            baseDir: path.resolve("./release"),
        })
        .pipe(ng.pack({
            outputDirectory: path.resolve("./release/nuget"),
        }))
        .pipe(ng.add({
            source: "//ed-crn-01/d$/AS_NuGet"
        }));
}

/**Complie all less files to CSS */
function ecLess() {
    if (pauseProcessing) return;

    return gulp.src("./dev/less/**/ExtendedControls.less")
        .pipe(less({
            paths: [path.join(__dirname, "less", "includes")]
        }))
        .pipe(gulp.dest("./dev/release/css"))
}

function ecSass() {
    return gulp.src("./dev/sass/**/ExtendedControls.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./dev/release/css"));
}

/**Compile test site less files */
function siteLess() {
    return gulp.src("./public/content/**/*.less")
        .pipe(less({
            paths: [path.join(__dirname, "less", "includes")]
        }))
        .pipe(gulp.dest("./public/content/"));
}

function siteSass() {
    return gulp.src("./public/content/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./public/content"));
}

/**Copy images to output */
function images() {
    if (pauseProcessing) return;

    return gulp.src("./dev/images/**/*")
        .pipe(gulp.dest("./public/content/images/"))
        .pipe(gulp.dest("./release/content/Content/ExtendedControls/images/"));
}

function GetTime() {
    return new Date().toTimeString().replace(" GMT+0100 (GMT Daylight Time)", "");
}
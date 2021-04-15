//npm install gulp gulp-plumber browser-sync gulp-rename gulp-util gulp-dart-sass gulp-sass-lint gulp-sourcemaps gulp-postcss autoprefixer cssnano gulp-htmlmin gulp-concat gulp-babel gulp-jshint gulp-uglify @babel/preset-react
//probably need to modify paths
//gulp dev|| build
//modify paths if needed

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const browsersync = require("browser-sync");
const rename = require("gulp-rename");
const gutil = require("gulp-util");

const src = './src';
const dest = './dest';

//sass
const sass = require("gulp-dart-sass");
const sasslint = require("gulp-sass-lint");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

//html
const htmlmin = require("gulp-htmlmin");

//js
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const jshint = require("gulp-jshint");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync");

/*================================================*/
//pass args to the gulp script with --[name] [value]
//only relevant is the -- so gulp does not think it is 
//a task

project = process.argv[4];

/*================================================*/
//browsersync
const reload = (done) => {
    browserSync.reload();
    done();
}

const serve = (done) => {
    browserSync.init({
        ui: {
            port: 3007
        },
        port: 3008,
        server: {
            baseDir: dest
        },
        startPath: "index.html"
    });
    done();
}

/*================================================*/

/*================================================*/
// Compile .html to minified .html
const html = () => {
    return gulp.src(`${src}/*.html`)
        // Init Plumber
        .pipe(plumber())
        // Compile HTML to minified HTML
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            html5: true,
            removeEmptyAttributes: true,
            removeTagWhitespace: true,
            sortAttributes: true,
            sortClassName: true
        }))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}/`));
}

/*================================================*/
/*================================================*/
//images
const img = () => {
    return gulp.src(`${src}/img/*.*`)
        .pipe(gulp.dest(`${dest}/img`))
}

/*================================================*/
//javascript
const js = () => {
    return gulp.src(`${src}/js/**/*.js*`)
        // Init Plumber
        .pipe(plumber(((error) => {
            gutil.log(error.message)
        })))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-react']
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(sourcemaps.write(''))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}/js`));
}

/*================================================*/
// Compile SASS to CSS with gulp
const css = () => {
    return gulp.src(`${src}/sass/**/*.sass`)
        // Init Plumber
        .pipe(plumber())
        /* .pipe(sasslint({
            options: {
                formater: 'stylish'
            },
            rules: {
                'indentation': 0
            }
        }))
        .pipe(sasslint.format())*/
        // Start sourcemap
        .pipe(sourcemaps.init())
        // Compile SASS to CSS
        .pipe(sass.sync({ outputStyle: "compressed"})).on('error', sass.logError)
        // Add suffix
        .pipe(postcss([autoprefixer(), cssnano()]))
        //Rename
        .pipe(rename({ suffix: ".min"}))
        // Write sourcemap
        .pipe(sourcemaps.write(''))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}/css`))
}

/*================================================*/

//add watch directories
const constantbuild = () => gulp.watch([
    `${src}/sass/**/*.sass`,
    `${src}/js/**/*.js*`,
    `${src}/img/*.*`,
    `${src}/*.html`
    ],
    gulp.series(html, css, js, img, reload)
);

const build = gulp.series(html, css, js, img);

const dev = gulp.series(html, css, js, img, serve, constantbuild);

/*================================================*/

//exports

exports.default = dev;
exports.build = build;
exports.dev = dev;
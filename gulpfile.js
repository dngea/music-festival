import {src, dest, watch, series} from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import terser from 'gulp-terser'
import cleanCss from 'gulp-clean-css'; 
import replace from 'gulp-replace';

const sass = gulpSass(dartSass)

// JS
export function js(done){
    src('src/js/app.js')
        .pipe(terser())
        .pipe(dest('build/js'))
    done()
}

// CSS
export function css(done){
    src('src/sass/app.scss', {sourcemaps: true})
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCss())
        .pipe(dest('build/css', {sourcemaps: '.'}))
    done()
}

// HTML
export function html(done) {
    src('index.html') // Adjust path as needed
        .pipe(replace('build/css/', 'css/'))
        .pipe(replace('build/js/', 'js/'))
        .pipe(dest('build'));
    done();
}


export function redirects(done) {
    src('_redirects') // Assuming it's in the root of your project
        .pipe(dest('build')); // Move it to the build folder
    done();
}

// use for production environment, run infinitely looking for changes
export function dev() {
    watch('src/sass/**/*.scss', css) // segundo parámentro llama a css()
    watch('src/js/**/*.js', js) // segundo parámentro llama a js()
}


export default series(js, css, html)
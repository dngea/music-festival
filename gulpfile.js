import {src, dest, watch, series} from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'

const sass = gulpSass(dartSass)

export function js(done){
    src('src/js/app.js')
        .pipe(dest('build/js'))
    done()
}

export function css(done){
    src('src/sass/app.scss', {sourcemaps: true})
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('build/css', {sourcemaps: true}))
    done()
}

export function dev() {
    watch('src/sass/**/*.scss', css) // segundo parámentro llama a css()
    watch('src/js/**/*.js', js) // segundo parámentro llama a js()
}

export const build = parallel(js, css)


export default series(build, dev)
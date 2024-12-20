import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import {src, dest, watch, series} from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import cleanCss from 'gulp-clean-css'; 
import replace from 'gulp-replace';

const sass = gulpSass(dartSass)

import terser from 'gulp-terser'
import sharp from 'sharp'

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
        .pipe(replace('build/src/', 'src/'))
        .pipe(dest('build'));
    done();
}

export function replacePaths(done) {
    // Reemplazar rutas en archivos .js
    src('build/**/*.js')
        .pipe(replace('src/img/', 'img/'))  // Reemplazar src/img/ por img/
        .pipe(dest('build/'));  // Guardar los cambios en el directorio build

    // Reemplazar rutas en archivos .html
    src('build/**/*.html')
        .pipe(replace('src/img/', 'img/'))  // Reemplazar src/img/ por img/
        .pipe(dest('build/'));  // Guardar los cambios en el directorio build

    done();
}


export function redirects(done) {
    src('_redirects') // Assuming it's in the root of your project
        .pipe(dest('build')); // Move it to the build folder
    done();
}

export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb';
    const width = 250;
    const height = 180;
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) 
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}

// IMG WEBP
export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './build/src/img';
    const images =  await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}
function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}

// use for production environment, run infinitely looking for changes
export function dev() {
    watch('src/sass/**/*.scss', css) // segundo parámentro llama a css()
    watch('src/js/**/*.js', js) // segundo parámentro llama a js()
    watch('src/img/**/*.{png,jpg}', imagenes) 
}


export default series(crop, js, css, html, imagenes)
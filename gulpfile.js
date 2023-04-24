import browserSync from "browser-sync"
import gulp from "gulp"
import del from "del"
import pug from "gulp-pug"
import coreSass from "sass"
import gulpSass from "gulp-sass"
import autoprefixer from "gulp-autoprefixer"
import concat from "gulp-concat"
import uglify from "gulp-uglify-es"
import imagemin from "gulp-imagemin"
import cache from "gulp-cache"
import gcmq from "gulp-group-css-media-queries"
import cleanCSS from "gulp-clean-css"

const sass = gulpSass(coreSass)

export const browserSyncFunc = () => {
    // Теж саме що live server, тільки для SASS та PUG
    browserSync ({
        server: {
            baseDir: "docs"
        },
        open: true,
        browser: "chrome"
        //port: 8080
    })
}

export const html = () => {
    return gulp
    .src([
        "src/pug/*.pug"
    ])
    .pipe(pug({
        //pretty: true
    }))
    .pipe(gulp.dest("docs"))
    .pipe(browserSync.reload({
        stream: true
    }))
}

export const css = () => {
    return gulp
    .src([//Передається масив з двома файлами
        "src/sass/*.css",
        "src/sass/*.sass" 
    ])
    .pipe(sass({//Написаний в одну лінію
        outputStyle: "compressed"//expanded Нормально, compact
    }) //Обробка на помилки
    .on("error", sass.logError)) //Приписання webkit
    .pipe(autoprefixer(["last 15 versions"], { //каскадність
        cascade: true
    }))
    .pipe(gcmq("style.css")) //Перенесення media в кінець
    .pipe(concat("style.css")) //Обєднання всіх стилів в один
    .pipe(cleanCSS({compatibility: "ie8" //сумісність з інтернет експлор
    }))
    .pipe(gulp.dest("docs/css"))
    .pipe(browserSync.reload({ //перезагрузка після кожного зміну
        stream: true
    }))
}

export const js = () => {
    return gulp
    .src([
        "src/js/**/*.js" //** - будь-яка вложеність/
    ])
    .pipe(uglify.default())
    .pipe(concat("script.js"))
    .pipe(gulp.dest("docs/js"))
    .pipe(browserSync.reload({ 
        stream: true
    }))
}

export const files = () => {
    return gulp
    .src([
        "src/*.*"
    ], {dot: true})
    .pipe(gulp.dest("docs"))
    .pipe(browserSync.reload({ 
        stream: true
    }))
}

export const fonts = () => {
    return gulp
    .src([
        "src/fonts/**/*.*"
    ])
    .pipe(gulp.dest("docs/fonts"))
    .pipe(browserSync.reload({ 
        stream: true
    }))
}

export const images = () => {
    return gulp
    .src([
        "src/img/**/*.*"
    ])
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("docs/img"))
    .pipe(browserSync.reload({ 
        stream: true
    }))
}

export const clear = () => {
    return cache.clearAll() //Скидання кешу
}

export const delDocs = () => {
    return del("docs") //Видалення усього проєкту
}

export const watch = () => {
    gulp.watch("src/sass/**/*.sass", gulp.parallel(css))
    gulp.watch("src/js/**/*.js", gulp.parallel(js))
    gulp.watch("src/pug/**/*.pug", gulp.parallel(html))
    gulp.watch("src/*.*", gulp.parallel(files))
    gulp.watch("src/fonts/**/*.*", gulp.parallel(fonts))
    gulp.watch("src/img/**/*.*", gulp.parallel(images))
}

export default gulp.series( //Серія викликів
    delDocs,
    gulp.parallel(
        watch,
        html,
        css,
        js,
        files,
        fonts,
        images,
        browserSyncFunc
    )
)
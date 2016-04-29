'use strict';

// Получение настроек папок из package.json
const pjson = require('./package.json');
const dirs = pjson.config.directories;

// Подключение зависимостей проекта
const gulp = require('gulp'); //Подключает сам gulp
const jade = require('gulp-jade'); //Подключает шаблонизатор Jade
const gutil = require('gulp-util'); //Отмечает ошибки красным 
const plumber = require('gulp-plumber'); //Этот плагин не останавливает watcher 
const debug = require('gulp-debug'); //Предотвращает неблагоприятные исходы 
const sourcemaps = require('gulp-sourcemaps'); //Создает карту для быстрого поиска кода в инспекторе браузера
const mqpacker = require('css-mqpacker'); //Пакует одинаковые css элементы в один
const gulpIf = require('gulp-if'); //Добавляет gulp конструкцию if else
const newer = require('gulp-newer'); //Запускают таски только для изменившихся файлов
const notify = required('gulp-notify'); //Выводит оповещения 
const uglify = required('gulp-uglify'); //Минифицирует js код
const concat = required('gulp-concat'); //Конкатинирует файлы
                                    /* РАБОТА С КАРТИНКАМИ */
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

                                    /* POSTCSS */
const postcss = require('gulp-postcss'); //Пост css, куча функций
const svgo = require('postcss-svgo'); //Редактирует (уменьшает) svg 
const autoprefixer = require('autoprefixer'); //Добавляет автоматическое добавление префиксов
const cssnano = require('cssnano'); //Минифицирует css



                                         /* POSTCSS */
gulp.task('postcss', function(){
    console.log('-----------Выполняется POSTCSS');
    return gulp.src('src/style.css')
        .pipe(postcss([
            cssnext({
                features: {
                    autoprefixer: false  //Отключаем автопрефиксер, так как он устаревает
                }
            }),
            svgo,
            autoprefixer, // Подключаем новый автопрефиксер
            cssnano
        ]))
        .pipe(gulp.dest('build/style.css'))
});
                                          /* JADE */
 gulp.task('jade', function(){
     console.log('-----------Собирается JADE');
     gulp.src('./src/blocks/**/*.jade')
        .pipe(plumber(function(error){
            gutil.log(gutil.colors.red(error.message)); //Красит ошибку в красный цвет
            this.emit('end');
        }))
        .pipe(jade({
            pretty: true //Для того, что бы html был читаем, если убрать, то он будет минифицироваться
        }))
        .pipe(gulp.dest('build/'))
 });
                                         /* Отчистка build */
gulp.task('clean', function () {
  console.log('---------- Очистка папки сборки');
  return del([
    dirs.build + '/**/*',
    '!' + dirs.build + '/readme.md'
  ]);
});
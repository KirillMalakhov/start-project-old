'use strict';
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

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
const notify = require('gulp-notify'); //Выводит оповещения 
const uglify = require('gulp-uglify'); //Минифицирует js код
const concat = require('gulp-concat'); //Конкатинирует файлы
const stylus = require('gulp-stylus'); //Подключает препроцессор stylus
const autoprefixer = require('autoprefixer-stylus'); //Добавляет автоматическое добавление префиксов
const browserSync = require('browser-sync').create(); // Запускает веб сервер с livereload

                                    /* РАБОТА С КАРТИНКАМИ */
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');




                                    /* КОМПИЛЯЦИЯ STYLUS */
gulp.task('stylus', function(){
    console.log('------------Компиляция Sylus');
    return gulp.src(dirs.source + '/blocks/style.styl')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
    .pipe(debug({title: "STYLUS:"}))
    .pipe(stylus({
			use: [autoprefixer('last 2 versions', '>1%', 'ie 9', 'Opera 12.1')]
		}))    
    .on('error', notify.onError(function(err){
      return {
        title: 'Styles compilation error',
        message: err.message
      }
    }))        
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest('./build/css'))
        .pipe(notify("STYLUS COMPLETED"));
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
        .pipe(notify("JADE COMPILED TO HTML"))
 });
                                         /* Отчистка build */
gulp.task('clean', function () {
  console.log('---------- Очистка папки сборки');
  return del([
    dirs.build + '/**/*',
    '!' + dirs.build + '/readme.md'
  ]);
    
});
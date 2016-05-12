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
const browserSync = require('browser-sync'); // Запускает веб сервер с livereload
const clean = require('gulp-clean');

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
      gulp.src('./src/**/*.jade')
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
                                  /* Копирование и оптимизация изображений */ 
gulp.task('img', function () {
  console.log('---------- Копирование и оптимизация картинок');
 
    return gulp.src('src/images/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
            // use: [pngquant()]
        }))
        .pipe(gulp.dest('build/images'));
        
        
});    

                                         /* Отчистка build */ 

gulp.task('clean', function () {
    console.log('---------- Очистка папки сборки');
	return gulp.src('build/*', {read: false})
		.pipe(clean());
});



                                        /* DEBUG */
gulp.task('debug', function () {
	return gulp.src('build/**/*')
		.pipe(debug({title: 'debug:'}))
		.pipe(gulp.dest('build'));
});


                            /*Конкатенация и углификация Javascript*/
gulp.task('js', function (callback) {
  
    console.log('---------- Обработка JS');
    return gulp.src('src/js/**/*.js')
      .pipe(debug({title: "JS:"}))
      .pipe(gulpIf(isDev, sourcemaps.init()))
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .on('error', notify.onError(function(err){
        return {
          title: 'Javascript uglify error',
          message: err.message
        }
      }))
      .pipe(gulpIf(isDev, sourcemaps.write('.')))
      .pipe(gulpIf(isDev, debug({title: "JS SOURCEMAPS:"})))
      .pipe(gulp.dest(dirs.build + '/js'))
      .pipe(notify("JS COMPLETED"));
 
});


                                           


                                            /* ЗАПУСК СЕРВЕРА */




gulp.task('browser-sync', () => {
    browserSync(
         {
            server: 'build',
            baseDir: 'build',
            directory: true,
            tunnel: false,
            host: 'localhost',
            port: 9000,
            injectChanges: true,
            logPrefix: "App"
        }
    );
});

                                /*Сборка всего*/
gulp.task('build', ['clean','jade','stylus','img','js'], function(){
    return gulp.src('build')
    .pipe(notify({
        title: 'COMAND BUILD',
        message: 'Completed',
        
    }));
});
                                    /* Слежение */

gulp.task('start',['build' ,'browser-sync'], (cb) => {
    gulp.watch('src/**/*.styl', ['stylus']);
    gulp.watch('src/**/*.jade', ['jade']);
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/images/**/*.*', ['img`']);
    
});
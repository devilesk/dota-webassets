var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var gulpSequence = require('gulp-sequence');
var merge = require('merge-stream');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var del = require('del');

var imgRoot = '../images/';

function spriteTaskGenerator(imgRoot, name, sizePrefix) {
    return function () {
        var name_size = sizePrefix ?  name + '_' + sizePrefix : name;
        var spriteData = gulp.src('./dist/images/' + name_size + '/*').pipe(spritesmith({
            imgName: name_size + '_sprite.png',
            imgPath: imgRoot + name_size + '/' + name_size + '_sprite.png',
            cssName: name_size + '_sprite.css',
            cssOpts: {
                cssSelector: function (sprite) {
                    return '.' + name + '-sprite-' + sprite.name.replace('.', '-') + (sizePrefix ? '.' + name + '-sprite-' + sizePrefix : '');
                }
            }
        }));
        
        var imgStream = spriteData.img
            .pipe(buffer())
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/images/' + name_size));

        var cssStream = spriteData.css
            .pipe(csso())
            .pipe(gulp.dest('./dist/css'));

        return merge(imgStream, cssStream);
    }
}

function taskGenerator(imgRoot, name, sizes) {
    gulp.task(name + '-clean', function () {
        return del([
            './dist/images/' + name + '/*',
            './dist/css/' + name + '_sprite.css',
        ], {force: true});
    });

    gulp.task(name + '-copy', [name + '-clean'], function() {
        return gulp.src('./images/' + name + '/src/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/images/' + name));
    });
    
    gulp.task(name + '-fix', [name + '-copy'], function() {
        return gulp.src('./images/' + name + '/fix/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/images/' + name));
    });
    
    gulp.task(name + '-sprite', [name + '-fix'], spriteTaskGenerator(imgRoot, name));
    
    var spriteTasks = [name + '-sprite'];
    
    var sizes = sizes || [];
    sizes.forEach(function (size) {
        var width = size[0];
        var height = size[1];
        var sizePrefix = width + 'x' + height;
    
        gulp.task(name + '-clean-' + sizePrefix, function () {
            return del([
                './dist/images/' + name + '_' + sizePrefix + '/*',
                './dist/css/' + name + '_sprite' + '_' + sizePrefix + '.css',
            ], {force: true});
        });

        gulp.task(name + '-resize-' + sizePrefix, [name + '-fix', name + '-clean-' + sizePrefix], function() {
            return gulp.src('./dist/images/' + name + '/*')
                .pipe(imageResize({
                    width : width,
                    height : height,
                    crop : true,
                    upscale : false
                }))
                .pipe(imagemin())
                .pipe(gulp.dest('./dist/images/' + name + '_' + sizePrefix));
        });
        
        gulp.task(name + '-sprite-' + sizePrefix, [name + '-resize-' + sizePrefix], spriteTaskGenerator(imgRoot, name, sizePrefix));
        
        spriteTasks.push(name + '-sprite-' + sizePrefix);
    });

    gulp.task(name, spriteTasks);
}

taskGenerator(imgRoot, 'miniheroes');
taskGenerator(imgRoot, 'heroes', [[64, 36], [32, 18]]);
taskGenerator(imgRoot, 'portraits', [[64, 84], [32, 42]]);
taskGenerator(imgRoot, 'items', [[50, 36], [36, 26], [25, 18]]);
taskGenerator(imgRoot, 'spellicons', [[64, 64], [32, 32]]);
    
gulp.task('clean', function () {
    return del([
        './dist/**/*'
    ], {force: true});
});
    
gulp.task('default', gulpSequence('clean', ['miniheroes', 'heroes', 'portraits', 'items', 'spellicons']));
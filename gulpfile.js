var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var gulpSequence = require('gulp-sequence');
var merge = require('merge-stream');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var del = require('del');

gulp.task('clean-src', function () {
    return del([
        './images/**/*'
    ], {force: true});
});

var imgRoot = '../img/';

function spriteTaskGenerator(imgRoot, name, sizePrefix, imageExt) {
    return function () {
        var name_size = sizePrefix ?  name + '_' + sizePrefix : name;
        var spriteData = gulp.src('./tmp/img/' + name_size + '/*').pipe(spritesmith({
            imgName: name_size + '_sprite.' + imageExt,
            imgPath: imgRoot + name_size + '_sprite.' + imageExt,
            cssName: name_size + '_sprite_' + imageExt + '.css',
            cssOpts: {
                cssSelector: function (sprite) {
                    return '.' + name + '-sprite-' + sprite.name.replace('.', '-') + (sizePrefix ? '.' + name + '-sprite-' + sizePrefix : '');
                }
            }
        }));
        
        var imgStream = spriteData.img
            .pipe(buffer())
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/img'));

        var cssStream = spriteData.css
            .pipe(csso())
            .pipe(gulp.dest('./dist/css'));

        return merge(imgStream, cssStream);
    }
}

function taskGenerator(imgRoot, name, sizes, imgTypes) {
    var cleanTaskName = name + '-clean';
    var copyTaskName = name + '-copy';
    var fixTaskName = name + '-fix';
    
    gulp.task(cleanTaskName, function () {
        var arr = imgTypes.map(function (imgType) { return './dist/css/' + name + '_sprite_' + imgType + '.css'; });
        arr.push('./dist/img/' + name + '/*');
        arr.push('./tmp/img/' + name + '/*');
        return del(arr, {force: true});
    });
    
    gulp.task(copyTaskName, function() {
        return gulp.src('./images/' + name + '/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./tmp/img/' + name));
    });
    
    gulp.task(fixTaskName, function() {
        return gulp.src('./override/' + name + '/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./tmp/img/' + name));
    });
        
    var sizes = sizes || [];
    sizes.forEach(function (size) {
        var width = size[0];
        var height = size[1];
        var sizePrefix = width + 'x' + height;
    
        var cleanTaskName2 = name + '-clean-' + sizePrefix;
        
        gulp.task(cleanTaskName2, function () {
            var arr = imgTypes.map(function (imgType) { return './dist/css/' + name + '_sprite' + '_' + sizePrefix + '_' + imgType + '.css'; });
            arr.push('./dist/img/' + name + '_' + sizePrefix + '/*');
            arr.push('./tmp/img/' + name + '_' + sizePrefix + '/*');
            return del(arr, {force: true});
        });

        gulp.task(name + '-resize-' + sizePrefix, function() {
            return gulp.src('./tmp/img/' + name + '/*')
                .pipe(imageResize({
                    width : width,
                    height : height,
                    crop : true,
                    upscale : false
                }))
                .pipe(imagemin())
                .pipe(gulp.dest('./tmp/img/' + name + '_' + sizePrefix));
        });
    });
        
    imgTypes.forEach(function (imgType) {
        var taskName = name + '-sprite-' + imgType;
        
        gulp.task(taskName, spriteTaskGenerator(imgRoot, name, null, imgType));
        
        var spriteTasks = [taskName];
        
        sizes.forEach(function (size) {
            var width = size[0];
            var height = size[1];
            var sizePrefix = width + 'x' + height;
            
            var taskName2 = name + '-sprite-' + sizePrefix + '-' + imgType;
            
            gulp.task(taskName2, spriteTaskGenerator(imgRoot, name, sizePrefix, imgType));
            
            spriteTasks.push(taskName2);
        });

        gulp.task(name + '-' + imgType, gulpSequence.apply(this, spriteTasks));
    });
    
    var taskList = [cleanTaskName, copyTaskName, fixTaskName]
    imgTypes.forEach(function (imgType) {
        taskList.push(name + '-sprite-' + imgType);
    });
    sizes.forEach(function (size) {
        var width = size[0];
        var height = size[1];
        var sizePrefix = width + 'x' + height;
    
        taskList.push(name + '-clean-' + sizePrefix);
        taskList.push(name + '-resize-' + sizePrefix);
            
        imgTypes.forEach(function (imgType) {
            taskList.push(name + '-sprite-' + sizePrefix + '-' + imgType)
        });
    });
    gulp.task(name, gulpSequence.apply(this, taskList));
}

taskGenerator(imgRoot, 'miniheroes', null, ['png', 'jpg']);
taskGenerator(imgRoot, 'heroes', [[64, 36], [32, 18]], ['png', 'jpg']);
taskGenerator(imgRoot, 'portraits', [[64, 84], [32, 42]], ['png', 'jpg']);
taskGenerator(imgRoot, 'items', [[70, 50], [50, 36], [36, 26], [25, 18]], ['png', 'jpg']);
taskGenerator(imgRoot, 'spellicons', [[64, 64], [32, 32]], ['png', 'jpg']);
    
gulp.task('clean', function () {
    return del([
        './dist/**/*',
        './tmp/**/*'
    ], {force: true});
});
    
gulp.task('default', gulpSequence('clean', 'spellicons', 'items', 'heroes', 'portraits', 'miniheroes'));
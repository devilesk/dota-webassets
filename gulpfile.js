var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var gulpSequence = require('gulp-sequence');

gulp.task('default', gulpSequence(['miniheroes', 'heroes', 'portraits'], 'image-min'));

gulp.task('image-min', function() {
    return gulp.src('./dist/**/*.png', { base: "./" })
        .pipe(imagemin())
        .pipe(gulp.dest('.'));
});


/* MINIHEROES */
gulp.task('miniheroes', ['miniheroes-sprite']);

gulp.task('miniheroes-copy', function() {
    return gulp.src('./images/miniheroes/src/*')
        .pipe(gulp.dest('./dist/miniheroes'));
});

gulp.task('miniheroes-fix', ['miniheroes-copy'], function() {
    return gulp.src('./images/miniheroes/fix/*')
        .pipe(gulp.dest('./dist/miniheroes'));
});

gulp.task('miniheroes-sprite', ['miniheroes-fix'], function () {
    var spriteData = gulp.src('./dist/miniheroes/*').pipe(spritesmith({
        imgName: 'miniheroes_sprite.png',
        cssName: 'miniheroes_sprite.css',
        cssVarMap: function (sprite) {
          sprite.name = 'miniheroes_' + sprite.name;
        }
    }));
    return spriteData.pipe(gulp.dest('dist'));
});


/* HEROES */
gulp.task('heroes', ['heroes-sprite-64x36', 'heroes-sprite-32x18']);

gulp.task('heroes-copy', function() {
    return gulp.src('./images/heroes/src/*')
        .pipe(gulp.dest('./dist/heroes'));
});

gulp.task('heroes-resize-64x36', ['heroes-copy'], function() {
    return gulp.src('./dist/heroes/*')
        .pipe(imageResize({
            width : 64,
            height : 36,
            crop : true,
            upscale : false
        }))
        .pipe(gulp.dest('./dist/heroes_64x36'));
});

gulp.task('heroes-resize-32x18', ['heroes-copy'], function() {
    return gulp.src('./dist/heroes/*')
        .pipe(imageResize({
            width : 32,
            height : 18,
            crop : true,
            upscale : false
        }))
        .pipe(gulp.dest('./dist/heroes_32x18'));
});

gulp.task('heroes-sprite-64x36', ['heroes-resize-64x36'], function () {
    var spriteData = gulp.src('./dist/heroes_64x36/*').pipe(spritesmith({
        imgName: 'heroes_sprite_64x36.png',
        cssName: 'heroes_sprite_64x36.css',
        cssVarMap: function (sprite) {
          sprite.name = 'heroes64x36_' + sprite.name;
        }
    }));
    return spriteData.pipe(gulp.dest('dist'));
});

gulp.task('heroes-sprite-32x18', ['heroes-resize-32x18'], function () {
    var spriteData = gulp.src('./dist/heroes_32x18/*').pipe(spritesmith({
        imgName: 'heroes_sprite_32x18.png',
        cssName: 'heroes_sprite_32x18.css',
        cssVarMap: function (sprite) {
          sprite.name = 'heroes32x18_' + sprite.name;
        }
    }));
    return spriteData.pipe(gulp.dest('dist'));
});

/* PORTRAITS */
gulp.task('portraits', ['portraits-sprite-64x84', 'portraits-sprite-32x42']);

gulp.task('portraits-copy', function() {
    return gulp.src('./images/portraits/src/*')
        .pipe(gulp.dest('./dist/portraits'));
});

gulp.task('portraits-fix', ['portraits-copy'], function() {
    return gulp.src('./images/portraits/fix/*')
        .pipe(gulp.dest('./dist/portraits'));
});

gulp.task('portraits-resize-64x84', ['portraits-fix'], function() {
    return gulp.src('./dist/portraits/*')
        .pipe(imageResize({
            width : 64,
            height : 84,
            crop : true,
            upscale : false
        }))
        .pipe(gulp.dest('./dist/portraits_64x84'));
});

gulp.task('portraits-resize-32x42', ['portraits-fix'], function() {
    return gulp.src('./dist/portraits/*')
        .pipe(imageResize({
            width : 32,
            height : 42,
            crop : true,
            upscale : false
        }))
        .pipe(gulp.dest('./dist/portraits_32x42'));
});

gulp.task('portraits-sprite-64x84', ['portraits-resize-64x84'], function () {
    var spriteData = gulp.src('./dist/portraits_64x84/*').pipe(spritesmith({
        imgName: 'portraits_sprite_64x84.png',
        cssName: 'portraits_sprite_64x84.css',
        cssVarMap: function (sprite) {
          sprite.name = 'portraits64x84_' + sprite.name;
        }
    }));
    return spriteData.pipe(gulp.dest('dist'));
});

gulp.task('portraits-sprite-32x42', ['portraits-resize-32x42'], function () {
    var spriteData = gulp.src('./dist/portraits_32x42/*').pipe(spritesmith({
        imgName: 'portraits_sprite_32x42.png',
        cssName: 'portraits_sprite_32x42.css',
        cssVarMap: function (sprite) {
          sprite.name = 'portraits32x42_' + sprite.name;
        }
    }));
    return spriteData.pipe(gulp.dest('dist'));
});
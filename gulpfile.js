var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

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
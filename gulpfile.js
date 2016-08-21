var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

gulp.task('miniheroes-fix', function() {
    return gulp.src('./miniheroes/fix/*')
        .pipe(gulp.dest('./miniheroes/src'));
});

gulp.task('miniheroes-sprite', ['miniheroes-fix'], function () {
    var spriteData = gulp.src('./miniheroes/src/*').pipe(spritesmith({
        imgName: 'miniheroes_sprite.png',
        cssName: 'miniheroes_sprite.css',
        cssVarMap: function (sprite) {
          sprite.name = 'miniheroes_' + sprite.name;
        }
    }));
    return spriteData.pipe(gulp.dest('dist'));
});
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var sharp = require('sharp');

var inDir = process.argv[2];
var outDir = process.argv[3];
var width = parseInt(process.argv[4]);
var height = parseInt(process.argv[5]);
var files = fs.readdirSync(inDir);

files.forEach(function(file) {
    var filePath = path.join(inDir, file);
    if (!fs.statSync(filePath).isDirectory()) {
        if (path.extname(file) === '.vtex_c') {
            console.log('decompiling', filePath);
            exec('"lib/ValveResourceFormat/Decompiler.exe" -i "' + filePath + '" -o "' + outDir + '"', function (error, stdout, stderr) {
                var outPath = path.join(outDir, path.basename(file, '.vtex_c') + '.png')
                console.log('resizing', outPath, width, height);
                var image = sharp(outPath);
                image.metadata()
                    .then(function(metadata) {
                        return image
                        .extract({
                            top: 0,
                            left: 0,
                            width: Math.min(width, metadata.width),
                            height: Math.min(height, metadata.height)
                        })
                        .toFile(outPath.replace('_png', ''))
                        .then(function() {
                            fs.unlinkSync(outPath);
                            console.log('done.');
                        }).catch(function() {
                            console.log('error.', outPath);
                        });
                    })

            });
        }
    }
});
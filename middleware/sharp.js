const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, next) => {
    try {
        if (req.file) {
            const name = path.parse(req.file.filename).name;
            const nameExt = `${name}_resized.webp`
            const outputFile = path.join('images', nameExt);

            sharp(req.file.path)
                .resize({
                    fit: sharp.fit.contain,
                    height: 600
                })
                .webp({ quality: 60 })
                .toFile(outputFile)
                .then(res.nameExt = nameExt,
                    //console.log(req.file)
                );                          
        }
        next();        
        }
    catch(error) {
        res.status(500).json({ error });
    }
 };

 
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const nameExt = file.originalname.split(' ').join('_');
    const name = path.parse(nameExt).name;
    const extension = path.parse(nameExt).ext;
    callback(null, name + Date.now() + extension);
  }
});


module.exports = multer({storage: storage}).single('image');
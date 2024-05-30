const multer = require("multer");
const SharpMulter = require("sharp-multer");

//Modification du nom de fichier
const newFilenameFunction = (og_filename, options) => {
  const newname =
    og_filename.split(".").slice(0, -1).join(".") +
    `${options.useTimestamp ? "-" + Date.now() : ""}` +
    "." +
    options.fileFormat;
  return newname;
};

//Utilisation de sharpmulter pour créer et compresser l'image ajouté 
const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, "images"),
    imageOptions: {
      fileFormat: "webp",
      quality: 60,
      resize: { height: 800, resizeMode: "contain" },
      useTimestamp: true,
    },
  filename: newFilenameFunction,
});


module.exports = multer({ storage: storage }).single('image');
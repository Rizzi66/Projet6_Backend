const path = require('path');
const fs = require('fs');

module.exports = (req, res, next) => {
    try { fs.unlinkSync(`images/${req.file.filename}`)
                          
        next();        
        }
    catch(error) {
        res.status(501).json({ error });
    }
 };

 
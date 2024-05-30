const jwt = require('jsonwebtoken');

//Middelware d'authentification
module.exports = (req, res, next) => {
    try {
        //Vérification du token envoyé par le front-end
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'CyhE3KF8CB');
        //Ajout du userId dans la requète après décodage
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
	    next();
    } catch(error) {
        res.status(401).json({ error });
    }
};
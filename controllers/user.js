const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

//Controller de la route POST "signup"
exports.signup = (req, res, next) => {
    //Hashage du mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        //Ajout de l'email et du hash dans une const avec le modèle "User"
        const user = new User({
          email: req.body.email,
          password: hash
        });
        //Enregistrement de cette const dans la BDD
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

//Controller de la route POST "login"
exports.login = (req, res, next) => {
    //Recherche de l'email en BDD
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            //Comparaison du mot de passe avec celui en BDD
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    //Renvoi du response avec le token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'CyhE3KF8CB',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };
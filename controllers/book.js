const Book = require('../models/Book');
const fs = require('fs');



//Controller de la route GET "getAllBooks"
exports.getAllBooks = (req, res, next) => {
    //Récupération de tous les livres dans la BDD
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}



//Controller de la route GET "getOneBook"
exports.getOneBook = (req, res, next) => {
    //Récupération du book correspondant à l'id dans la BDD
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
}



//Controller de la route POST "createBook"
exports.createBook = (req, res, next) => {
    //Récupération des datas "book" envoyé par le front-end
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    //Création d'un nouveau "book" avec le modèle
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    //Enregistrement du "book" dans la BDD
    book.save()
        .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
        .catch(error => { res.status(400).json( { error })}) 
}



//Controller de la route PUT "modifyBook"
exports.modifyBook = (req, res, next) => {
    //Récupération des nouvelles datas "book" envoyé par le front-end (en verifiant que l'image a été changé ou non)
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete bookObject._userId;

    //Récupération du book correspondant à l'id dans la BDD
    Book.findOne({_id: req.params.id})
        .then((book) => {
            //Vérification de l'userID pour modification
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : 'Forbidden'});
            } else {
                //Si l'image a été modifié, suppression de l'ancienne image
                if (req.file) {
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlinkSync(`images/${filename}`)
                }
                //Modification du "book" dans la BDD
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
}



//Controller de la route DELETE "deleteBook"
exports.deleteBook = (req, res, next) => {
    //Récupération du book correspondant à l'id dans la BDD
    Book.findOne({_id: req.params.id})
        .then(book => {
            //Vérification de l'userID pour suppression
            if (book.userId != req.auth.userId) {
                res.status(403).json({message: 'Forbidden'});
            } else {
                //Suppression de l'image sur le serveur
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    //Suppression du "book" dans la BDD
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};



//Controller de la route GET "getBestRating"
exports.getBestRating = (req, res, next) => {
    //Récupération des 3 livres avec le plus gros "averageRating" dans la BDD
    Book.find().sort(({averageRating: -1})).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}



//Controller de la route POST "createRating"
exports.createRating = (req, res, next) => {
    //Récupération du book correspondant à l'id dans la BDD
    Book.findOne({_id: req.params.id})
        .then(book => {
            //Récupération des notes et des userID qui ont mis une note
            const rates = book.ratings;
            const userIdArray = rates.map(rate => rate.userId)

            //Vérification de l'userID pour voir si une note a déjà été donnée
            if (userIdArray.includes(req.body.userId)) {
                res.status(403).json( { message : 'Forbidden' })
            } else {
                //Ajout de la nouvelle note dans le "book" en question
                rates.push({
                    userId: req.body.userId,
                    grade: req.body.rating
                });
                
                //Récupération des différentes notes pour calculer la note moyenne
                const ratesArray = rates.map(rate => rate.grade)
                const sumRating = ratesArray.reduce((acc, current) => acc + current, 0);
                const averageRating = parseFloat(sumRating / rates.length).toFixed(1);
                //Ajout de la nouvelle note moyenne dans le "book" en question
                book.averageRating = averageRating
                    
                //Enregistrement du "book" dans la BDD
                book.save()
                    .then(() => { res.status(201).json(book)})
                    .catch(error => { res.status(400).json( { error })})
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
}





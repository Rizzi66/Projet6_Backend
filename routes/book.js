const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const image = require('../middleware/image');

const router = express.Router();

//Création des routes "GET" pour "book"
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);
router.get('/:id', bookCtrl.getOneBook);

//Création des routes "POST" pour "book"
router.post('/', auth, image, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.createRating); 

//Création route "PUT" pour "book"
router.put('/:id', auth, image, bookCtrl.modifyBook);

//Création route "DELETE" pour "book"
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
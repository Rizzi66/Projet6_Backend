const express = require('express');
const bookCtrl = require('../controllers/book');

const router = express.Router();

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/bestrating', bookCtrl.getBestRating);
router.post('/', bookCtrl.createBook);
router.put('/:id', bookCtrl.modifyBook);
router.delete('/:id', bookCtrl.deleteBook);
router.post('/:id/rating', bookCtrl.createRating); 

module.exports = router;
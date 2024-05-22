const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');


const router = express.Router();

router.get('/', auth, bookCtrl.getAllBooks);
router.get('/:id', auth, bookCtrl.getOneBook);
router.get('/bestrating', auth, bookCtrl.getBestRating);
router.post('/', auth, bookCtrl.createBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.createRating); 

module.exports = router;
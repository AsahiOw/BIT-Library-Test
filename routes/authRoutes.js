const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = Router();

//Route for user authentication
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

//Route for book, author, category and publisher
router.get('/author',requireAuth, authController.author_get);
router.post('/author', authController.author_post);
router.get('/book',requireAuth, authController.book_get);
router.post('/book', authController.book_post);
router.get('/category',requireAuth, authController.category_get);
router.post('/category', authController.category_post);
router.get('/publisher',requireAuth,authController.publisher_get);
router.post('/publisher', authController.publisher_post);
module.exports = router;
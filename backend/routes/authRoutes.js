const express = require('express');
const { registerUser, loginUser, getMe, oauthLogin } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/oauth', oauthLogin);  // OAuth sign-in/sign-up
router.get('/me', protect, getMe);

module.exports = router;

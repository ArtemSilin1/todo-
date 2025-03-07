const Router = require('express');
const router = Router();

const { auth, user } = require('./user');

// Авторизация
router.post('/register', auth.registration)
router.post('/login', auth.login)

// Операции с пользователями
router.get('/allUsers', user.getAllUsers)

module.exports = router;
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const redirectIfNotLoggedIn = require('../middleware/auth.js');
const redirectIfLoggedIn = require('../middleware/loggedIn.js');
const redirectIfLoggedInApi = require('../middleware/loggedInApi.js');

router.get('/register', redirectIfLoggedInApi, AuthController.registrationInstructions);

router.post('/register', redirectIfLoggedInApi, AuthController.register);

router.get('/login', redirectIfLoggedIn, AuthController.loginInstructions);

router.post('/login', redirectIfLoggedIn, AuthController.login);

router.get("/logout", redirectIfNotLoggedIn, AuthController.logout);

router.get("/auth/github", AuthController.githubAuth);
router.get("/auth/github/callback", AuthController.githubCallback);

router.get('/auth/google', AuthController.googleAuth);
router.get("/auth/google/callback", AuthController.googleCallback);

router.get('/current', redirectIfNotLoggedIn, AuthController.currentSession);

module.exports = router;
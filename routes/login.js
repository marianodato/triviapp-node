const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login_controller');
const passport = require('passport');
const errors = require('../utils/errors');
let log = require('debug-logger')('triviapp');

router.post('/', function (req, res, next) {
    log.info("login.js -> passportAuthenticate");
    const passportStrategy = "facebookToken";
    passport.authenticate(passportStrategy, function (err, user) {
        if (err) {
            log.error("User find or save error!");
            log.error("Error trace: ", err);
            return next(errors.InternalServerError);
        }
        if (!user) {
            log.error("Unauthorized user error!");
            return next(errors.AuthError);
        }

        req.user = user;
        return next();

    })(req, res, next);

}, loginController.facebookOAuth);

module.exports = router;
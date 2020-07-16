const express = require('express');
let log = require('debug-logger')('triviapp');
const router = express.Router();
const gamesController = require('../../controllers/games_controller');

router.get('/', notLoggedIn, function(req, res, next) {
    var messages = req.flash('error');
    res.render('admin/login', { title: 'PAQ | Login', layout: false, error: messages });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/admin');
});

// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/admin');
}

function notLoggedIn(req, res, next) {
    //No esta logueado, prosigo con la solicitud
    if (!req.isAuthenticated()) {
        return next();
    }
    //Esta logueado, entonces lo redirijo a donde corresponda
    res.redirect('/admin/games');
}

module.exports = router;
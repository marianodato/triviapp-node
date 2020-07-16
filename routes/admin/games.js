const express = require('express');
const log = require('debug-logger')('triviapp');
const router = express.Router();
const handlebarsHelpers = require('../../utils/handlebars_helpers');
const errors = require('../../utils/errors');
const gamesController = require('../../controllers/games_controller');
const gamesService = require('../../services/games_service');

router.post('/', gamesController.validateCreateGameBody, gamesController.createGame);
router.post('/add-questions', gamesController.addQuestions);
router.post('/change-streaming-url', gamesController.changeStreamingUrl);
router.post('/change-socket-url', gamesController.changeSocketUrl);

router.get('/', async (req, res) => {
    log.info("admin/games.js -> getGames");
    try {
        let games = await gamesService.getGames();
        res.render('admin/games', {
            title: 'PAQ | Games',
            active: {games: true},
            games: games });
    } catch (err) {
        log.error("getGames error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
});

router.get('/real-time-dashboard', async (req, res) => {
    log.info("admin/games.js -> real-time-dashboard");
    res.render('admin/rt_dashboard', {
            title: 'PAQ | Real Time Dashboard',
            active: {rtdashboard: true}
    });
});

router.get('/show-profile/:game_id', async (req, res) => {
    log.info("admin/games.js -> show-profile");
    try {
        const gameId = req.params.game_id;
        let game = await gamesService.getGameById(gameId);
        let questions = await gamesService.getGameQuestions(gameId);
        res.render('admin/game_profile', {
            title: 'PAQ | Games',
            game: game,
            questions: questions,
            helpers: {
                questionIsShowed: function (question) {
                    return false;
                },
                questionResumeIsShowed: function (question) {
                    return false;
                },
                isCorrectAnswer: function (answerNumber, questionAnswerNumber) {
                    return answerNumber == questionAnswerNumber;
                },
                toJson: handlebarsHelpers.jsonToString
            }});
    } catch (err) {
        log.error("Show Profile error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
});

router.post('/show-question', function (req, res, next) {
    log.info("admin/games.js -> show-question");

    const socket = require('socket.io-client')('http://localhost:' + normalizePort(process.env.PORT || '3000'));
    log.debug("Cliente admin envía mostrar proxima pregunta");
    socket.emit('show-question', req.body.question);
    return res.status(200).json({ok: "ok"});
});

router.post('/show-question-summary', function (req, res, next) {
    log.info("admin/games.js -> show-question");

    const socket = require('socket.io-client')('http://localhost:' + normalizePort(process.env.PORT || '3000'));
    log.debug("Cliente admin envía mostrar proxima pregunta");
    socket.emit('show-summary');
    return res.status(200).json({ok: "ok"});
});

router.post('/change-status', function (req, res, next) {
    log.info("admin/games.js -> change-status");

    if (req.body.status == "finished") {
        const socket = require('socket.io-client')('http://localhost:' + normalizePort(process.env.PORT || '3000'));
        log.debug("Cliente admin envía fin de juego");
        socket.emit('end-game');
    }
    return next();
}, gamesController.changeGameStatus);

router.post('/save-winners', function (req, res, next) {
    log.info("admin/games.js -> save-winners");

    const socket = require('socket.io-client')('http://localhost:' + normalizePort(process.env.PORT || '3000'));
    log.debug("Cliente admin envía get-winners");

    socket.on('winners', function (data) {
        req.body.winners = data;
        return next();
    });

    socket.emit('get-winners');

}, gamesController.saveWinners);

router.post('/show-winners', function (req, res, next) {
    log.info("admin/games.js -> show-winners");

    const socket = require('socket.io-client')('http://localhost:' + normalizePort(process.env.PORT || '3000'));
    log.debug("Cliente admin envía mostrar winners");
    socket.emit('show-winners');
    return res.status(200).json({ok: "ok"});
});

function normalizePort(val) {
    log.info("www.js -> normalizePort");
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/admin');
}

module.exports = router;
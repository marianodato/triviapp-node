const usersService = require('../services/users_service');
const gamesService = require('../services/games_service');
const errors = require('../utils/errors');
let log = require('debug-logger')('triviapp');
const {body, validationResult} = require('express-validator/check');
const Game = require('../models/game_schema');
const Question = require('../models/question_schema');

const validateCreateGameBody = [body('name').exists({checkNull: true, checkFalsy: true}).isString(),
    body('presenter.name').exists({checkNull: true, checkFalsy: true}).isString(),
    body('presenter.image_url').exists({checkNull: true, checkFalsy: true}).isString().isURL(),
    body('prize').exists({checkNull: true, checkFalsy: true}).isString(),
    body('start_date').exists({checkNull: true, checkFalsy: true}).isNumeric(),
    body('config.socket_url').exists({checkNull: true, checkFalsy: true}).isString().isURL(),
    body('config.streaming_url').exists({checkNull: true, checkFalsy: true}).isString().isURL()
];

async function getGames() {
    log.info("games_controller.js -> getGames");
    try {
        let games = await gamesService.getGames();
        if (games.length == 0) {
            return res.status(204).json({});
        } else {
            return res.status(200).json({games: games});
        }
    } catch (err) {
        log.error("getGames error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function createGame(req, res, next) {
    log.info("games_controller.js -> createGame");

    try {
        validationResult(req).throw();
    } catch (err) {
        log.error("validationResult error!");
        log.error("Error trace: ", err.mapped());
        return next(errors.BadRequestError);
    }

    try {

        let game = new Game({
            name: req.body.name,
            presenter: req.body.presenter,
            prize: req.body.prize,
            config: req.body.config,
            start_date: req.body.start_date
        });

        await gamesService.saveGame(game);
        game = game.toJSON();
        delete game.__v;
        return res.status(201).json({game: game})
    } catch (err) {
        log.error("saveGame error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function getDashboard(req, res, next) {
    log.info("games_controller.js -> getDashboard");
    try {
        let game = await gamesService.getNextGame();
        let user = await usersService.getUserById(req.user_id);
        if (!game || !user) {
            if (user) {
                return res.status(200).json({user_balance: user.balance});
            } else {
                return res.status(204).json({});
            }
        } else {
            game = game.toJSON();
            delete game.__v;
            return res.status(200).json({next_game: game, user_balance: user.balance});
        }
    } catch (err) {
        log.error("getNextGame error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function addQuestions(req, res, next) {
    log.info("games_controller.js -> addQuestions");
    try {

        let questions = [];
        req.body.questions.forEach(function(bodyQuestion) {
            let question = new Question({
                game_id: req.body.game_id,
                question: bodyQuestion.question,
                time_should_show: bodyQuestion.time_should_show,
                answers: bodyQuestion.answers,
                correct_option_number: bodyQuestion.correct_option_number
            });
            questions.push(question);
        });

        await gamesService.addQuestions(questions);
        return res.status(201).json({questions: questions})
    } catch (err) {
        log.error("addQuestions error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function getGameQuestions(req, res, next) {
    log.info("games_controller.js -> getGameQuestions for gameId: " + req.params.game_id);
    try {
        const questions = await gamesService.getGameQuestions(req.params.game_id);
        return res.status(200).json({questions: questions})
    } catch (err) {
        log.error("game-questions error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function changeGameStatus(req, res, next) {
    log.info("games_controller.js -> changeGameStatus");
    try {
        await gamesService.changeGameStatus(req.body.game_id, req.body.status);
        return res.status(200).json({success: true})
    } catch (err) {
        log.error("changeGameStatus error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function changeStreamingUrl(req, res, next) {
    log.info("games_controller.js -> changeStreamingUrl");
    try {
        const gameId = req.body.pk;
        const url = req.body.value;
        await gamesService.changeStreamingUrl(gameId, url);
        return res.status(200).json({success: true})
    } catch (err) {
        log.error("changeStreamingUrl error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function changeSocketUrl(req, res, next) {
    log.info("games_controller.js -> changeSocketUrl");
    try {
        const gameId = req.body.pk;
        const url = req.body.value;
        await gamesService.changeSocketUrl(gameId, url);
        return res.status(200).json({success: true})
    } catch (err) {
        log.error("changeStreamingUrl error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function saveWinners(req, res, next) {
    log.info("games_controller.js -> saveWinners");
    try {
        const winnersDic = req.body.winners;
        const gameId = req.body.game_id;
        let winners = [];
        for (var key in winnersDic) {
            winners.push(winnersDic[key]);
        }
        await gamesService.saveWinners(gameId, winners);
        return res.status(200).json({success: true})
    } catch (err) {
        log.error("saveWinners error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

module.exports = {
    validateCreateGameBody,
    createGame,
    getGames,
    getDashboard,
    addQuestions,
    getGameQuestions,
    changeGameStatus,
    changeStreamingUrl,
    changeSocketUrl,
    saveWinners
};
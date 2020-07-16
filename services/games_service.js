const Game = require('../models/game_schema');
const Question = require('../models/question_schema');
let log = require('debug-logger')('triviapp');

async function saveGame(game) {
    log.info("game_service.js -> saveGame");
    return await game.save();
}

async function getGames() {
    log.info("game_service.js -> getGames");
    return await Game.find().sort({start_date: 1});
}

async function getGameById(gameId) {
    log.info("game_service.js -> getGameById");
    return await Game.findById(gameId);
}

async function getNextGame() {
    log.info("game_service.js -> getNextGame");
    return await Game.findOne({status: {$in: ["pending", "started"]}}).sort({start_date: 1});
}

async function addQuestions(questions) {
    log.info("game_service.js -> addQuestions");
    return await Question.collection.insert(questions);
}

async function getGameQuestions(gameId) {
    log.info("game_service.js -> getGameQuestions");
    return await Question.find({game_id: gameId});
}

async function changeGameStatus(gameId, status) {
    log.info("game_service.js -> changeGameStatus");
    return await Game.findByIdAndUpdate(gameId, {$set: {"status": status}}, {
        new: true,
        runValidators: true,
        context: 'query'
    });
}

async function changeStreamingUrl(gameId, streamingUrl) {
    log.info("game_service.js -> changeStreamingUrl");
    return await Game.findByIdAndUpdate(gameId, {$set: {"config.streaming_url": streamingUrl}}, {
        new: true,
        runValidators: true,
        context: 'query'
    });
}

async function changeSocketUrl(gameId, socketUrl) {
    log.info("game_service.js -> changeSocketUrl");
    return await Game.findByIdAndUpdate(gameId, {$set: {"config.socket_url": socketUrl}}, {
        new: true,
        runValidators: true,
        context: 'query'
    });
}

async function saveWinners(gameId, winners) {
    log.info("game_service.js -> saveWinners");
    return await Game.findByIdAndUpdate(gameId, {$set: {"winners": winners}}, {
        new: true,
        runValidators: true,
        context: 'query'
    });
}

module.exports = {
    saveGame,
    getGames,
    getGameById,
    getNextGame,
    addQuestions,
    getGameQuestions,
    changeGameStatus,
    changeStreamingUrl,
    changeSocketUrl,
    saveWinners
};
const express = require('express');
let log = require('debug-logger')('triviapp');
const router = express.Router();

router.get('/ping', function (req, res, next) {
    log.info("index.js -> ping");
    return res.status(200).json({ping: "pong"});
});

module.exports = router;
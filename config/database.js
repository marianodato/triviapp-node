const mongoose = require('mongoose');
const constants = require("../utils/constants.json");
let log = require('debug-logger')('triviapp');

module.exports.init = function () {
    log.info("database.js -> init");
    mongoose.connect(constants.DB_STRING_CONNECTION, {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', function (err) {
        log.error("DB Connection error!");
        log.error("Error trace: ", err);
        process.exit(1);
    });
    db.once('open', function() {
        log.debug("Mongo conectado!");
    });
};
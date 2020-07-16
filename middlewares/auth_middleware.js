const jwt = require('jsonwebtoken');
const constants = require('../utils/constants.json');
const errors = require('../utils/errors');
let log = require('debug-logger')('triviapp');

module.exports = async function(req, res, next){
    log.info("auth_middleware.js -> authCheck");
    const access_token = req.body.access_token || req.query.access_token || req.headers['access_token'];
    if (access_token) {
        try {
            const decoded = await jwt.verify(access_token, constants.JWT_SECRET);
            req.user_id = decoded.id;
            log.debug("UserId: ", req.user_id);
            return next();
        } catch(err) {
            log.error("Error verifying token!");
            log.error("Error trace: ", err);
            return next(errors.AuthError);
        }
    } else {
        log.error("Error token not found!");
        return next(errors.AuthError);
    }
};
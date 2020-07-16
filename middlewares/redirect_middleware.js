let log = require('debug-logger')('triviapp');

module.exports = function (req, res, next) {
    log.info("redirect_middleware.js -> forceHttps");
    // log.debug("Body: ", req.body);
    log.debug("Params: ", req.params);
    log.debug("Headers: ", req.headers);
    if (!(req.secure || req.headers['x-forwarded-proto'] === 'https') && !(process.env.NODE_ENV === 'development')) {
        log.error("Error insecure request! Redirecting to https!");
        return res.redirect("https://" + req.headers.host + req.url);
    }
    return next();
};
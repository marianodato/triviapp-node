const constants = require("../utils/constants.json");
const JWT = require('jsonwebtoken');
const errors = require("../utils/errors");
let log = require('debug-logger')('triviapp');

class LoginController {
    async facebookOAuth(req, res, next) {
        log.info("login_controller.js -> facebookOAuth");
        try {
            // Generate token
            const access_token = await JWT.sign({
                iss: 'triviapp',
                social_token: req.user.socialToken,
                id: req.user._id,
                iat: Date.now(), // Current time
                exp: new Date().setDate(new Date().getYear() + 1) // Current time + 1 year ahead
            }, constants.JWT_SECRET);

            const user = req.user.toJSON();
            user.access_token = access_token;
            delete user.__v;
            return res.status(201).json({user: user});
        } catch (err) {
            log.error("JWT sign error!");
            log.error("Error trace: ", err);
            return next(errors.InternalServerError);
        }
    }
}

const loginController = new LoginController();

module.exports = loginController;
const constants = require('../utils/constants.json');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../models/user_schema');
let log = require('debug-logger')('triviapp');
const usersService = require('../services/users_service');

facebookTokenStrategy = new FacebookTokenStrategy({
    clientID: constants.FACEBOOK_CLIENT_ID,
    clientSecret: constants.FACEBOOK_CLIENT_SECRET,
    session: false,
    passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, done) {
    log.info("passport.js -> facebookTokenStrategy");
    try {

        const existingUser = await usersService.getUserByFacebokId(profile.id);

        if (existingUser) {
            existingUser.socialToken = accessToken;
            return done(null, existingUser);
        }

        const userDisplayName = profile.displayName;

        const newUser = new User({
            name: userDisplayName,
            image_url: profile.photos[0].value,
            email: profile.emails[0].value,
            facebook_id: profile.id
        });

        await usersService.saveUser(newUser);

        newUser.socialToken = accessToken;
        return done(null, newUser);

    } catch(err) {
        log.error("User find or save error!");
        log.error("Error trace: ", err);
        return done(err, false, err.message);
    }
});

module.exports = facebookTokenStrategy;
const express = require('express');
const requestLogger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const errors = require('./utils/errors');
let log = require('debug-logger')('triviapp');
const expressHbs = require('express-handlebars');
const passport = require('passport');
const facebookTokenStrategy = require('./config/passport');
const db = require('./config/database');
const index = require('./routes/index');
const admin = require('./routes/admin/admin');
const adminGames = require('./routes/admin/games');
const login = require('./routes/login');
const users = require('./routes/users');
const dashboard = require('./routes/dashboard');
const forceHttps = require('./middlewares/redirect_middleware');
const authCheck = require('./middlewares/auth_middleware');

db.init();
passport.use('facebookToken', facebookTokenStrategy);

const app = express();
app.use(requestLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(forceHttps);
app.use('/', index);
app.use('/admin', admin);
app.use('/admin/games', adminGames);
app.use('/login', login);
app.use('/dashboard', authCheck, dashboard);
app.use('/users', authCheck, users);

app.engine('.hbs', expressHbs({defaultLayout: 'admin_layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    log.info("app.js -> 404");
    return next(errors.NotFoundError);
});

// Error handler
app.use(function(err, req, res, next) {
    /* We log the error internaly */
    log.info("app.js -> Error handler");
    log.error("Error trace: ", err);

    err.status = err.status ? err.status : 500;
    if (err.status === 500){
        err.message = 'Ops... Something went wrong!';
    }else{
        err.message = err.message ? err.message : 'Ops... Something went wrong!';
    }

    /* Finaly respond to the request */
    return res.status(err.status).json({status: err.status, message: err.message});
});

module.exports = app;
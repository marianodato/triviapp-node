let log = require('debug-logger')('triviapp');

function NotFoundError() {
    log.info("errors.js -> NotFoundError");
    Error.captureStackTrace(this, this.constructor);
    this.message = 'Resource not found!';
    this.status = 404;
    return this;
}

function InternalServerError() {
    log.info("errors.js -> InternalServerError");
    Error.captureStackTrace(this, this.constructor);
    this.message = 'Ops... Something went wrong!';
    this.status = 500;
    return this;
}

function AuthError() {
    log.info("errors.js -> AuthError");
    Error.captureStackTrace(this, this.constructor);
    this.message = 'Cannot authenticate user!';
    this.status = 401;
    return this;
}

function BadRequestError() {
    log.info("errors.js -> BadRequestError");
    Error.captureStackTrace(this, this.constructor);
    this.message = 'Invalid body fields!';
    this.status = 400;
    return this;
}

function ForbiddenError() {
    log.info("errors.js -> ForbiddenError");
    Error.captureStackTrace(this, this.constructor);
    this.message = 'User does not have the privileges to access this resource!';
    this.status = 403;
    return this;
}

const forbiddenError = new ForbiddenError();
const badRequestError = new BadRequestError();
const notFoundError = new NotFoundError();
const internalServerError = new InternalServerError();
const authError = new AuthError();

module.exports = {
    ForbiddenError: forbiddenError,
    BadRequestError: badRequestError,
    NotFoundError: notFoundError,
    InternalServerError: internalServerError,
    AuthError: authError
};
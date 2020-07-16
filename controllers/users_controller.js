const usersService = require('../services/users_service');
const WithdrawRequest = require('../models/withdraw_request_schema');
const withdrawsService = require('../services/withdraw_requests_service');
const errors = require('../utils/errors');
let log = require('debug-logger')('triviapp');
const {body, validationResult} = require('express-validator/check');

const validateAddDepositAccount = [body('deposit_account').exists({checkNull: true, checkFalsy: true}).isString()];

async function createWithdrawRequest(req, res, next) {
    log.info("users_controller.js -> requestWithdraw");

    const user = await usersService.getUserById(req.user_id);

    if (!user) {
        log.error("Cannot find user to request withdraw!");
        return next(errors.InternalServerError);
    }

    if (user.balance.amount < user.balance.min_amount_to_withdraw) {
        log.error("Balance amount is less than the minimun amount to withdraw!");
        return next(errors.ForbiddenError);
    }

    let request = await withdrawsService.getPendingRequest(req.user_id);

    if (request) {
        log.debug("User already has a pending withdraw request!");
    } else {
        try {
            request = new WithdrawRequest({
                user_id: req.user_id,
                status: "pending",
                amount: user.balance.amount,
                currency_id: user.balance.currency_id
            });

            await withdrawsService.saveWithdrawRequest(request);
            await usersService.updateBalance(req.user_id, 0);

        } catch (err) {
            log.error("requestWithdraw error!");
            log.error("Error trace: ", err);
            return next(errors.InternalServerError);
        }
    }

    return res.status(201).json({status: request.status, requested_date: request.requested_date});
}

async function addDepositAccount(req, res, next) {
    log.info("users_controller.js -> addDepositAccount");

    try {
        validationResult(req).throw();
    } catch (err) {
        log.error("validationResult error!");
        log.error("Error trace: ", err.mapped());
        return next(errors.BadRequestError);
    }

    try {
        let user = await usersService.addDepositAccount(req.user_id, req.body.deposit_account);
        if (!user) {
            log.error("Cannot find user to update!");
            throw new Error("Cannot find user to update!");
        } else {
            return res.status(201).json({deposit_account: user.balance.deposit_account});
        }
    } catch (err) {
        log.error("addDepositAccount error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function getBalance(req, res, next) {
    log.info("users_controller.js -> getBalance");
    try {
        let user = await usersService.getUserById(req.user_id);

        if (!user) {
            log.error("Cannot find user to get balance!");
            throw new Error("Cannot find user to get balance!");
        } else {
            return res.status(200).json({balance: user.balance});
        }
    } catch (err) {
        log.error("getBalance error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

async function getRanking(req, res, next) {
    log.info("users_controller.js -> getRanking");
    const rankingLimit = 50;
    try {
        let users = await usersService.getRanking(rankingLimit);

        if (users.length === 0) {
            res.status(204).json({});
        } else {
            for (let i in users) {
                users[i] = users[i].toJSON();
                delete users[i].balance.deposit_account;
                delete users[i].balance.min_amount_to_withdraw;
                delete users[i].__v;
                delete users[i].registration_date
            }
            return res.status(200).json({ranking: users});
        }
    } catch (err) {
        log.error("getRanking error!");
        log.error("Error trace: ", err);
        return next(errors.InternalServerError);
    }
}

module.exports = {
    createWithdrawRequest,
    validateAddDepositAccount,
    addDepositAccount,
    getBalance,
    getRanking
};
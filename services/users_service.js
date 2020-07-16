const User = require('../models/user_schema');
let log = require('debug-logger')('triviapp');

async function getUserById(id) {
    log.info("users_service.js -> getUserById");
    return await User.findById(id);
}

async function getUserByFacebokId(id) {
    log.info("users_service.js -> getUserByFacebokId");
    return await User.findOne({facebook_id: id});
}

async function saveUser(user) {
    log.info("users_service.js -> saveUser");
    return await user.save();
}

async function getRanking(limit) {
    log.info("users_service.js -> getRanking");
    return await User.find({}).sort({ "balance.amount": -1}).limit(limit);
}

async function addDepositAccount(id, deposit_account) {
    log.info("users_service.js -> addDepositAccount");
    return await User.findByIdAndUpdate(id, {$set: {"balance.deposit_account": deposit_account}}, {
        new: true,
        runValidators: true,
        context: 'query'
    });
}

async function updateBalance(id, amount) {
    log.info("users_service.js -> updateBalance");
    return await User.findByIdAndUpdate(id, {$set: {"balance.amount": amount}}, {
        new: true,
        runValidators: true,
        context: 'query'
    });
}

module.exports = {
    getUserById,
    getUserByFacebokId,
    saveUser,
    getRanking,
    addDepositAccount,
    updateBalance
};
const WithdrawRequest = require('../models/withdraw_request_schema');
let log = require('debug-logger')('triviapp');
const mongoose = require('mongoose');

async function getPendingRequest(id) {
    log.info("withdraw_requests.js -> getPendingRequest");
    return await WithdrawRequest.findOne({user_id: mongoose.Types.ObjectId(id), status: "pending"});
}

async function saveWithdrawRequest(request) {
    log.info("withdraw_requests.js -> saveWithdrawRequest");
    request.save();
}

module.exports = {
    getPendingRequest,
    saveWithdrawRequest
};
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');

router.get('/ranking', usersController.getRanking);
router.get('/balance', usersController.getBalance);
router.post('/deposit-account', usersController.validateAddDepositAccount, usersController.addDepositAccount);
router.post('/request-withdraw', usersController.createWithdrawRequest);

module.exports = router;
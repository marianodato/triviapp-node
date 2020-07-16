const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
let log = require('debug-logger')('triviapp');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    image_url: String,
    email: {type: String, lowercase: true},
    balance: {
        amount: { type: Number, required: true, default: 0 },
        currency_id: { type: String, required: true, default: "ARS" },
        deposit_account: {type: String, default: "", lowercase: true},
        min_amount_to_withdraw: { type: Number, required: true, default: 1000 }
    },
    facebook_id: String,
    registration_date: {type: Number, required: true, default: Date.now()},
    password: {type: String, select: false}
});

userSchema.pre('save', async function (next) {
    log.info("user_schema.js -> presave");
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt, null);
        user.password = hash;
        return next();
    } catch (err) {
        log.error("presave error!");
        return next(err)
    }
});

userSchema.plugin(mongooseUniqueValidator);

const User = mongoose.model('user', userSchema);

module.exports = User;
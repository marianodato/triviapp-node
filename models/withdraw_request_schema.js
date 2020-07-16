const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const withdrawRequestSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "user", required: true},
    status: {type: String, required: true, enum: ["pending", "accredited"], default: "pending"},
    requested_date: {type: Number, required: true, default: Date.now()},
    accredited_date: {type: Number},
    amount: {type: Number},
    currency_id: {type: String}
});

withdrawRequestSchema.plugin(mongooseUniqueValidator);

const Question = mongoose.model('withdrawRequest', withdrawRequestSchema);

module.exports = Question;
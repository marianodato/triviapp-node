const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    game_id: {type: Schema.Types.ObjectId, ref: "game", required: true},
    question: {type: String, required: true},
    time_should_show: {type: Number, required: true, default: 10000},
    answers:
        [
            {
                option_number: {type: Number, required: true},
                answer: {type: String, required: true}
            }
        ],
    correct_option_number: {type: Number, required: true}
});

questionSchema.plugin(mongooseUniqueValidator);

const Question = mongoose.model('question', questionSchema);

module.exports = Question;
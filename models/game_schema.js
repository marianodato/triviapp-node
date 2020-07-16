const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    name: {type: String, required: true},
    start_date: {type: Number, required: true},
    presenter: {
        name: {type: String, required: true},
        image_url: {type: String, required: true},
    },
    status: {type: String, required: true, enum: ["pending", "started", "finished"], default: "pending"},
    prize: {type: String, required: true},
    config: {
        socket_url: {type: String, required: true},
        streaming_url: {type: String},
    },
    language_code: {type: String, required: true, default: "en"},
    winners:
        [
            {
                user_id: {type: String, required: true},
                name: {type: String, required: true},
                image_url: {type: String, required: true},
                email: {type: String, lowercase: true}
            }
        ]
});

gameSchema.plugin(mongooseUniqueValidator);

const Game = mongoose.model('game', gameSchema);

module.exports = Game;
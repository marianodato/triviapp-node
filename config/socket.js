module.exports.init = function (server) {

    const io = require('socket.io').listen(server);
    let log = require('debug-logger')('triviapp');

    let players = {};
    let playingUsers = {};
    let viewersCount = 0;
    let currentQuestion;
    let currentQuestionNumber = 0;
    let currentQuestionCorrectAnswer = 0;
    let didShowFirstQuestion = false;

    log.info("socket.js -> init");

    io.on('connection', function (socket) {
        log.debug('Alguien se ha conectado al server');
        viewersCount ++;

        socket.on('disconnect', function(data) {
            log.debug('User disconnected');
            viewersCount --;
            delete playingUsers[socket.id];
        });

        /** CLIENT MESSAGES **/

        socket.on('join', function(data) {
            const user = { user_id: data.user_id, name: data.name, image_url: data.image_url, email: data.email };
            log.debug('join attempt: ', user);
            const canPlay = !didShowFirstQuestion;
            if (canPlay) {
                log.debug('user can play');
                players[socket.id] = user;
            }
            socket.emit('game-joined', canPlay);
        });

        socket.on('user-answer', function (userAnswerOption) {
            log.debug('Usuario ha respondido opción: ', userAnswerOption);

            if (players[socket.id]) {

                if (userAnswerOption == currentQuestionCorrectAnswer) {
                    playingUsers[socket.id] = players[socket.id];
                }

                switch (userAnswerOption) {
                    case 0:
                        currentQuestion.answers[0].total_answered += 1;
                        break;
                    case 1:
                        currentQuestion.answers[1].total_answered += 1;
                        break;
                    case 2:
                        currentQuestion.answers[2].total_answered += 1;
                        break;
                }
            }
        });

        /** ADMIN MESSAGES **/

        socket.on('show-question', function (data) {

            didShowFirstQuestion = true;
            currentQuestionNumber ++;
            currentQuestion = data;
            currentQuestionCorrectAnswer = data.correct_option_number;

            delete data.correct_option_number;

            playingUsers = {};

            currentQuestion.answers[0].total_answered = 0;
            currentQuestion.answers[1].total_answered = 0;
            currentQuestion.answers[2].total_answered = 0;

            log.debug('Emitiendo nueva pregunta: ', data);

            io.sockets.emit('new-question', data);
        });

        socket.on('show-summary', function (data) {
            currentQuestion.correct_option_number = currentQuestionCorrectAnswer;
            log.debug('Admin envio show-summary: ', currentQuestion);
            io.sockets.emit('question-summary', currentQuestion);
        });

        socket.on('end-game', function (data) {
            io.sockets.emit('end-game');
            players = {};
            playingUsers = {};
            currentQuestionNumber = 0;
            currentQuestionCorrectAnswer = 0;
            didShowFirstQuestion = false;
        });

        socket.on('get-winners', function (data) {
            log.debug('Admin envio save-winners');
            socket.emit('winners', playingUsers)
        });

        socket.on('show-winners', function (data) {
            log.debug('Admin envio show-winners');
            io.sockets.emit('show-winners');
        });
    });

    setInterval(function() {
        log.debug('Players count: ', viewersCount);
        io.sockets.emit('players-count', viewersCount);
    }, 5000);

};
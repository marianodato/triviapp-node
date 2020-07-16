let currentGameId = "";
let currentQuestion = {};

$(document).ready(function () {

    $( "#set_game_pending_confirm_button" ).click(function() {
        changeGameStatus("pending");
    });

    $( "#start_game_confirm_button" ).click(function() {
        changeGameStatus("started");
    });

    $( "#end_game_confirm_button" ).click(function() {
        changeGameStatus("finished");
    });

    $( "#save_game_winners_confirm_button" ).click(function() {
        saveGameWinners();
    });

    $( "#show_game_winners_confirm_button" ).click(function() {
        showGameWinners();
    });

    $( "#show_question_confirm_button" ).click(function() {
        showQuestion();
    });

    $( "#show_question_summary_confirm_button" ).click(function() {
        showQuestionSummary();
    });

    $('#streaming_url_editable').editable({
        type: 'text',
        url: '/admin/games/change-streaming-url',
        title: 'Enter Streaming URL',
        ajaxOptions: {
            type: 'post'
        }
    });

    $('#socket_url_editable').editable({
        type: 'text',
        url: '/admin/games/change-socket-url',
        title: 'Enter Socket URL',
        ajaxOptions: {
            type: 'post'
        }
    });

});

function onNewQuestionInfoChanged() {
    const question = $("#questionInput").val();
    const optionA = $("#questionOptionAInput").val();
    const optionB = $("#questionOptionBInput").val();
    const optionC = $("#questionOptionCInput").val();
    const correctOption = $("#correctOptionInput").val();

    const dataIsMissing = question.length == 0 || optionA.length == 0 ||
        optionB.length == 0 || optionC.length == 0 || correctOption.length == 0;

    document.getElementById('btnAddQuestion').disabled = dataIsMissing;
}

function showSetGamePendingConfirmationModal(gameId) {
    currentGameId = gameId;
    $("#setGamePendingConfirmationModal").modal("show");
}

function showStartGameConfirmationModal(gameId) {
    currentGameId = gameId;
    $("#startGameConfirmationModal").modal("show");
}

function saveGameWinnersConfirmationModal(gameId) {
    currentGameId = gameId;
    $("#saveGameWinnersConfirmationModal").modal("show");
}

function showGameWinnersConfirmationModal(gameId) {
    currentGameId = gameId;
    $("#showGameWinnersConfirmationModal").modal("show");
}

function showEndGameConfirmationModal(gameId) {
    currentGameId = gameId;
    $("#endGameConfirmationModal").modal("show");
}

function showQuestionConfirmationModal(question) {
    currentQuestion = question;
    $("#showQuestionConfirmationModal").modal("show");
}

function showQuestionSummaryConfirmationModal() {
    $("#showQuestionSummaryConfirmationModal").modal("show");
    return true;
}

function showAddQuestionModal(gameId) {
    currentGameId = gameId;
    $("#addQuestionsModal").modal("show");
}

function changeGameStatus(status) {

    $.ajax({
        type: 'POST',
        url: '/admin/games/change-status',
        contentType: 'application/json',
        data: JSON.stringify({
            game_id : currentGameId,
            status: status
        }),
        error: function(xhr, status, error) {
            alert(status);
        },
        success : function(data) {
            alert("Change game status success");
            location.reload();
        }
    });
}

function saveGameWinners() {

    $.ajax({
        type: 'POST',
        url: '/admin/games/save-winners',
        contentType: 'application/json',
        data: JSON.stringify({
            game_id : currentGameId
        }),
        error: function(xhr, status, error) {
            alert(status);
        },
        success : function(data) {
            alert("Save Game Winners Success");
            $("#saveGameWinnersConfirmationModal").modal("hide");
        }
    });
}

function showGameWinners() {

    $.ajax({
        type: 'POST',
        url: '/admin/games/show-winners',
        contentType: 'application/json',
        error: function(xhr, status, error) {
            alert(status);
        },
        success : function(data) {
            alert("Show Game Winners Success");
            $("#showGameWinnersConfirmationModal").modal("hide");
        }
    });
}

function showQuestion() {

    $.ajax({
        type: 'POST',
        url: '/admin/games/show-question',
        contentType: 'application/json',
        data: JSON.stringify({
            question : currentQuestion
        }),
        error: function(xhr, status, error) {
            alert(status);
        },
        success : function(data) {
            alert("Show Question success");
            $("#showQuestionConfirmationModal").modal("hide");
        }
    });
}

function showQuestionSummary() {

    $.ajax({
        type: 'POST',
        url: '/admin/games/show-question-summary',
        contentType: 'application/json',
        error: function(xhr, status, error) {
            alert(status);
        },
        success : function(data) {
            alert("Show Question Summary success");
            $("#showQuestionSummaryConfirmationModal").modal("hide");
        }
    });
}

function saveQuestion() {

    const question = $("#questionInput").val();
    const optionA = $("#questionOptionAInput").val();
    const optionB = $("#questionOptionBInput").val();
    const optionC = $("#questionOptionCInput").val();
    const correctOption = $("#correctOptionInput").val();
    const timeShouldShow = $("#timeShouldShowInput").val();

    const answers = [{
            "option_number": 0,
            "answer": optionA
        },
        {
            "option_number": 1,
            "answer": optionB
        },
        {
            "option_number": 2,
            "answer": optionC
        }
    ];

    $.ajax({
        type: 'POST',
        url: '/admin/games/add-questions',
        contentType: 'application/json',
        data: JSON.stringify({
            game_id : currentGameId,
            questions: [{
                question: question,
                time_should_show: timeShouldShow,
                correct_option_number: correctOption,
                answers: answers
            }]
        }),
        error: function(xhr, status, error) {
            alert(status);
        },
        success : function(data) {
            alert("Add Questions success");
            $("#addQuestionsModal").modal("hide");
        }
    });
}
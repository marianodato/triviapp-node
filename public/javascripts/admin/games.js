
function onGameInfoChanged() {

    const gameName = $("#gameNameInput").val();
    const startDate = $("#startDateInput").val();
    const presenterName = $("#presenterNameInput").val();
    const presenterImageUrl = $("#presenterImageUrlInput").val();
    const gamePrize = $("#gamePrizeInput").val();
    const streamingURL = $("#streamingUrlInput").val();
    const socketURL = $("#socketUrlInput").val();

    const dataIsMissing = gameName.length == 0 || startDate.length == 0 ||
        presenterName.length == 0 || presenterImageUrl.length == 0
        || gamePrize.length == 0 || streamingURL.length == 0 || socketURL.length == 0;

    document.getElementById('btnCreateGame').disabled = dataIsMissing;
}

function createGame() {

    const gameName = $("#gameNameInput").val();
    const startDate = $("#startDateInput").val();
    const presenterName = $("#presenterNameInput").val();
    const presenterImageUrl = $("#presenterImageUrlInput").val();
    const gamePrize = $("#gamePrizeInput").val();
    const streamingURL = $("#streamingUrlInput").val();
    const socketURL = $("#socketUrlInput").val();

    $.ajax({
        type: 'POST',
        url: '/admin/games',
        contentType: 'application/json',
        data: JSON.stringify({
            name: gameName,
            presenter: {
                name: presenterName,
                image_url: presenterImageUrl
            },
            prize: gamePrize,
            config: {
                streaming_url: streamingURL,
                socket_url: socketURL
            },
            start_date: startDate
        }),
        error: function(xhr, status, error) {
            alert(status);
        },
        success : function(data) {
            alert("Add game success");
            location.reload();
        }
    });
}
// API information
var PORT = 3000;
var HOST = `http://localhost:${PORT}`;


$(function () {
    $boardsList = $('#boards-list');
    $createBoardMenu = $('#create-board-menu');
    $personalBoards = $('#personal-boards .boards-container');
    $createBoardInput = $('#create-board-input');

    function toggleBoardsList() {
        $boardsList.toggle();
    }

    function toggleCreateBoardMenu() {
        $createBoardMenu.toggle();
    }

    function createBoard(b) {
        var $board = $('<a></a>', {
            href: `/board/${b._id}`
        })
        .append($('<div></div>', {
            class: 'board'
        })
            .append($('<h3></h3>', {
                class: 'board-name',
                text: b.name
            })));
        return $board;
    }

    function addNewBoard() {
        $.ajax({
            url: `${HOST}/board`,
            data: {
                name: $createBoardInput.val()
            },
            type: 'POST',
        }).done(function (json) {
            var $board = createBoard(json);
            $personalBoards.append($board);
        });
        $createBoardInput.val('');
    }

    function initData(data) {
        for (var i = 0; i < data.length; ++i) {
            var $board = createBoard(data[i]);
            $personalBoards.append($board);
        }
    }

    $.ajax({
        url: `${HOST}/board`,
        type: 'GET',
        dataType: 'json',
    }).done(initData);

    $('#boards-list-btn').click(toggleBoardsList);
    $('#create-board-btn').click(toggleCreateBoardMenu);
    $('#create-board-submit-btn').click(addNewBoard);
});
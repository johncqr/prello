// API information
var PORT = 3000;
var HOST = `http://localhost:${PORT}`;


$(function () {
    $boardsList = $('#boards-list');
    $createBoardMenu = $('#create-board-menu');
    $personalBoards = $('#personal-boards .boards-container');
    $personalBoardEntries = $('.board-entry-list');
    $createBoardInput = $('#create-board-input');

    function toggleBoardsList() {
        $boardsList.toggle();
    }

    function toggleCreateBoardMenu() {
        $createBoardMenu.toggle();
        if ($createBoardInput.is(':visible')) {
            $createBoardInput.focus();
        }
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

    function createBoardEntry(b) {
        var $boardEntry = $('<a></a>', {
            href: `/board/${b._id}`
        })
            .append($('<li></li>', {
                class: 'board-entry',
                text: b.name
            }));
        console.log("yes");
        return $boardEntry;
    }

    function addBoard(b) {
        var $board = createBoard(b);
        var $boardEntry = createBoardEntry(b);
        $personalBoards.append($board);
        $personalBoardEntries.append($boardEntry);
    }

    function addNewBoard() {
        if ($createBoardInput.val() !== '') {
            $.ajax({
                url: `${HOST}/board`,
                data: {
                    name: $createBoardInput.val()
                },
                type: 'POST',
            }).done(addBoard);
            $createBoardInput.val('');
        }
    }

    function initData(data) {
        for (var i = 0; i < data.length; ++i) {
            addBoard(data[i]);
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
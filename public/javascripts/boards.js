// API information
var PORT = 3000;
var HOST = `http://localhost:${PORT}`;


$(function () {
    var $userMenu = $('#user-menu');
    var $boardsList = $('#boards-list');
    var $createBoardMenu = $('#create-board-menu');
    var $personalBoards = $('#personal-boards .boards-container');
    var $personalBoardEntries = $('.board-entry-list');
    var $createBoardInput = $('#create-board-input');

    function toggleBoardsList() {
        $boardsList.toggle();
    }

    function toggleUserMenu() {
        $userMenu.toggle();
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
            class: 'board',
            'data-bid': b._id,
        })
            .append($('<h3></h3>', {
                class: 'board-name',
                text: b.name,
            }))
            .append($('<div></div>', {
                class: 'delete-btn',
                text: 'X',
            })));
        return $board;
    }

    function createBoardEntry(b) {
        var $boardEntry = $('<a></a>', {
            href: `/board/${b._id}`,
            'data-bid': b._id,
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
    
    function deleteBoard(e) {
        e.stopPropagation();
        var $board = $(this).closest('.board');
        var bid = $board.attr('data-bid');
        $.ajax({
            url: `${HOST}/board/${bid}`,
            type: 'DELETE',
        });
        $board.remove()
        $boardsList.find(`li[data-bid='${bid}']`).remove();
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

    function sendToBoardPage() {
        var bid = $(this).attr('data-bid');
        window.location.href = `/board/${bid}`;
    }

    function sendToLogOut() {
        window.location.href = '/logout';
    }

    $('#user-btn').click(toggleUserMenu);
    $('#logout-btn').click(sendToLogOut);
    $('#boards-list-btn').click(toggleBoardsList);
    $('#create-board-btn').click(toggleCreateBoardMenu);
    $('#create-board-submit-btn').click(addNewBoard);
    $('#personal-boards').on('click', '.delete-btn', deleteBoard);
    $('#personal-boards').on('click', '.board', sendToBoardPage);
    $('#boards-list').on('click', '.board-entry', sendToBoardPage);
});
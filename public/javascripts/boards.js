$(function () {
    $boardsList = $('#boards-list');
    $createBoardMenu = $('#create-board-menu');

    function toggleBoardsList() {
        $boardsList.toggle();
    }

    function toggleCreateBoardMenu() {
        $createBoardMenu.toggle();
    }

    $('#boards-list-btn').click(toggleBoardsList);
    $('#create-board-btn').click(toggleCreateBoardMenu);
});
function toggleBoardsLists() {
    var boardsList = document.getElementById("boards-list");
    boardsList.style.display = boardsList.style.display === "none" ? "block" : "none";
}

function toggleBoardMenu() {
    var boardMenu = document.getElementById("board-menu");
    boardMenu.style.display = boardMenu.style.display === "none" ? "block" : "none";
}

document.getElementById("boards-list-btn").addEventListener("click", toggleBoardsLists);
document.getElementById("board-menu-btn").addEventListener("click", toggleBoardMenu);
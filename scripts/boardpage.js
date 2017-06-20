function toggleBoardsLists() {
    var boardsList = document.getElementById("boards-list");
    boardsList.style.display = boardsList.style.display === "none" ? "block" : "none";
}

document.getElementById("boards-list-btn").addEventListener("click", toggleBoardsLists);
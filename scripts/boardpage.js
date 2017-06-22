function toggleBoardsLists() {
    var boardsList = document.getElementById('boards-list');
    boardsList.style.display = boardsList.style.display === 'none' ? 'block' : 'none'
}

function openBoardMenu() {
    var boardMenu = document.getElementById('board-menu');
    boardMenu.style.display = 'block';
}

function closeBoardMenu() {
    var boardMenu = document.getElementById('board-menu');
    boardMenu.style.display = 'none';
}

function openNewCard() {
    var newCard = document.querySelector('.modal');
    newCard.style.display = 'block';
}

function closeNewCard() {
    var newCard = document.querySelector('.modal');
    newCard.style.display = 'none';
}

document.getElementById('boards-list').style.display = 'none';
document.getElementById('board-menu').style.display = 'none';

document.querySelector('#boards-list-btn').addEventListener('click', toggleBoardsLists);
document.querySelector('#board-menu-btn').addEventListener('click', openBoardMenu);
document.querySelector('#board-menu-close-btn').addEventListener('click', closeBoardMenu);

var addLinks = document.getElementsByClassName('add-link');
document.querySelector('.modal-bg').addEventListener('click', closeNewCard);
document.querySelector('.close-new-card-btn').addEventListener('click', closeNewCard);

for (var i = 0; i < addLinks.length; ++i) {
    addLinks[i].addEventListener('click', openNewCard);
}
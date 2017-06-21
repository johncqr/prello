function toggleBoardsLists() {
    var boardsList = document.getElementById('boards-list');
    console.log(boardsList.style.display);
    boardsList.style.display = boardsList.style.display === 'none' ? 'block' : 'none'
}

function toggleBoardMenu() {
    var boardMenu = document.getElementById('board-menu');
    boardMenu.style.display = boardMenu.style.display === 'none' ? 'block' : 'none'
}

function openNewCard() {
    var newCard = document.querySelector('.modal');
    newCard.style.display = '';
}

function closeNewCard() {
    var newCard = document.querySelector('.modal');
    newCard.style.display = 'none';
}

document.getElementById('boards-list').style.display = 'none';
document.getElementById('board-menu').style.display = 'none';

document.querySelector('#boards-list-btn').addEventListener('click', toggleBoardsLists);
document.getElementById('board-menu-btn').addEventListener('click', toggleBoardMenu);
document.querySelector('.add-link').addEventListener('click', openNewCard);
document.querySelector('.modal-bg').addEventListener('click', closeNewCard);
document.querySelector('.close-new-card-btn').addEventListener('click', closeNewCard);
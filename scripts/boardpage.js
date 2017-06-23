function Label(color) {
    this.color = color;
    this.desc = '';
}

function Card(name) {
    this.name = name;
    this.desc = '';
    this.labels = [];
}

function List(name) {
    this.name = name;
    this.cards = [];
}

var data = [
    {
        name: 'List',
        cards: [
            {
                name: 'Card1',
                desc: '',
                labels: [{ color: 'green', desc: '' }, { color: 'red', desc: '' }]
            },
            {
                name: 'Card2',
                desc: 'Description for Card 2',
                labels: []
            },
            {
                name: 'Card3',
                desc: 'Description for Card 3',
                labels: [{ color: 'red', desc: 'RED LABEL'}]
            }
        ]
    },
    {
        name: 'List2',
        cards: []
    },
    {
        name: 'List3',
        cards: [
            {
                name: 'Card4',
                desc: 'Description for Card 4',
                labels: [{ color: 'purple', desc: '' }]
            }
        ]
    }
];

var LOL = document.querySelector('#lol');

function toggleBoardsLists() {
    var boardsList = document.querySelector('#boards-list');
    boardsList.style.display = boardsList.style.display === 'none' ? 'block' : 'none'
}

function openBoardMenu() {
    var boardMenu = document.querySelector('#board-menu');
    boardMenu.style.display = 'block';
}

function closeBoardMenu() {
    var boardMenu = document.querySelector('#board-menu');
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

function openListAdderForm() {
    var listAdderForm = document.querySelector('#form-list-adder-container');
    var listAdderButton = document.querySelector('#list-adder-btn');
    listAdderForm.style.display = 'block';
    listAdderButton.style.display = 'none';
}

function closeListAdderForm() {
    var listAdderForm = document.querySelector('#form-list-adder-container');
    var listAdderButton = document.querySelector('#list-adder-btn');
    listAdderForm.style.display = 'none';
    listAdderButton.style.display = 'block';
}

function initData() {
    for (var i = 0; i < data.length; ++i) {
        var listElement = createListElement(data[i]);
        LOL.insertBefore(listElement, LOL.lastElementChild);
    }
}

function createLabelSurfaceElement(la) {
    var newLabelSurfaceElement = document.createElement('li');
    newLabelSurfaceElement.className = 'card-label-surface card-label-' + la.color;
    return newLabelSurfaceElement;
}

function createCardElement(c) {
    var newCardElement = document.createElement('li');
    newCardElement.className = 'card';
    var newCardLabelListElement = document.createElement('ul');
    newCardLabelListElement.className = 'card-label-list';
    for (var i = 0; i < c.labels.length; ++i) {
        newCardLabelListElement.appendChild(createLabelSurfaceElement(c.labels[i]));
    }
    var newCardNameElement = document.createElement('p');
    newCardNameElement.className = 'card-name';
    var cardName = document.createTextNode(c.name);
    newCardNameElement.appendChild(cardName);
    newCardElement.appendChild(newCardLabelListElement);
    newCardElement.appendChild(newCardNameElement);
    return newCardElement;
}

function createListElement(l) {
    var newListElement = document.createElement('li');
    newListElement.className = 'list';
    
    var newListTopbarElement = document.createElement('div');
    newListTopbarElement.className = 'list-topbar';
    var newListNameElement = document.createElement('h4');
    newListNameElement.className = 'list-name';
    var listName = document.createTextNode(l.name);
    newListNameElement.appendChild(listName);
    newListTopbarElement.appendChild(newListNameElement);

    var newListDeleteButton = document.createElement('div');
    newListDeleteButton.className = 'btn list-delete-btn'
    var deleteButtonText = document.createTextNode('Delete');
    newListDeleteButton.appendChild(deleteButtonText)
    newListDeleteButton.addEventListener('click', deleteList);
    newListTopbarElement.appendChild(newListDeleteButton);
    var newCardListElement = document.createElement('ul');
    newCardListElement.className = 'card-list';
    for (var i = 0; i < l.cards.length; ++i) {
        newCardListElement.appendChild(createCardElement(l.cards[i]));
    }
    var newAddLink = document.createElement('p');
    newAddLink.className = 'add-link';
    var addLinkText = document.createTextNode('Add a card...');
    newAddLink.appendChild(addLinkText);
    newAddLink.addEventListener('click', openNewCard);
    newListElement.appendChild(newListTopbarElement);
    newListElement.appendChild(newCardListElement);
    newListElement.appendChild(newAddLink);
    return newListElement;
}

function createNewListFromName(name) {
    var newList = new List(name);
    data.push(newList);
    var newListElement = createListElement(newList);
    LOL.insertBefore(newListElement, LOL.lastElementChild);
}

function addNewList() {
    newListName = document.querySelector('#list-adder-input');
    if (newListName.value != '') {
        createNewListFromName(newListName.value);
        newListName.value = '';
        closeListAdderForm();
    }
}

function deleteList() {
    var listToDelete = this.parentNode.parentNode;
    var i = 1;
    while (i < LOL.childNodes.length-1 && LOL.childNodes[i] !== listToDelete) {
        ++i;
    }
    data.splice(i-1, 1);
    LOL.removeChild(listToDelete);
}

initData();

document.querySelector('#boards-list').style.display = 'none';
document.querySelector('#board-menu').style.display = 'none';
document.querySelector('#form-list-adder-container').style.display = 'none';
document.querySelector('#list-adder-btn').addEventListener('click', openListAdderForm);
document.querySelector('#list-adder-close-btn').addEventListener('click', closeListAdderForm);
document.querySelector('#boards-list-btn').addEventListener('click', toggleBoardsLists);
document.querySelector('#board-menu-btn').addEventListener('click', openBoardMenu);
document.querySelector('#board-menu-close-btn').addEventListener('click', closeBoardMenu);
document.querySelector('.modal-bg').addEventListener('click', closeNewCard);
document.querySelector('.close-new-card-btn').addEventListener('click', closeNewCard);
document.querySelector('#list-adder-submit-btn').addEventListener('click', addNewList);

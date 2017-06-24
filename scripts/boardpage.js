// Data Modeling

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
                labels: [{ color: 'red', desc: 'RED LABEL' }]
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


// used to see where to add/edit cards
var currentList;
var currentListIndex;
var currentCard;
var currentCardIndex;

// elements that get used a lot
var LOL = document.querySelector('#lol');
var newCardName = document.querySelector('#new-card-page-name');
var newCardDesc = document.querySelector('#new-card-desc');
var addLabelDesc = document.querySelector('#add-label-desc');
var cardPage = document.querySelector('#current-card-page');
var fullCardModal = document.querySelector('#card-modal');
var newListName = document.querySelector('#list-adder-input');

// menu event listeners
function closeAddLabelMenu() {
    var addLabelMenu = document.querySelector('#add-label-menu');
    addLabelMenu.style.display = 'none';
}

function toggleAddLabelMenu() {
    var addLabelMenu = document.querySelector('#add-label-menu');
    addLabelMenu.style.display = addLabelMenu.style.display === 'none' ? 'block' : 'none'
}

function toggleBoardsLists() {
    var boardsList = document.querySelector('#boards-list');
    boardsList.style.display = boardsList.style.display === 'none' ? 'block' : 'none'
}

function openBoardMenu() {
    var boardMenu = document.querySelector('#board-menu');
    boardMenu.style.right = '0';
}

function closeBoardMenu() {
    var boardMenu = document.querySelector('#board-menu');
    boardMenu.style.right = '-320px';
}

function openNewCard() {
    var newCard = document.querySelector('#new-card-modal');
    newCard.style.display = 'block';
    currentList = this.parentNode;
    currentListIndex = getDataIndexOfList(currentList);
}

function closeNewCard() {
    var newCardName = document.querySelector('#new-card-page-name');
    var newCardDesc = document.querySelector('#new-card-desc');
    var newCard = document.querySelector('#new-card-modal');
    newCard.style.display = 'none';
    newCardName.value = '';
    newCardDesc.value = '';
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

// Helper
function getDataIndexOfList(l) {
    var i = 1;
    while (i < LOL.childNodes.length - 1 && LOL.childNodes[i] !== l) {
        ++i;
    }
    return i - 1;
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
    newCardLabelListElement.className = 'card-label-surface-list';
    for (var i = 0; i < c.labels.length; ++i) {
        newCardLabelListElement.appendChild(createLabelSurfaceElement(c.labels[i]));
    }
    var newCardNameElement = document.createElement('p');
    newCardNameElement.className = 'card-name';
    var cardName = document.createTextNode(c.name);
    newCardNameElement.appendChild(cardName);
    newCardElement.appendChild(newCardLabelListElement);
    newCardElement.appendChild(newCardNameElement);
    newCardElement.addEventListener('click', openFullCard);
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
    var deleteButtonText = document.createTextNode('X');
    newListDeleteButton.appendChild(deleteButtonText)
    newListDeleteButton.addEventListener('click', deleteList);
    newListTopbarElement.appendChild(newListDeleteButton);
    var newCardListElement = document.createElement('ul');
    newCardListElement.className = 'card-list';
    for (var i = 0; i < l.cards.length; ++i) {
        newCardListElement.appendChild(createCardElement(l.cards[i]));
    }
    var newAddLink = document.createElement('p');
    newAddLink.className = 'card-add-link';
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
    if (newListName.value != '') {
        createNewListFromName(newListName.value);
        newListName.value = '';
        closeListAdderForm();
    }
}

function addNewCard() {
    if (newCardName.value != '') {
        var cardData = {
            name: newCardName.value,
            desc: newCardDesc.value,
            labels: []
        };
        data[currentListIndex].cards.push(cardData);
        console.log(data);
        var newCardElement = createCardElement(cardData);
        currentList.querySelector('.card-list').appendChild(newCardElement);
        closeNewCard();
    }
}

function deleteCard() {
    data[currentListIndex].cards.splice(currentCardIndex, 1);
    currentCard.parentNode.removeChild(currentCard);
    closeFullCard();
}

function deleteList() {
    var listToDelete = this.parentNode.parentNode;
    var indexToDelete = getDataIndexOfList(listToDelete);
    data.splice(indexToDelete, 1);
    LOL.removeChild(listToDelete);
}

function createCardLabelElement(la) {
    var cardLabelElement = document.createElement('li');
    cardLabelElement.className = 'card-label card-label-' + la.color;
    var cardLabelSpan = document.createElement('span');
    cardLabelSpan.className = 'card-label-text';
    var cardLabelText = document.createTextNode(la.desc);
    cardLabelSpan.appendChild(cardLabelText);
    cardLabelElement.appendChild(cardLabelSpan);
    return cardLabelElement;
}

function updateFullCardModalElement(c) {
    cardPage.querySelector('.card-page-name').textContent = c.name;
    cardPage.querySelector('.card-page-description').textContent = c.desc;
    var cardLabelList = cardPage.querySelector('.card-label-list');
    // clear label list
    while (cardLabelList.firstChild) {
        cardLabelList.removeChild(cardLabelList.firstChild);
    }
    // populate label list
    for (var i = 0; i < c.labels.length; ++i) {
        cardLabelList.appendChild(createCardLabelElement(c.labels[i]));
    }
}

function openFullCard() {
    var parentList = this.parentNode.parentNode;
    var parentUl = this.parentNode;
    var i = 0;
    while (i < parentUl.childNodes.length && parentUl.childNodes[i] !== this) {
        ++i;
    }
    var cardData = data[getDataIndexOfList(parentList)].cards[i];
    updateFullCardModalElement(cardData);
    fullCardModal.style.display = 'block';
    currentList = this.parentNode.parentNode;
    currentListIndex = getDataIndexOfList(currentList);
    currentCard = this;
    currentCardIndex = i;
}

function closeFullCard() {
    fullCardModal.style.display = 'none';
    closeAddLabelMenu();
}

function addNewLabel() {
    var labelData = {
        color: this.querySelector('span').textContent,
        desc: addLabelDesc.value
    }
    addLabelDesc.value = '';
    data[currentListIndex].cards[currentCardIndex].labels.push(labelData);
    currentCard.querySelector('.card-label-list').appendChild(createLabelSurfaceElement(labelData));
    document.querySelector('#current-card-page .card-label-list').appendChild(createCardLabelElement(labelData));
}

function initData() {
    for (var i = 0; i < data.length; ++i) {
        var listElement = createListElement(data[i]);
        LOL.insertBefore(listElement, LOL.lastElementChild);
    }
}

initData();

document.querySelector('#boards-list').style.display = 'none';
document.querySelector('#add-label-menu').style.display = 'none';
document.querySelector('#form-list-adder-container').style.display = 'none';
document.querySelector('#list-adder-btn').addEventListener('click', openListAdderForm);
document.querySelector('#list-adder-close-btn').addEventListener('click', closeListAdderForm);
document.querySelector('#boards-list-btn').addEventListener('click', toggleBoardsLists);
document.querySelector('#board-menu-btn').addEventListener('click', openBoardMenu);
document.querySelector('#board-menu-close-btn').addEventListener('click', closeBoardMenu);
document.querySelector('#add-label-btn').addEventListener('click', toggleAddLabelMenu);
document.querySelector('#new-card-modal-bg').addEventListener('click', closeNewCard);
document.querySelector('#close-new-card-btn').addEventListener('click', closeNewCard);
document.querySelector('#close-card-btn').addEventListener('click', closeFullCard);
document.querySelector('#card-modal-bg').addEventListener('click', closeFullCard);
document.querySelector('#list-adder-submit-btn').addEventListener('click', addNewList);
document.querySelector('#add-card-btn').addEventListener('click', addNewCard);
document.querySelector('#delete-card-btn').addEventListener('click', deleteCard);

var addLabelSelectors = document.getElementsByClassName('add-label-selector');
for (var i = 0; i < addLabelSelectors.length; ++i) {
    addLabelSelectors[i].addEventListener('click', addNewLabel);
}
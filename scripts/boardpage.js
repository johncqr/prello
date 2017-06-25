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
var $currentList;
var currentListIndex;
var $currentCard;
var currentCardIndex;

// cached selectors
var $lol = $('#lol');
var $newCardName = $('#new-card-page-name');
var $newCardDesc = $('#new-card-desc');
var $addLabelDesc = $('#add-label-desc');
var $cardPage = $('#current-card-page');
var $fullCardModal = $('#card-modal');
var $newListName = $('#list-adder-input');
var $addLabelMenu = $('#add-label-menu');
var $boardsList = $('#boards-list');
var $boardMenu = $('#board-menu');
var $newCardModal = $('#new-card-modal');
var $newCardPageName = $('#new-card-page-name');
var $newCardDesc = $('#new-card-desc');
var $formListAdderContainer = $('#form-list-adder-container');
var $listAdderBtn = $('#list-adder-btn');
var $currentCardPageLabelList = $('#current-card-page-label-list');
var $listAdder = $('#list-adder');

// menu event listeners
function closeAddLabelMenu() {
    $addLabelMenu.hide();
}

function toggleAddLabelMenu() {
    $addLabelMenu.toggle();
}

function toggleBoardsLists() {
    $boardsList.toggle();
}

function openBoardMenu() {
    $boardMenu.css('right', '0');
}

function closeBoardMenu() {
    $boardMenu.css('right', '-320px');
}

function openNewCard() {
    $newCardModal.show();
    $currentList = $(this).parent();
    currentListIndex = $currentList.index();
}

function closeNewCard() {
    $newCardModal.hide();
    $newCardPageName.val('');
    $newCardDesc.val('');
}

function openListAdderForm() {
    $formListAdderContainer.show();
    $listAdderBtn.hide();
}

function closeListAdderForm() {
    $formListAdderContainer.hide();
    $listAdderBtn.show();
}

function createLabelSurface(la) {
    var $newLabelSurface = $('<li></li>',
        { class: 'card-label-surface card-label-'+la.color });
    return $newLabelSurface;
}

function createCard(c) {
    var $newCard = $('<li></li>', { class: 'card'});
    var $newCardLabelList = $('<ul></ul>', { class: 'card-label-surface-list'});
    for (var i = 0; i < c.labels.length; ++i) {
        $newCardLabelList.append(createLabelSurface(c.labels[i]));
    }
    var $newCardName = $('<p></p>', {
        class: 'card-name',
        text: c.name
    });
    $newCard.append($newCardLabelList);
    $newCard.append($newCardName);

    $newCard.click(openFullCard);
    return $newCard;
}

function createList(l) {
    var $newList = $('<li></li>', { class: 'list' });

    $('<div></div>', { class: 'list-topbar' })
        .append($('<h4></h4>', { class: 'list-name', text: l.name }))
        .append($('<div></div>', { class: 'btn list-delete-btn', text: 'X' })
            .click(deleteList)).appendTo($newList);

    var $newCardList = $('<ul></ul>', { class: 'card-list' }).appendTo($newList);
    for (var i = 0; i < l.cards.length; ++i) {
        $newCardList.append(createCard(l.cards[i]));
    }

    $('<p></p>', { class: 'card-add-link', text: 'Add a card...' })
        .click(openNewCard)
        .appendTo($newList);
    return $newList;
}

function addNewListFromName(name) {
    var newList = new List(name);
    data.push(newList);
    var $newList = createList(newList);
    $newList.insertBefore($listAdder);
}

function addNewList() {
    if ($newListName.val() != '') {
        addNewListFromName($newListName.val());
        $newListName.val('');
        closeListAdderForm();
    }
}

function addNewCard() {
    if ($newCardName.val() != '') {
        var cardData = {
            name: $newCardName.val(),
            desc: $newCardDesc.val(),
            labels: []
        };
        data[currentListIndex].cards.push(cardData);
        var $newCard = createCard(cardData);
        $currentList.find('.card-list').append($newCard);
        closeNewCard();
    }
}

function deleteCard() {
    data[currentListIndex].cards.splice(currentCardIndex, 1);
    $currentCard.remove();
    closeFullCard();
}

function deleteList() {
    var $listToDelete = $(this).closest('.list');
    var indexToDelete = $listToDelete.index();
    data.splice(indexToDelete, 1);
    $listToDelete.remove();
}

function createCardLabel(la) {
    var $cardLabel = $('<li></li>', { class: 'card-label card-label-'+la.color })
        .append($('<span></span>', { class: 'card-label-text', text: la.desc }));
    return $cardLabel;
}

function updateFullCardModal(c) {
    $cardPage.find('.card-page-name').text(c.name);
    $cardPage.find('.card-page-description').text(c.desc);
    $cardLabelList = $cardPage.find('.card-label-list');
    $cardLabelList.empty();

    // populate label list
    for (var i = 0; i < c.labels.length; ++i) {
        $cardLabelList.append(createCardLabel(c.labels[i]));
    }
}

function openFullCard() {
    var $parentList = $(this).closest('.list');
    var cardData = data[$parentList.index()].cards[$(this).index()];
    updateFullCardModal(cardData);
    $fullCardModal.show();
    $currentList = $(this.closest('.list'));
    currentListIndex = $currentList.index();
    $currentCard = $(this);
    currentCardIndex = $(this).index();
}

function closeFullCard() {
    $fullCardModal.hide();
    closeAddLabelMenu();
}

function addNewLabel() {
    var labelData = {
        color: $(this).find('span').text(),
        desc: $addLabelDesc.val()
    }
    $addLabelDesc.val('');
    data[currentListIndex].cards[currentCardIndex].labels.push(labelData);
    $currentCard.find('.card-label-surface-list').append(createLabelSurface(labelData));
    $currentCardPageLabelList.append(createCardLabel(labelData));
}

function initData() {
    for (var i = 0; i < data.length; ++i) {
        var $list = createList(data[i]);
        $list.insertBefore($listAdder);
    }
}

initData();

$('#list-adder-btn').click(openListAdderForm);
$('#list-adder-close-btn').click(closeListAdderForm);
$('#boards-list-btn').click(toggleBoardsLists);
$('#board-menu-btn').click(openBoardMenu);
$('#board-menu-close-btn').click(closeBoardMenu);
$('#add-label-btn').click(toggleAddLabelMenu);
$('#new-card-modal-bg').click(closeNewCard);
$('#close-new-card-btn').click(closeNewCard);
$('#close-card-btn').click(closeFullCard);
$('#card-modal-bg').click(closeFullCard);
$('#list-adder-submit-btn').click(addNewList);
$('#add-card-btn').click(addNewCard);
$('#delete-card-btn').click(deleteCard);
$('.add-label-selector').click(addNewLabel);
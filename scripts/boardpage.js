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
var $newCardNameInput = $('#new-card-name-input');
var $newCardDescInput = $('#new-card-desc-input');
var $addLabelDesc = $('#add-label-desc');
var $cardPage = $('#current-card-page');
var $fullCardModal = $('#card-modal');
var $newListName = $('#list-adder-input');
var $addLabelMenu = $('#add-label-menu');
var $boardsList = $('#boards-list');
var $boardMenu = $('#board-menu');
var $newCardModal = $('#new-card-modal');
var $formListAdderContainer = $('#form-list-adder-container');
var $listAdderBtn = $('#list-adder-btn');
var $currentCardPageLabelList = $('#current-card-page-label-list');
var $listAdder = $('#list-adder');
var $listAdderInput = $('#list-adder-input');

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
    $newCardNameInput.focus();
    $currentList = $(this).parent();
    currentListIndex = $currentList.index();
}

function closeNewCard() {
    $newCardModal.hide();
    $newCardNameInput.val('');
    $newCardDescInput.val('');
}

function openListAdderForm() {
    $formListAdderContainer.show();
    $listAdderInput.focus();
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
    return $newCard;
}

function createList(l) {
    var $newList = $('<li></li>', { class: 'list' });

    $('<div></div>', { class: 'list-topbar' })
        .append($('<h4></h4>', { class: 'list-name', text: l.name }))
        .append($('<div></div>', { class: 'btn list-delete-btn', text: 'X' }))
        .appendTo($newList);

    var $newCardList = $('<ul></ul>', { class: 'card-list' }).appendTo($newList);
    for (var i = 0; i < l.cards.length; ++i) {
        $newCardList.append(createCard(l.cards[i]));
    }

    $('<p></p>', { class: 'card-add-link', text: 'Add a card...' })
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
    if ($newCardNameInput.val() != '') {
        var cardData = {
            name: $newCardNameInput.val(),
            desc: $newCardDescInput.val(),
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

function updateListName() {
    var value;
    var $this = $(this);
    var $listName = $this.next();
    if ((value = $this.val()) !== '') {
        $listName.text(value);
        $listName.show();
        $this.remove();
        data[$listName.closest('.list').index()].name = value;
    }
}

function openListNameEdit() {
    var $this = $(this);
    var $editListNameInput = $('<input>', { type: 'text', class: 'edit-list-name-input' })
        .val($this.text());
    $this.before($editListNameInput);
    $editListNameInput.focus();
    $this.hide();
}

function updateCardName() {
    var value;
    var $this = $(this);
    var $cardName = $this.next();
    if ((value = $this.val()) !== '') {
        $cardName.text(value);
        $currentCard.find('.card-name').text(value);
        $cardName.show();
        $this.remove();
        data[currentListIndex].cards[currentCardIndex].name = value;
    }
}

function openCardNameEdit() {
    var $this = $(this);
    var $editCardNameEdit = $('<input>', { type: 'text', class: 'card-page-name edit-card-name-input' })
        .val($this.text());
    $this.before($editCardNameEdit);
    $editCardNameEdit.focus();
    $this.hide();
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
$('#current-card-page-name').click(openCardNameEdit);

$listAdderInput.keypress(function(e) {
    if (e.which === 13) {
        addNewList();
    }
})
$newCardNameInput.keypress(function(e) {
    if (e.which === 13) {
        addNewCard();
    }
})

// Event delegation
$lol.on('click', '.card-add-link', openNewCard);
$lol.on('click', '.list-delete-btn', deleteList);
$lol.on('click', '.card', openFullCard);
$lol.on('click', '.list-name', openListNameEdit);
$lol.on('keypress', '.edit-list-name-input', function(e) {
    if (e.which === 13) {
        updateListName.call(this);
    }
});
$fullCardModal.on('keypress', '.edit-card-name-input', function(e) {
    if (e.which === 13) {
        updateCardName.call(this);
    }
});
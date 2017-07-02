// API information
var PORT = 3000;
var HOST = `http://localhost:${PORT}`;

// in-memory data to prevent constant API calls
var map = {};

// used to see where to add/edit cards
var $currentList;
var $currentCard;
var currentLid;
var currentCid;

$(function () {
    // cached selectors
    var $lol = $('#lol');
    var $newCardNameInput = $('#new-card-name-input');
    var $newCardDescInput = $('#new-card-desc-input');
    var $addLabelDesc = $('#add-label-desc');
    var $cardPage = $('#current-card-page');
    var $cardPageName = $('#current-card-page-name');
    var $cardPageDesc = $('#current-card-page-description');
    var $cardPageAuthor = $('#current-card-page-author');
    var $cardPageLabelList = $('#current-card-page-label-list');
    var $fullCardModal = $('#card-modal');
    var $newListName = $('#list-adder-input');
    var $addLabelMenu = $('#add-label-menu');
    var $boardsList = $('#boards-list');
    var $boardMenu = $('#board-menu');
    var $newCardModal = $('#new-card-modal');
    var $formListAdderContainer = $('#form-list-adder-container');
    var $listAdderBtn = $('#list-adder-btn');
    var $listAdder = $('#list-adder');
    var $listAdderInput = $('#list-adder-input');
    var $editCardNameInput = $('#edit-card-name-input');
    var $cardName = $('#current-card-page-name');
    var $cardDesc = $('#current-card-page-description');
    var $editDescBtn = $('#current-card-page-edit-desc-btn');
    var $editCardDescInput = $('#edit-card-desc-input');
    var $editCardDescSubmit = $('#edit-card-desc-submit-btn')
    var $commentInput = $('#comment-input');
    var $cardActivityList = $('#card-activity-list');

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
        currentLid = $currentList.attr('data-lid');
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
            { class: 'card-label-surface card-label-' + la.color });
        return $newLabelSurface;
    }

    function createCard(c, lid) {
        map[lid].cards[c._id] = { name: c.name, desc: c.desc, labels: c.labels, author: c.author, comments: c.comments };
        var $newCard = $('<li></li>', { class: 'card', 'data-lid': lid, 'data-cid': c._id });
        var $newCardLabelList = $('<ul></ul>', { class: 'card-label-surface-list' });
        if (c.labels) {
            for (var i = 0; i < c.labels.length; ++i) {
                $newCardLabelList.append(createLabelSurface(c.labels[i]));
            }
        }
        var $newCardName = $('<p></p>', {
            class: 'card-name',
            text: c.name
        });
        var $newCardAuthor = $('<div></div>', {
            class: 'card-author',
        }).append($('<span></span>', {
            class: 'card-member',
            text: c.author
        }));
        $newCard.append($newCardLabelList)
            .append($newCardName)
            .append($newCardAuthor)
            .append($('<div class="div-clearer"></div>'));
        return $newCard;
    }

    function createList(l) {
        map[l._id] = { name: l.name, cards: {} };
        var $newList = $('<li></li>', { class: 'list', 'data-lid': l._id });
        $('<div></div>', { class: 'list-topbar' })
            .append($('<h4></h4>', { class: 'list-name', text: l.name }))
            .append($('<div></div>', { class: 'btn list-delete-btn', text: 'X' }))
            .appendTo($newList);

        var $newCardList = $('<ul></ul>', { class: 'card-list' }).appendTo($newList);
        for (var i = 0; i < l.cards.length; ++i) {
            $newCardList.append(createCard(l.cards[i], l._id));
        }

        $('<p></p>', { class: 'card-add-link', text: 'Add a card...' })
            .appendTo($newList);
        return $newList;
    }

    function addNewListFromName(name) {
        var $newList;
        $.ajax({
            url: `${HOST}/list`,
            data: {
                name
            },
            type: 'POST',
            dataType: 'json',
        }).done(function (json) {
            $newList = createList(json);
            $newList.insertBefore($listAdder);
        });
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
            $.ajax({
                url: `${HOST}/list/${currentLid}/card/`,
                data: {
                    name: $newCardNameInput.val(),
                    desc: $newCardDescInput.val(),
                },
                type: 'POST',
                dataType: 'json'
            }).done(function (json) {
                var cardData = json.cards[json.cards.length - 1];
                var $newCard = createCard(cardData, currentLid);
                $currentList.find('.card-list').append($newCard);
                closeNewCard();
            });
        }
    }

    function deleteCard() {
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}`,
            type: 'DELETE'
        });
        delete map[currentLid].cards[currentCid];
        $currentCard.remove();
        closeFullCard();
    }

    function deleteList() {
        var $listToDelete = $(this).closest('.list');
        var lidToDelete = $listToDelete.attr('data-lid');
        $.ajax({
            url: `${HOST}/list/${lidToDelete}`,
            type: 'DELETE'
        });
        delete map[lidToDelete];
        $listToDelete.remove();
    }

    function createCardLabel(la) {
        var $cardLabel = $('<li></li>', { class: 'card-label card-label-' + la.color })
            .append($('<span></span>', { class: 'card-label-text', text: la.desc }));
        return $cardLabel;
    }

    function updateFullCardModal(c) {
        $cardPageName.text(c.name);
        $cardPageDesc.text(c.desc);
        $cardPageAuthor.text(c.author);
        $cardPageLabelList.empty();
        $cardActivityList.empty();

        // populate label list
        if (c.labels) {
            for (var i = 0; i < c.labels.length; ++i) {
                $cardPageLabelList.append(createCardLabel(c.labels[i]));
            }
        }

        // populate comment list
        if (c.comments) {
            for (var i = 0; i < c.comments.length; ++i) {
                $cardActivityList.prepend(createComment(c.comments[i]));
            }
        }
    }

    function openFullCard() {
        $currentCard = $(this);
        currentLid = $currentCard.attr('data-lid');
        currentCid = $currentCard.attr('data-cid');
        var cardData = map[currentLid].cards[currentCid];
        updateFullCardModal(cardData);
        $fullCardModal.show();
        $editCardNameInput.hide();
    }

    function closeFullCard() {
        if ($editCardNameInput.is(':visible')) {
            updateCardName();
        }
        if ($editCardDescSubmit.is(':visible')) {
            updateCardDesc();
        }
        $fullCardModal.hide();
        closeAddLabelMenu();
    }

    function addNewLabel() {
        var labelData = {
            color: $(this).find('span').text(),
            desc: $addLabelDesc.val()
        }
        if (!map[currentLid].cards[currentCid].labels) {
            map[currentLid].cards[currentCid].labels = [];
        }
        map[currentLid].cards[currentCid].labels.push(labelData);
        var currentCardData = map[currentLid].cards[currentCid];
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}`,
            data: {
                name: currentCardData.name,
                desc: currentCardData.desc,
                labels: currentCardData.labels,
                _id: currentCid
            },
            type: 'PATCH'
        });
        $addLabelDesc.val('');
        $currentCard.find('.card-label-surface-list').append(createLabelSurface(labelData));
        $cardPageLabelList.append(createCardLabel(labelData));
    }

    function createComment(comment) {
        var $comment =  $('<li></li>', {
            class: 'card-activity'
        })
            .append($('<p></p>', {
                class: 'card-comment-username',
                text: comment.username
            }))
            .append($('<p></p>', {
                class: 'card-comment-content',
                text: comment.content
            }))
            .append($('<p></p>', {
                class: 'card-comment-time',
                text: comment.datetimePosted
            }));
        return $comment;
    }

    function addNewComment() {
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}/comment`,
            data: {
                content: $commentInput.val()
            },
            type: 'POST'
        }).done(function (comment) {
            $commentInput.val('');
            if (!map[currentLid].cards[currentCid].comments) {
                map[currentLid].cards[currentCid].comments = [];
            }
            map[currentLid].cards[currentCid].comments.push(comment);
            $cardActivityList.prepend(createComment(comment));
        });
    }

    function updateListName() {
        var value;
        var $this = $(this);
        var lid = $this.closest('.list').attr('data-lid');
        var $listName = $this.next();
        if ((value = $this.val()) !== '') {
            map[lid].name = $this.val();
            $.ajax({
                url: `${HOST}/list/${lid}`,
                data: {
                    name: $this.val()
                },
                type: 'PATCH'
            });
            $listName.text($this.val());
        }
        $listName.show();
        $this.remove();
    }

    function openListNameEdit() {
        var $this = $(this);
        var $editListNameInput = $('<input>', { type: 'text', class: 'edit-list-name-input' })
            .val($this.text());
        $this.before($editListNameInput);
        $editListNameInput.focus().select();
        $this.hide();
    }

    function updateCardName() {
        var newName;
        if ((newName = $editCardNameInput.val()) !== '') {
            map[currentLid].cards[currentCid].name = newName;
            var currentCardData = map[currentLid].cards[currentCid];
            $.ajax({
                url: `${HOST}/list/${currentLid}/card/${currentCid}`,
                data: {
                    name: currentCardData.name,
                    desc: currentCardData.desc,
                    labels: currentCardData.labels,
                    _id: currentCid
                },
                type: 'PATCH'
            });
            $cardName.text(newName);
            $currentCard.find('.card-name').text(newName);
        }
        $cardName.show();
        $editCardNameInput.hide();
    }

    function openCardNameEdit() {
        $editCardNameInput
            .val($cardName.text())
            .show();
        $editCardNameInput.focus().select();
        $cardName.hide();
    }

    function updateCardDesc() {
        var newDesc = $editCardDescInput.val();
        map[currentLid].cards[currentCid].desc = newDesc;
        var currentCardData = map[currentLid].cards[currentCid];
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}`,
            data: {
                name: currentCardData.name,
                desc: currentCardData.desc,
                labels: currentCardData.labels,
                _id: currentCid
            },
            type: 'PATCH'
        });
        $cardDesc.text(newDesc);
        $cardDesc.show();
        $editDescBtn.show();
        $editCardDescInput.hide();
        $editCardDescSubmit.hide();
    }

    function openCardDescEdit() {
        $editCardDescInput
            .val($cardDesc.text())
            .show();
        $editCardDescSubmit.show();
        $editCardDescInput.focus().select();
        $editDescBtn.hide();
        $cardDesc.hide();
    }

    function deleteLabel() {
        var $labelToDelete = $(this);
        var labelIndex = $labelToDelete.index();
        map[currentLid].cards[currentCid].labels.splice(labelIndex, 1);
        var currentCardData = map[currentLid].cards[currentCid];
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}`,
            data: {
                name: currentCardData.name,
                desc: currentCardData.desc,
                labels: currentCardData.labels,
                _id: currentCid
            },
            type: 'PATCH'
        });
        console.log(labelIndex);
        $currentCard.find(`.card-label-surface-list li:nth-child(${labelIndex + 1})`).remove();
        $labelToDelete.remove();
    }

    function initData(data) {
        for (var i = 0; i < data.length; ++i) {
            var $list = createList(data[i]);
            $list.insertBefore($listAdder);
        }
    }

    $.ajax({
        url: `${HOST}/list`,
        type: 'GET',
        dataType: 'json',
    }).done(initData);


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
    $('#send-comment-btn').click(addNewComment);
    $cardName.click(openCardNameEdit);
    $editDescBtn.click(openCardDescEdit);
    $editCardDescSubmit.click(updateCardDesc);
    $editCardNameInput.keypress(function (e) {
        if (e.which === 13) {
            updateCardName();
        }
    });

    $listAdderInput.keypress(function (e) {
        if (e.which === 13) {
            addNewList();
        }
    })
    $newCardNameInput.keypress(function (e) {
        if (e.which === 13) {
            addNewCard();
        }
    })

    // Event delegation
    $lol.on('click', '.card-add-link', openNewCard);
    $lol.on('click', '.list-delete-btn', deleteList);
    $lol.on('click', '.card', openFullCard);
    $lol.on('click', '.list-name', openListNameEdit);
    $lol.on('keypress', '.edit-list-name-input', function (e) {
        if (e.which === 13) {
            updateListName.call(this);
        }
    });
    $fullCardModal.on('click', '.card-label', deleteLabel);
}
);
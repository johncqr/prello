// API information
var PORT = 3000;
var HOST = `http://localhost:${PORT}/board/${BID}`;

// in-memory data to prevent constant API calls
var map = {};

// socket.io
var socket = io();
socket.emit('join', { roomid: BID }); // BID passed through template

// used to see where to add/edit cards
var $currentList;
var $currentCard;
var currentLid;
var currentCid;

$(function () {
    // cached selectors
    var $userMenu = $('#user-menu');
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
    var $boardMemberList = $('#board-member-list');
    var $boardMemberAddMenu = $('#board-member-add-menu');
    var $boardMemberInput = $('#new-board-member-input');
    var $addMemberNotice = $('#add-member-notice');
    var $newCardModal = $('#new-card-modal');
    var $formListAdderContainer = $('#form-list-adder-container');
    var $listAdderBtn = $('#list-adder-btn');
    var $listAdder = $('#list-adder');
    var $listAdderInput = $('#list-adder-input');
    var $editCardNameInput = $('#edit-card-name-input');
    var $editDescBtn = $('#current-card-page-edit-desc-btn');
    var $editCardDescInput = $('#edit-card-desc-input');
    var $editCardDescSubmit = $('#edit-card-desc-submit-btn')
    var $commentInput = $('#comment-input');
    var $cardActivityList = $('#card-activity-list');

    // helper functions
    function findList(lid) {
        return $lol.find(`li[data-lid='${lid}']`);
    }

    function findCard(lid, cid) {
        return findList(lid).find(`li[data-cid='${cid}']`);
    }

    function isSpecificCardPageOpen(lid, cid) {
        return $fullCardModal.is(':visible') && currentLid === lid && currentCid === cid;
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

    // jQuery element creation
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

    function createLabelSurface(la) {
        var $newLabelSurface = $('<li></li>',
            { class: 'card-label-surface card-label-' + la.color });
        return $newLabelSurface;
    }

    function createCardLabel(la) {
        var $cardLabel = $('<li></li>', { class: 'card-label card-label-' + la.color })
            .append($('<span></span>', { class: 'card-label-text', text: la.desc }));
        return $cardLabel;
    }

    function createComment(comment) {
        var $comment = $('<li></li>', {
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
                text: Date(comment.datetimePosted)
            }));
        return $comment;
    }

    // event listeners
    
    function sendToBoardPage() {
        var bid = $(this).attr('data-bid');
        window.location.href = `/board/${bid}`;
    }

    function sendToLogOut() {
        window.location.href = '/logout';
    }

    function toggleUserMenu() {
        $userMenu.toggle();
    }

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

    function toggleBoardMemberAddMenu() {
        $boardMemberAddMenu.toggle();
    }

    function openListNameEdit() {
        var $this = $(this);
        var $editListNameInput = $('<input>', { type: 'text', class: 'edit-list-name-input' })
            .val($this.text());
        $this.before($editListNameInput);
        $editListNameInput.focus().select();
        $this.hide();
    }

    function openCardNameEdit() {
        $editCardNameInput
            .val($cardPageName.text())
            .show();
        $editCardNameInput.focus().select();
        $cardPageName.hide();
    }

    function openCardDescEdit() {
        $editCardDescInput
            .val($cardPageDesc.text())
            .show();
        $editCardDescSubmit.show();
        $editCardDescInput.focus().select();
        $editDescBtn.hide();
        $cardPageDesc.hide();
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

    // ajax calls
    function addNewListFromName(name) {
        $.ajax({
            url: `${HOST}/list`,
            data: {
                name
            },
            type: 'POST',
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
                dataType: 'json',
            });
            closeNewCard();
        }
    }

    function deleteCard() {
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}`,
            type: 'DELETE'
        });
        closeFullCard();
    }

    function deleteList() {
        var $listToDelete = $(this).closest('.list');
        var lidToDelete = $listToDelete.attr('data-lid');
        $.ajax({
            url: `${HOST}/list/${lidToDelete}`,
            type: 'DELETE'
        });
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
        var labels = map[currentLid].cards[currentCid].labels;
        if (!labels) {
            labels = [];
        }
        labels.push(labelData);
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}`,
            data: {
                labels: labels,
            },
            type: 'PATCH'
        });
        $addLabelDesc.val('');
    }

    function addNewComment() {
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}/comment`,
            data: {
                content: $commentInput.val()
            },
            type: 'POST'
        });
        $commentInput.val('');
    }

    function updateListName() {
        var value;
        var $this = $(this);
        var lid = $this.closest('.list').attr('data-lid');
        var $listName = $this.next();
        if ((value = $this.val()) !== '') {
            $.ajax({
                url: `${HOST}/list/${lid}`,
                data: {
                    name: $this.val()
                },
                type: 'PATCH'
            });
        }
        $listName.show();
        $this.remove();
    }

    function updateCardName() {
        var newName;
        if ((newName = $editCardNameInput.val()) !== '') {
            $.ajax({
                url: `${HOST}/list/${currentLid}/card/${currentCid}`,
                data: {
                    name: newName,
                },
                type: 'PATCH'
            });
        }
        $cardPageName.show();
        $editCardNameInput.hide();
    }

    function updateCardDesc() {
        var newDesc = $editCardDescInput.val();
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}`,
            data: {
                desc: newDesc,
            },
            type: 'PATCH'
        });
        $cardPageDesc.show();
        $editDescBtn.show();
        $editCardDescInput.hide();
        $editCardDescSubmit.hide();
    }

    function deleteLabel() {
        var $labelToDelete = $(this);
        var labelIndex = $labelToDelete.index();
        var labels = map[currentLid].cards[currentCid].labels;
        labels.splice(labelIndex, 1);
        if (labels.length === 0) {
            labels = 0;
        }
        $.ajax({
            url: `${HOST}/list/${currentLid}/card/${currentCid}`,
            data: {
                labels: labels,
            },
            type: 'PATCH'
        });
    }

    function addBoardMember() {
        if ($boardMemberInput.val()) {
            $.ajax({
                url: `${HOST}/member`,
                data: {
                    username: $boardMemberInput.val()
                },
                type: 'POST',
                dataType: 'json',
            }).done(function (json) {
                $boardMemberInput.val('');
                $addMemberNotice.text(json.statusMsg);
            });
        } else {
            $addMemberNotice.text('Blank username!')
        }
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

    // socket.io events

    socket.on('newBoardMember', function (data) {
        $boardMemberList.append($('<li></li>', {
            class: 'card-member',
            text: data.username,
        }));
    });

    socket.on('newList', function (data) {
        $newList = createList(data);
        $newList.insertBefore($listAdder);
    });

    socket.on('deleteList', function (data) {
        delete map[data.lid];
        findList(data.lid).remove();
    });

    socket.on('editList', function (data) {
        map[data.lid] = data.name;
        findList(data.lid).find('.list-name').text(data.name);
    });

    socket.on('newCard', function (data) {
        var $newCard = createCard(data.cardData, data.lid);
        findList(data.lid).find('.card-list').append($newCard);
    });

    socket.on('deleteCard', function (data) {
        delete map[data.lid].cards[data.cid];
        if (isSpecificCardPageOpen(data.lid, data.cid)) {
            $fullCardModal.hide();
        }
        findCard(data.lid, data.cid).remove();
    });

    socket.on('editCard', function (data) {
        for (var key in data.cardData) {
            map[data.lid].cards[data.cid][key] = data.cardData[key];
            $card = findCard(data.lid, data.cid);
            switch (key) {
                case 'name':
                    $card.find('.card-name').text(data.cardData.name);
                    if (isSpecificCardPageOpen(data.lid, data.cid)) {
                        $cardPageName.text(data.cardData.name);
                    }
                    break;
                case 'desc':
                    if (isSpecificCardPageOpen(data.lid, data.cid)) {
                        $cardPageDesc.text(data.cardData.desc);
                    }
                    break;
                case 'labels':
                    if (data.cardData.labels == 0) {
                        map[data.lid].cards[data.cid].labels = [];
                        data.cardData.labels = [];
                    }
                    var $surfaceLabelList = $card.find('.card-label-surface-list');
                    $surfaceLabelList.empty();
                    data.cardData.labels.forEach(function (la) {
                        $surfaceLabelList.append(createLabelSurface(la));
                    });
                    if (isSpecificCardPageOpen(data.lid, data.cid)) {
                        $cardPageLabelList.empty();
                        data.cardData.labels.forEach(function (la) {
                            $cardPageLabelList.append(createCardLabel(la));
                        });
                    }
                    break;
            }
        }
    });

    socket.on('newComment', function (data) {
        if (!map[currentLid].cards[currentCid].comments) {
            map[currentLid].cards[currentCid].comments = [];
        }
        map[data.lid].cards[data.cid].comments.push(data.commentData);
        if (isSpecificCardPageOpen(data.lid, data.cid)) {
            $cardActivityList.prepend(createComment(data.commentData));
        }
    });

    $('#user-btn').click(toggleUserMenu);
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
    $('#board-member-add-menu-btn').click(toggleBoardMemberAddMenu);
    $('#add-board-member-btn').click(addBoardMember);
    $('#logout-btn').click(sendToLogOut);
    $cardPageName.click(openCardNameEdit);
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
    $boardsList.on('click', '.board-entry', sendToBoardPage);
});
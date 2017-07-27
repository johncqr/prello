import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

// API information
var PORT = 3000;
var HOST = `http://localhost:${PORT}/board/${BID}`;

// in-memory data to prevent constant API calls
var map = {};

// socket.io
var socket = io();
socket.emit('join', { roomid: BID }); // BID passed through template

// used to see where to add/edit cards
var currentLid;
var currentCid;

$(function () {
    // cached selectors
    var $userMenu = $('#user-menu');
    var $lol = $('lol');
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
    var $editCardNameInput = $('#edit-card-name-input');
    var $editDescBtn = $('#current-card-page-edit-desc-btn');
    var $editCardDescInput = $('#edit-card-desc-input');
    var $editCardDescSubmit = $('#edit-card-desc-submit-btn')
    var $commentInput = $('#comment-input');
    var $cardActivityList = $('#card-activity-list');

    // helper functions
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
    }

    function closeNewCard() {
        $newCardModal.hide();
        $newCardNameInput.val('');
        $newCardDescInput.val('');
    }

    // ajax calls
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

    // socket.io events

    socket.on('newBoardMember', function (data) {
        $boardMemberList.append($('<li></li>', {
            class: 'card-member',
            text: data.username,
        }));
    });


    class Card extends React.Component {
        renderLabel(la) {
            return (
                <li className={"card-label-surface card-label-" + la.color}>
                </li>
            );
        }

        render() {
            let surfaceLabels = this.props.labels.map(this.renderLabel);
            return (
                <li className="card" data-lid={this.props.lid} data-cid={this.props.cid} onClick={this.props.onClick}>
                    <ul className="card-label-surface-list">
                        {surfaceLabels}
                    </ul>
                    <p className="card-name">{this.props.name}</p>
                    <div className="card-author">
                        <span className="card-member">{this.props.author}</span>
                    </div>
                    <div className="div-clearer"></div>
                </li>
            );
        }
    }

    class List extends React.Component {
        constructor() {
            super();
            this.state = {
                listNameEditOpen: false,
            }
        }

        toggleListNameEditOpen() {
            this.setState({ listNameEditOpen: !this.state.listNameEditOpen });
        }

        handleClickCardAddLink() {
            currentLid = this.props.lid;
            openNewCard();
        }

        handleKeypress(e) {
            if (e.which === 13 && e.target.value !== '') {
                this.props.onListNameChange(this.props.lid, e.target.value);
                this.toggleListNameEditOpen();
            }
        }

        render() {
            let cards = this.props.cards.map((c) => {
                return <Card key={c._id} lid={this.props.lid} cid={c._id} onClick={() => this.props.onOpenCard(this.props.lid, c._id)} labels={c.labels} name={c.name} author={c.author} />;
            });

            return (
                <li className="list" data-lid={this.props.lid}>
                    <div className="list-topbar">
                        { !this.state.listNameEditOpen && <h4 className="list-name" onClick={this.toggleListNameEditOpen.bind(this)}>{this.props.name}</h4>}
                        { this.state.listNameEditOpen &&
                            <input type="text" className="edit-list-name-input" onKeyPress={this.handleKeypress.bind(this)} defaultValue={this.props.name} />
                        }
                        <div className="btn list-delete-btn" onClick={() => this.props.onDeleteList(this.props.lid)}>X</div>
                        <ul className="card-list">
                            {cards}
                        </ul>
                        <p className="card-add-link" onClick={this.handleClickCardAddLink.bind(this)}>Add a card...</p>
                    </div>
                </li>
            );
        }
    }

    class ListAdder extends React.Component {
        constructor() {
            super();
            this.state = {
                open: false,
                name: '',
            }
        }

        handleListAdderToggle() {
            this.setState({ open: !this.state.open });
        }

        handleSaveList() {
            if (this.state.name !== '') {
                this.props.onAddList(this.state.name);
                this.setState({ open: false, val: '' });
            }
        }

        handleChange(e) {
            this.setState({ name: e.target.value });
        }

        render() {
            return (
                <li id="list-adder" className="list">
                    {!this.state.open && <div id="list-adder-btn" className="btn" onClick={() => this.handleListAdderToggle()}>Add a list...</div>}
                    {this.state.open &&
                        <div id="form-list-adder-container">
                            <input id="list-adder-input" onChange={this.handleChange.bind(this)} placeholder="Add a list..." />
                            <div id="list-adder-submit-btn" className="btn" onClick= {() => this.handleSaveList()}>Save</div>
                            <div id="list-adder-close-btn" className="btn" onClick={() => this.handleListAdderToggle()}>X</div>
                        </div>
                    }
                </li>
            );
        }

    }

    class Board extends React.Component {
        constructor() {
            super();
            this.state = {
                data: [],
            }
        }

        componentDidMount() {
            $.ajax({
                url: `${HOST}/list`,
                type: 'GET',
                dataType: 'json',
            }).done((json) => {
                this.setState({
                    data: json,
                });
            });

            socket.on('deleteList', (data) => {
                let newData = this.state.data.slice();
                newData.splice(this._findIndexOfList(data.lid), 1);
                this.setState({
                    data: newData,
                });
            });

            socket.on('newList', (data) => {
                let newData = this.state.data.slice();
                newData.push(data);
                this.setState({
                    data: newData,
                });
            });

            socket.on('editList', (data) => {
                let newData = this.state.data.slice();
                newData[this._findIndexOfList(data.lid)].name = data.name;
                this.setState({
                    data: newData,
                });
            });

            socket.on('newCard', (data) => {
                let newData = this.state.data.slice();
                newData[this._findIndexOfList(data.lid)].cards.push(data.cardData);
                this.setState({
                    data: newData,
                });
            });
            
            socket.on('deleteCard', (data) => {
                let newData = this.state.data.slice();
                let listIndex = this._findIndexOfList(data.lid);
                let cardIndex = this._findIndexOfCard(listIndex, data.cid);
                newData[listIndex].cards.splice(cardIndex, 1);
                this.setState({
                    data: newData,
                });
            });

            socket.on('newComment', (data) => {
                let newData = this.state.data.slice();
                let listIndex = this._findIndexOfList(data.lid);
                let cardIndex = this._findIndexOfCard(listIndex, data.cid);
                if (!newData[listIndex].cards[cardIndex].comments) {
                    newData[listIndex].cards[cardIndex].comments = [];
                }
                newData[listIndex].cards[cardIndex].comments.push(data.commentData);
                this.setState({
                    data: newData,
                });
                if (isSpecificCardPageOpen(data.lid, data.cid)) {
                    $cardActivityList.prepend(createComment(data.commentData));
                }
            });

            socket.on('editCard', (data) => {
                let newData = this.state.data.slice();
                let listIndex = this._findIndexOfList(data.lid);
                let cardIndex = this._findIndexOfCard(listIndex, data.cid);
                for (var key in data.cardData) {
                    newData[listIndex].cards[cardIndex][key] = data.cardData[key];
                    switch (key) {
                        case 'name':
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
                                newData[listIndex].cards[cardIndex][key] = data.cardData[key];
                                data.cardData.labels = [];
                            }
                            if (isSpecificCardPageOpen(data.lid, data.cid)) {
                                $cardPageLabelList.empty();
                                data.cardData.labels.forEach(function (la) {
                                    $cardPageLabelList.append(createCardLabel(la));
                                });
                            }
                            break;
                    }
                }
                this.setState({
                    data: newData,
                });
            });

        }

        _findIndexOfList(lid) {
            return this.state.data.findIndex((l) => lid === l._id);
        }

        _findIndexOfCard(listIndex, cid) {
            return this.state.data[listIndex].cards.findIndex((c) => cid === c._id);
        }

        handleAddList(name) {
            $.ajax({
                url: `${HOST}/list`,
                data: {
                    name
                },
                type: 'POST',
            });
        }

        handleListNameChange(lid, name) {
            $.ajax({
                url: `${HOST}/list/${lid}`,
                data: {
                    name: name,
                },
                type: 'PATCH'
            });
        }

        handleDeleteList(lid) {
            $.ajax({
                url: `${HOST}/list/${lid}`,
                type: 'DELETE'
            });
        }

        handleOpenCard(lid, cid) {
            currentLid = lid;
            currentCid = cid;
            var listData = this.state.data.find((l) => l._id === lid);
            var cardData = listData.cards.find((c) => c._id === cid);
            updateFullCardModal(cardData);
            $fullCardModal.show();
            $editCardNameInput.hide();
        }

        render() {
            let lists = this.state.data.map((l) => {
                return <List key={l._id} lid={l._id} name={l.name} cards={l.cards}
                             onOpenCard={this.handleOpenCard.bind(this)}
                             onDeleteList={this.handleDeleteList.bind(this)}
                             onListNameChange={this.handleListNameChange.bind(this)} />
            });
            return (
                <ul id="lol">
                    {lists}
                    <ListAdder onAddList={(name) => this.handleAddList(name)}/>
                </ul>
            );
        }
    }

    $('#user-btn').click(toggleUserMenu);
    $('#boards-list-btn').click(toggleBoardsLists);
    $('#board-menu-btn').click(openBoardMenu);
    $('#board-menu-close-btn').click(closeBoardMenu);
    $('#add-label-btn').click(toggleAddLabelMenu);
    $('#new-card-modal-bg').click(closeNewCard);
    $('#close-new-card-btn').click(closeNewCard);
    $('#close-card-btn').click(closeFullCard);
    $('#card-modal-bg').click(closeFullCard);
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

    // Event delegation
    $fullCardModal.on('click', '.card-label', deleteLabel);
    $boardsList.on('click', '.board-entry', sendToBoardPage);

    ReactDOM.render(<Board />, document.getElementById('board-data'));
});
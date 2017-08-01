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

    class CardComment extends React.Component {
        render() {
            return (
                <li className="card-activity">
                    <p className="card-comment-username">
                        {this.props.username}
                    </p>
                    <p className="card-comment-content">
                        {this.props.content}
                    </p>
                    <p className="card-comment-time">
                        {this.props.datetimePosted}
                    </p>
                </li>
            );
        }
    }

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
                        {!this.state.listNameEditOpen && <h4 className="list-name" onClick={this.toggleListNameEditOpen.bind(this)}>{this.props.name}</h4>}
                        {this.state.listNameEditOpen &&
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
                            <div id="list-adder-submit-btn" className="btn" onClick={() => this.handleSaveList()}>Save</div>
                            <div id="list-adder-close-btn" className="btn" onClick={() => this.handleListAdderToggle()}>X</div>
                        </div>
                    }
                </li>
            );
        }

    }

    class InfoModal extends React.Component {
        constructor(props) {
            super();
            this.state = {
                commentContent: '',
                desc: props.desc,
                cardNameEditOpen: false,
                cardDescEditOpen: false,
                cardLabelMenuOpen: false,
            }
        }
        
        handleClose() {
            this.setState({
                cardNameEditOpen: false,
                cardDescEditOpen: false,
                cardLabelMenuOpen: false,
            });
            this.props.onClose();
        }

        handleCommentChange(e) {
            this.setState({ commentContent: e.target.value });
        }

        handleNameKeypress(e) {
            if (e.which === 13 && e.target.value !== '') {
                this.props.onCardNameChange(e.target.value);
                this.setState({ cardNameEditOpen: false });
            }
        }

        handleDescEditChange(e) {
            this.setState({ desc: e.target.value });
        }

        handleDescEditOpen() {
            this.setState({ cardDescEditOpen: true });
        }

        handleDescEditSubmit() {
            this.props.onCardDescChange(this.state.desc);
            this.setState({ cardDescEditOpen: false });
        }

        handleNameClick() {
            this.setState({ cardNameEditOpen: true });
        }

        handleSendComment() {
            this.props.onComment(this.state.commentContent);
            this.setState({ commentContent: '' });
        }

        render() {
            let comments = this.props.comments.map((c) => {
                return <CardComment username={c.username} content={c.content} datetimePosted={c.datetimePosted} />
            });

            return (
                <div id="card-modal" className="modal">
                    <div id="current-card-page" className="card-page">
                        <div className="card-page-topbar">
                            <div className="card-page-topbar-left">
                                { !this.state.cardNameEditOpen &&
                                <h3 id="current-card-page-name" className="card-page-name" onClick={this.handleNameClick.bind(this)}>
                                    {this.props.name}
                                </h3>
                                }
                                { this.state.cardNameEditOpen &&
                                <input type="text" id="edit-card-name-input" defaultValue={this.props.name} onKeyPress={this.handleNameKeypress.bind(this)} className="card-page-name" />
                                }
                            </div>
                            <div className="card-page-topbar-right">
                                <div id="close-card-btn" className="btn" onClick={this.handleClose.bind(this)}>X</div>
                            </div>
                        </div>
                        <div className="flex-container">
                            <div className="card-info">
                                <p className="card-section-name">Author</p>
                                <span id="current-card-page-author" className="card-member">
                                    {this.props.author}
                                </span>
                                <p className="card-section-name">Description</p>
                                { !this.state.cardDescEditOpen &&
                                <div>
                                    <p id="current-card-page-description" className="card-page-description" value={this.state.desc} onChange={this.handleDescEditChange.bind(this)}>
                                        {this.props.desc}
                                    </p>
                                    <div id="current-card-page-edit-desc-btn" className="btn" onClick={this.handleDescEditOpen.bind(this)}>Edit description...</div>
                                </div>
                                }
                                { this.state.cardDescEditOpen &&
                                <div>
                                    <textarea id="edit-card-desc-input" rows="3" cols="35" value={this.state.desc} onChange={this.handleDescEditChange.bind(this)} />
                                    <div id="edit-card-desc-submit-btn" className="btn" onClick={this.handleDescEditSubmit.bind(this)}>Submit</div>
                                </div>
                                }
                                <p className="card-section-name">Labels</p>
                                <ul id="current-card-page-label-list" className="card-label-list">
                                </ul>
                                <p className="card-section-name">Members</p>
                                <ul className="card-member-list">
                                </ul>
                                <p className="card-section-name">Add Comment</p>
                                <textarea id="comment-input" value={this.state.commentContent} onChange={this.handleCommentChange.bind(this)} rows="3" cols="35" />
                                <div id="send-comment-btn" className="btn" onClick={this.handleSendComment.bind(this)}>Send</div>
                                <p className="card-section-name">Activity</p>
                                <ul id="card-activity-list">
                                    {comments}
                                </ul>
                            </div>
                            <div className="card-options">
                                <p className="card-section-name">Add</p>
                                <ul className="card-option-list">
                                    <li className="btn">Members</li>
                                    <li id="add-label-btn" className="btn">Labels</li>
                                    { this.state.cardLabelMenuOpen &&
                                    <div id="add-label-menu">
                                        <input id="add-label-desc" placeholder="Enter label description..." />
                                        <ul id="add-label-list">
                                            <li className="add-label-selector card-label-green"><span className="card-label-text">green</span></li>
                                            <li className="add-label-selector card-label-yellow"><span className="card-label-text">yellow</span></li>
                                            <li className="add-label-selector card-label-orange"><span className="card-label-text">orange</span></li>
                                            <li className="add-label-selector card-label-red"><span className="card-label-text">red</span></li>
                                            <li className="add-label-selector card-label-purple"><span className="card-label-text">purple</span></li>
                                            <li className="add-label-selector card-label-blue"><span className="card-label-text">blue</span></li>
                                        </ul>
                                    </div>
                                    }
                                </ul>
                                <p className="card-section-name">Options</p>
                                <ul className="card-option-list">
                                    <li id="delete-card-btn" className="btn" onClick={this.props.onDelete}>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div id="card-modal-bg" className="modal-bg"></div>
                </div >
            );
        }
    }

    class Board extends React.Component {
        constructor() {
            super();
            this.state = {
                data: [],
                cardModalOpen: false,
                currentLid,
                currentCid,
            }
        }
        // TODO: re-add all card functions with state

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
            });

            socket.on('editCard', (data) => {
                let newData = this.state.data.slice();
                let listIndex = this._findIndexOfList(data.lid);
                let cardIndex = this._findIndexOfCard(listIndex, data.cid);
                for (var key in data.cardData) {
                    newData[listIndex].cards[cardIndex][key] = data.cardData[key];
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

        _findCardData(lid, cid) {
            let listIndex = this._findIndexOfList(lid);
            let cardIndex = this._findIndexOfCard(listIndex, cid);
            return this.state.data[listIndex].cards[cardIndex];
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
            this.setState({
                cardModalOpen: true,
                currentLid: lid,
                currentCid: cid,
            });
        }

        handleCloseCard() {
            this.setState({
                cardModalOpen: false,
            });
        }

        handleDeleteCard() {
            $.ajax({
                url: `${HOST}/list/${this.state.currentLid}/card/${this.state.currentCid}`,
                type: 'DELETE',
            });
            this.handleCloseCard();
        }

        handleNewComment(content) {
            $.ajax({
                url: `${HOST}/list/${this.state.currentLid}/card/${this.state.currentCid}/comment`,
                data: {
                    content: content
                },
                type: 'POST',
            });
        }

        handleCardNameChange(name) {
            $.ajax({
                url: `${HOST}/list/${this.state.currentLid}/card/${this.state.currentCid}`,
                data: {
                    name: name,
                },
                type: 'PATCH',
            });
        }

        handleCardDescChange(desc) {
            $.ajax({
                url: `${HOST}/list/${this.state.currentLid}/card/${this.state.currentCid}`,
                data: {
                    desc: desc,
                },
                type: 'PATCH'
            });
        }

        render() {
            let lists = this.state.data.map((l) => {
                return <List key={l._id} lid={l._id} name={l.name} cards={l.cards}
                    onOpenCard={this.handleOpenCard.bind(this)}
                    onDeleteList={this.handleDeleteList.bind(this)}
                    onListNameChange={this.handleListNameChange.bind(this)} />
            });

            let cardData;
            if (this.state.cardModalOpen) {
                cardData = this._findCardData(this.state.currentLid, this.state.currentCid);
            }

            return (
                <div>
                <ul id="lol">
                    {lists}
                    <ListAdder onAddList={(name) => this.handleAddList(name)} />
                </ul>
                { this.state.cardModalOpen &&
                    <InfoModal
                    name={cardData.name}
                    author={cardData.author}
                    desc={cardData.desc}
                    comments={cardData.comments}
                    onClose={this.handleCloseCard.bind(this)}
                    onDelete={this.handleDeleteCard.bind(this)}
                    onComment={this.handleNewComment.bind(this)}
                    onCardNameChange={this.handleCardNameChange.bind(this)}
                    onCardDescChange={this.handleCardDescChange.bind(this)}
                    />
                }
                </div>
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
    $('#add-card-btn').click(addNewCard);
    $('.add-label-selector').click(addNewLabel);
    $('#board-member-add-menu-btn').click(toggleBoardMemberAddMenu);
    $('#add-board-member-btn').click(addBoardMember);
    $('#logout-btn').click(sendToLogOut);

    // Event delegation
    $fullCardModal.on('click', '.card-label', deleteLabel);
    $boardsList.on('click', '.board-entry', sendToBoardPage);

    ReactDOM.render(<Board />, document.getElementById('board-data'));
});
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

// API information
var PORT = 3000;
var BASE = `http://localhost:${PORT}`
var HOST = `http://localhost:${PORT}/board/${BID}`;

// socket.io
var socket = io();
socket.emit('join', { roomid: BID }); // BID passed through template

$(function () {
    // jQuery element creation
    function createLabelSurface(la) {
        var $newLabelSurface = $('<li></li>',
            { class: 'card-label-surface card-label-' + la.color });
        return $newLabelSurface;
    }

    // function deleteLabel() {
    //     var $labelToDelete = $(this);
    //     var labelIndex = $labelToDelete.index();
    //     var labels = map[currentLid].cards[currentCid].labels;
    //     labels.splice(labelIndex, 1);
    //     if (labels.length === 0) {
    //         labels = 0;
    //     }
    //     $.ajax({
    //         url: `${HOST}/list/${currentLid}/card/${currentCid}`,
    //         data: {
    //             labels: labels,
    //         },
    //         type: 'PATCH'
    //     });
    // }

    // socket.io events

    class BoardToolbar extends React.Component {
        constructor() {
            super();
            this.state = {
                boardMenuOpen: false,
                addMemberMenuOpen: false,
                newMemberInput: '',
            }
        }

        renderMember(m) {
            return (
                <li className="card-member">
                    {m}
                </li>
            );
        }

        toggleBoardMenu() {
            this.setState(prevState => {
                return { boardMenuOpen: !prevState.boardMenuOpen, }
            });
        }

        toggleAddMemberMenu() {
            this.setState(prevState => {
                return { addMemberMenuOpen: !prevState.addMemberMenuOpen, }
            });
        }

        handleNewMemberInputChange(e) {
            this.setState({ newMemberInput: e.target.value });
        }

        handleNewMemberSubmit() {
            this.props.onNewMember(this.state.newMemberInput);
            this.setState({ newMemberInput: '' });
        }
        
        render() {
            let members = this.props.members.map((m) => {
                return this.renderMember(m);
            });

            return (
                <div className="board-toolbar">
                    <div className="board-toolbar-left">
                        <h2 className="board-name">
                            {this.props.name}
                        </h2>
                    </div>
                    <div className="board-toolbar-right">
                        {!this.state.boardMenuOpen &&
                            <div id="board-menu-btn" onClick={this.toggleBoardMenu.bind(this)}>Show Menu</div>
                        }
                        {this.state.boardMenuOpen &&
                            <div>
                                <div id="board-menu">
                                    <div className="board-menu-section">
                                        <span className="board-menu-title-text">Menu</span>
                                        <span id="board-menu-close-btn" onClick={this.toggleBoardMenu.bind(this)}>X</span>
                                    </div>
                                    <div className="board-menu-section">
                                        <ul id="board-member-list">
                                            {members}
                                        </ul>
                                        <div id="board-member-add-menu-btn" className="btn" onClick={this.toggleAddMemberMenu.bind(this)}>Add Members...</div>
                                        { this.state.addMemberMenuOpen && 
                                        <div id="board-member-add-menu">
                                            <input id="new-board-member-input" value={this.state.newMemberInput} onChange={this.handleNewMemberInputChange.bind(this)} placeholder="Member username..." />
                                            <div id="add-board-member-btn" className="btn" onClick={this.handleNewMemberSubmit.bind(this)}>Add</div>
                                            <div id="add-member-notice"></div>
                                        </div>
                                        }
                                    </div>
                                    <div className="board-menu-section">
                                        <ul className="board-menu-option-list">
                                            <li className="board-menu-option">Change Background</li>
                                            <li className="board-menu-option">Filter Cards</li>
                                            <li className="board-menu-option">Power Ups</li>
                                            <li className="board-menu-option">Stickers</li>
                                        </ul>
                                    </div>
                                    <div className="board-menu-section">
                                        <p className="board-menu-section-name">Activity</p>
                                        <ul className="board-menu-activity-list">
                                            <li className="board-menu-activity">
                                                <span className="board-menu-activity-username">User</span> did activity.
                                    <p className="board-menu-activity-time">2 hours ago</p>
                                            </li>
                                            <li className="board-menu-activity">
                                                <span className="board-menu-activity-username">User</span> did activity.
                                    <p className="board-menu-activity-time">3 hours ago</p>
                                            </li>
                                            <li className="board-menu-activity">
                                                <span className="board-menu-activity-username">User</span> did activity.
                                    <p className="board-menu-activity-time">3 hours ago</p>
                                            </li>
                                            <li className="board-menu-activity">
                                                <span className="board-menu-activity-username">User</span> did activity.
                                    <p className="board-menu-activity-time">3 hours ago</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="div-clearer"></div>
                            </div>
                        }
                    </div>
                </div>
            );
        }
    }

    class Navbar extends React.Component {
        constructor() {
            super();
            this.state = {
                boardsListOpen: false,
                userMenuOpen: false,
            }
        }

        sendToBoardPage(bid) {
            window.location.href = `/board/${bid}`;
        }

        toggleBoardsList() {
            this.setState({
                boardsListOpen: !this.state.boardsListOpen,
            });
        }
        
        toggleUserMenu() {
            this.setState({
                userMenuOpen: !this.state.userMenuOpen,
            });
        }

        handleLogOut() {
            window.location.href = '/logout';
        }

        renderBoardEntry(boardData) {
            return (
                <li className="board-entry" key={boardData._id} data-bid={boardData._id}
                    onClick={() => this.sendToBoardPage(boardData._id)}
                >
                    {boardData.name}
                </li>
            );
        }

        render() {
            let boardEntries = this.props.boards.map((b) => {
                return this.renderBoardEntry(b);
            });

            return (
                <div className="navbar">
                    <div className="navbar-left">
                        <div id="boards-list-btn" className="navbar-btn" onClick={this.toggleBoardsList.bind(this)}>Boards</div>
                        {this.state.boardsListOpen &&
                            <div id="boards-list">
                                <div className="boards-list-sep"><span className="boards-list-sep-name">Personal Boards</span></div>
                                <ul className="board-entry-list">
                                    {boardEntries}
                                </ul>
                            </div>
                        }
                    </div>
                    <div className="navbar-mid">
                        <p id="logo"><a href="/">Prello</a></p>
                    </div>
                    <div className="navbar-right">
                        <div id="user-btn" className="navbar-btn" onClick={this.toggleUserMenu.bind(this)}>{USERNAME}</div>
                        {this.state.userMenuOpen &&
                            <div id="user-menu">
                                <div id="logout-btn" onClick={this.handleLogOut.bind(this)} className="btn">Log Out</div>
                            </div>
                        }
                    </div>
                </div >
            );

        }
    }

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
            this.props.onOpenCardAdder(this.props.lid);
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

    class NewModal extends React.Component {
        constructor() {
            super();
            this.state = {
                name: '',
                desc: '',
            }
        }

        handleNameChange(e) {
            this.setState({ name: e.target.value });
        }

        handleDescChange(e) {
            this.setState({ desc: e.target.value });
        }

        handleSubmit() {
            this.props.onAddCard(this.state);
        }

        render() {
            return (
                <div id="new-card-modal" className="modal">
                    <div id="new-card-page" className="card-page">
                        <div className="card-page-topbar">
                            <div className="card-page-topbar-left">
                                <input id="new-card-name-input" value={this.state.name} onChange={this.handleNameChange.bind(this)} className="card-page-name" type="text" placeholder="Enter card name..." required />
                            </div>
                            <div className="card-page-topbar-right">
                                <div id="close-new-card-btn" className="btn" onClick={this.props.onCloseNewCard}>X</div>
                            </div>
                        </div>
                        <div className="card-info">
                            <p className="card-section-name">Description</p>
                            <textarea id="new-card-desc-input" value={this.state.desc} onChange={this.handleDescChange.bind(this)} rows="3" cols="35" placeholder="Enter description..." />
                        </div>
                        <div className="div-clearer"></div>
                        <p id="add-card-btn" className="btn" onClick={this.handleSubmit.bind(this)}>Add Card</p>
                    </div>
                    <div className="modal-bg" onClick={this.props.onCloseNewCard}></div>
                </div>
            );
        }
    }

    class InfoModal extends React.Component {
        constructor(props) {
            super();
            this.state = {
                commentContent: '',
                desc: props.desc,
                labelDescInput: '',
                cardNameEditOpen: false,
                cardDescEditOpen: false,
                cardLabelMenuOpen: false,
            }
        }

        renderLabel(l) {
            return (
                <li className={'card-label card-label-'+l.color}>
                    <span className="card-label-text">{l.desc}</span>
                </li>
            );
        }

        renderLabelMaker(color) {
            return (
                <li onClick={() => this.handleAddLabel(color)} key={color} className={'add-label-selector card-label-'+color}>
                    <span className="card-label-text">
                        {color}
                    </span>
                </li>
            );
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

        toggleLabelMenu() {
            this.setState(prevState => {
                return { cardLabelMenuOpen: !prevState.cardLabelMenuOpen };
            });
        }

        handleLabelDescChange(e) {
            this.setState({ labelDescInput: e.target.value });
        }

        handleAddLabel(color) {
            this.props.onAddLabel(this.state.labelDescInput, color);
            this.setState({ labelDescInput: '' });
        }

        render() {
            let comments = this.props.comments.map((c) => {
                return <CardComment username={c.username} content={c.content} datetimePosted={c.datetimePosted} />
            });

            let labels = this.props.labels.map((l) => {
                return this.renderLabel(l);
            });

            let labelMakers = ['green', 'yellow', 'orange', 'red', 'blue', 'purple'].map((c) => {
                return this.renderLabelMaker(c);
            })

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
                                    {labels}
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
                                    <li id="add-label-btn" className="btn" onClick={this.toggleLabelMenu.bind(this)}>Labels</li>
                                    { this.state.cardLabelMenuOpen &&
                                    <div id="add-label-menu">
                                        <input id="add-label-desc" onChange={this.handleLabelDescChange.bind(this)} placeholder="Enter label description..." />
                                        <ul id="add-label-list">
                                            {labelMakers}
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
                    <div onClick={this.handleClose.bind(this)} className="modal-bg"></div>
                </div >
            );
        }
    }

    class Board extends React.Component {
        constructor() {
            super();
            this.state = {
                data: [],
                boards: [],
                boardId: '',
                boardName: '',
                boardMembers: [],
                cardModalOpen: false,
                currentLid: '',
                currentCid: '',
            }
        }

        componentDidMount() {
            $.ajax({
                url: `${HOST}/info`,
                type: 'GET',
                dataType: 'json',
            }).done((json) => {
                this.setState({
                    boardId: json._id,
                    boardName: json.name,
                    boardMembers: json.members,
                    data: json.lists,
                });
            });

            $.ajax({
                url: `${BASE}/board`,
                type: 'GET',
                dataType: 'json',
            }).done((json) => {
                this.setState({
                    boards: json,
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

            socket.on('newBoardMember', function (data) {
                let newBoardMembers = this.state.boardMembers.slice();
                newBoardMembers.push(data.username);
                this.state({ boardMembers: newBoardMembers });
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

        handleAddCard(cardData) {
            $.ajax({
                url: `${HOST}/list/${this.state.currentLid}/card/`,
                data: {
                    name: cardData.name,
                    desc: cardData.desc,
                },
                type: 'POST',
                dataType: 'json',
            });
            this.setState({ newCardModalOpen: false });
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

        handleNewMember(name) {
            $.ajax({
                url: `${HOST}/member`,
                data: {
                    username: name
                },
                type: 'POST',
                dataType: 'json',
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

        handleCloseNewCard() {
            this.setState({
                newCardModalOpen: false,
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

        handleAddLabel(desc, color) {
            var newLabels = this._findCardData(this.state.currentLid, this.state.currentCid).labels.slice();
            if (!newLabels) {
                newLabels = [];
            }
            newLabels.push({ desc, color });
            $.ajax({
                url: `${HOST}/list/${this.state.currentLid}/card/${this.state.currentCid}`,
                data: {
                    labels: newLabels,
                },
                type: 'PATCH'
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

        handleOpenCardAdder(lid) {
            this.setState({
                currentLid: lid,
                newCardModalOpen: true,
            });
        }

        render() {
            let lists = this.state.data.map((l) => {
                return <List key={l._id} lid={l._id} name={l.name} cards={l.cards}
                    onOpenCard={this.handleOpenCard.bind(this)}
                    onDeleteList={this.handleDeleteList.bind(this)}
                    onListNameChange={this.handleListNameChange.bind(this)}
                    onOpenCardAdder={this.handleOpenCardAdder.bind(this)} />
            });

            let cardData;
            if (this.state.cardModalOpen) {
                cardData = this._findCardData(this.state.currentLid, this.state.currentCid);
            }

            return (
                <div>
                    <Navbar boards={this.state.boards}/>
                    <div className="board-page">
                        <BoardToolbar members={this.state.boardMembers}
                                      name={this.state.boardName}
                                      onNewMember={this.handleNewMember.bind(this)}
                        />
                        <ul id="lol">
                            {lists}
                            <ListAdder onAddList={(name) => this.handleAddList(name)} />
                        </ul>
                    </div>
                    {this.state.cardModalOpen &&
                        <InfoModal
                            name={cardData.name}
                            author={cardData.author}
                            desc={cardData.desc}
                            labels={cardData.labels}
                            comments={cardData.comments}
                            onClose={this.handleCloseCard.bind(this)}
                            onDelete={this.handleDeleteCard.bind(this)}
                            onComment={this.handleNewComment.bind(this)}
                            onCardNameChange={this.handleCardNameChange.bind(this)}
                            onCardDescChange={this.handleCardDescChange.bind(this)}
                            onAddLabel={this.handleAddLabel.bind(this)}
                        />
                    }
                    {this.state.newCardModalOpen &&
                        <NewModal
                            onAddCard={this.handleAddCard.bind(this)}
                            onCloseNewCard={this.handleCloseNewCard.bind(this)}
                        />

                    }
                </div>
            );
        }
    }

    ReactDOM.render(<Board />, document.getElementById('app'));
});
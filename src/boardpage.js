import $ from 'jquery';
import React from 'react';

import Navbar from './components/boardpage/Navbar'
import BoardToolbar from './components/boardpage/BoardToolbar'
import List from './components/boardpage/List'
import ListAdder from './components/boardpage/ListAdder'
import InfoModal from './components/boardpage/InfoModal'
import NewModal from './components/boardpage/NewModal'

export default class BoardPage extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            boards: [],
            boardId: '',
            boardName: '',
            boardMembers: [],
            currentLid: '',
            currentCid: '',
            cardModalOpen: false,
            newCardModalOpen: false,
        }

        this.handleAddList = this.handleAddList.bind(this);
        this.handleAddCard = this.handleAddCard.bind(this);
        this.handleListNameChange = this.handleListNameChange.bind(this);
        this.handleDeleteList = this.handleDeleteList.bind(this);
        this.handleNewMember = this.handleNewMember.bind(this);
        this.handleOpenCard = this.handleOpenCard.bind(this);
        this.handleCloseCard = this.handleCloseCard.bind(this);
        this.handleCloseNewCard = this.handleCloseNewCard.bind(this);
        this.handleDeleteCard = this.handleDeleteCard.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
        this.handleCardNameChange = this.handleCardNameChange.bind(this);
        this.handleCardDescChange = this.handleCardDescChange.bind(this);
        this.handleAddLabel = this.handleAddLabel.bind(this);
        this.handleDeleteLabel = this.handleDeleteLabel.bind(this);
        this.handleOpenCardAdder = this.handleOpenCardAdder.bind(this);
    }

    componentDidMount() {
        let PORT = 3000;
        let BASE = `http://localhost:${PORT}`
        let HOST = `http://localhost:${PORT}/api/board/${this.props.bid}`;

        $.ajax({
            url: `${HOST}`,
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

        // socket.io
        let socket = io();
        socket.emit('join', { roomid: BID }); // BID passed through template
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
                if (key === 'labels' && data.cardData.labels == 0) {
                    newData[listIndex].cards[cardIndex][key] = [];
                } else {
                    newData[listIndex].cards[cardIndex][key] = data.cardData[key];
                }
            }
            this.setState({
                data: newData,
            });
        });

        socket.on('newBoardMember', (data) => {
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
        let newLabels = this._findCardData(this.state.currentLid, this.state.currentCid).labels.slice();
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

    handleDeleteLabel(id) {
        let newLabels = this._findCardData(this.state.currentLid, this.state.currentCid).labels.slice();
        newLabels.splice(newLabels.findIndex((l) => l._id === id), 1);
        if (newLabels.length === 0) {
            newLabels = 0;
        }
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
                onOpenCard={this.handleOpenCard}
                onDeleteList={this.handleDeleteList}
                onListNameChange={this.handleListNameChange}
                onOpenCardAdder={this.handleOpenCardAdder} />
        });

        let cardData;
        if (this.state.cardModalOpen) {
            cardData = this._findCardData(this.state.currentLid, this.state.currentCid);
        }

        return (
            <div>
                <Navbar
                    boards={this.state.boards}
                    username={USERNAME}
                />
                <div className="board-page">
                    <BoardToolbar members={this.state.boardMembers}
                        name={this.state.boardName}
                        onNewMember={this.handleNewMember}
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
                        onClose={this.handleCloseCard}
                        onDelete={this.handleDeleteCard}
                        onComment={this.handleNewComment}
                        onCardNameChange={this.handleCardNameChange}
                        onCardDescChange={this.handleCardDescChange}
                        onAddLabel={this.handleAddLabel}
                        onDeleteLabel={this.handleDeleteLabel}
                    />
                }
                {this.state.newCardModalOpen &&
                    <NewModal
                        onAddCard={this.handleAddCard}
                        onCloseNewCard={this.handleCloseNewCard}
                    />
                }
            </div>
        );
    }
}
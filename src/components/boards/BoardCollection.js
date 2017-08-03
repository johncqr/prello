import React from 'react';

export default class BoardCollection extends React.Component {
    constructor() {
        super();
        this.renderBoard = this.renderBoard.bind(this);
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
    }
    renderBoard(b) {
        return (
            <div key={b._id} className="board"
                onClick={() => this.sendToBoardPage(b._id)}>
                <h3 className="board-name">
                    {b.name}
                </h3>
                <div className="delete-btn"
                    onClick={(e) => this.handleDeleteBoard(e, b._id)}>X</div>
            </div>
        );
    }

    sendToBoardPage(bid) {
        window.location.href = `/board/${bid}`;
    }

    handleDeleteBoard(e, bid) {
        e.stopPropagation();
        this.props.onDeleteBoard(bid);
    }

    render() {
        let boards = this.props.boards.map(this.renderBoard);

        return (
            <div id="personal-boards" className="board-collection">
                <p className="collection-name">{this.props.name}</p>
                <div className="boards-container">
                    {boards}
                </div>
            </div>
        );
    }
}
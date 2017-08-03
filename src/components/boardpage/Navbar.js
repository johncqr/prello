import React from 'react';

export default class Navbar extends React.Component {
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
                    <div id="user-btn" className="navbar-btn" onClick={this.toggleUserMenu.bind(this)}>{this.props.username}</div>
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
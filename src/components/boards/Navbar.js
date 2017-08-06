import React from 'react';

export default class Navbar extends React.Component {
    constructor() {
        super();
        this.state = {
            boardsListOpen: false,
            userMenuOpen: false,
            addBoardMenuOpen: false,
            addBoardInput: '',
        }

        this.sendToBoardPage = this.sendToBoardPage.bind(this);
        this.toggleBoardsList = this.toggleBoardsList.bind(this);
        this.toggleUserMenu = this.toggleUserMenu.bind(this);
        this.handleAddBoardInputChange = this.handleAddBoardInputChange.bind(this);
        this.handleBoardCreateClick = this.handleBoardCreateClick.bind(this);
        this.toggleAddBoardMenu = this.toggleAddBoardMenu.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.renderBoardEntry = this.renderBoardEntry.bind(this);
    }

    sendToBoardPage(bid) {
        window.location.href = `/board/${bid}`;
    }

    toggleBoardsList() {
        this.setState(prevState => ({
             boardsListOpen: !prevState.boardsListOpen,
        }));
    }

    toggleUserMenu() {
        this.setState(prevState => ({
            userMenuOpen: !prevState.userMenuOpen,
        }));
    }

    toggleAddBoardMenu() {
        this.setState(prevState => ({
            addBoardMenuOpen: !this.state.addBoardMenuOpen,
        }));
    }

    handleAddBoardInputChange(e) {
        this.setState({ addBoardInput: e.target.value });
    }

    handleBoardCreateClick() {
        this.props.onCreateBoard(this.state.addBoardInput);
        this.setState({ addBoardInput: '' });
    }

    handleLogOut() {
        this.props.onLogout();
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
                    <div id="boards-list-btn" className="navbar-btn"
                         onClick={this.toggleBoardsList}
                    >
                        Boards
                    </div>
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
                    <div id="create-board-btn" className="navbar-btn"
                         onClick={this.toggleAddBoardMenu}
                    >+</div>
                    <div id="user-btn" className="navbar-btn" onClick={this.toggleUserMenu}>
                        {this.props.username}
                    </div>
                    {this.state.userMenuOpen &&
                        <div id="user-menu">
                            <div id="logout-btn" onClick={this.handleLogOut} className="btn">Log Out</div>
                        </div>
                    }
                    {this.state.addBoardMenuOpen &&
                        <div id="create-board-menu">
                            <label>Title</label>
                            <input id="create-board-input" placeholder="Enter board name..."
                                value={this.state.addBoardInput}
                                onChange={this.handleAddBoardInputChange}
                            />
                            <div id="create-board-submit-btn" className="btn"
                                onClick={this.handleBoardCreateClick}
                            >
                               Create
                            </div>
                        </div>
                    }
                </div>
            </div >
        );

    }
}
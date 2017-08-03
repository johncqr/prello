import React from 'react';

export default class BoardToolbar extends React.Component {
    constructor() {
        super();
        this.state = {
            boardMenuOpen: false,
            addMemberMenuOpen: false,
            newMemberInput: '',
        }

        this.renderMember = this.renderMember.bind(this);
        this.toggleBoardMenu = this.toggleBoardMenu.bind(this);
        this.toggleAddMemberMenu = this.toggleAddMemberMenu.bind(this);
        this.handleNewMemberInputChange = this.handleNewMemberInputChange.bind(this);
        this.handleNewMemberSubmit = this.handleNewMemberSubmit.bind(this);
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
                        <div id="board-menu-btn" onClick={this.toggleBoardMenu}>Show Menu</div>
                    }
                    {this.state.boardMenuOpen &&
                        <div>
                            <div id="board-menu">
                                <div className="board-menu-section">
                                    <span className="board-menu-title-text">Menu</span>
                                    <span id="board-menu-close-btn" onClick={this.toggleBoardMenu}>X</span>
                                </div>
                                <div className="board-menu-section">
                                    <ul id="board-member-list">
                                        {members}
                                    </ul>
                                    <div id="board-member-add-menu-btn" className="btn" onClick={this.toggleAddMemberMenu}>Add Members...</div>
                                    {this.state.addMemberMenuOpen &&
                                        <div id="board-member-add-menu">
                                            <input id="new-board-member-input" value={this.state.newMemberInput} onChange={this.handleNewMemberInputChange} placeholder="Member username..." />
                                            <div id="add-board-member-btn" className="btn" onClick={this.handleNewMemberSubmit}>Add</div>
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
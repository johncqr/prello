import React from 'react';

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

export default class InfoModal extends React.Component {
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

        this.renderLabel = this.renderLabel.bind(this);
        this.renderLabelMaker = this.renderLabelMaker.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleNameKeypress = this.handleNameKeypress.bind(this);
        this.handleDescEditChange = this.handleDescEditChange.bind(this);
        this.handleDescEditOpen = this.handleDescEditOpen.bind(this);
        this.handleDescEditSubmit = this.handleDescEditSubmit.bind(this);
        this.handleNameClick = this.handleNameClick.bind(this);
        this.handleSendComment = this.handleSendComment.bind(this);
        this.toggleLabelMenu = this.toggleLabelMenu.bind(this);
        this.handleLabelDescChange = this.handleLabelDescChange.bind(this);
        this.handleAddLabel = this.handleAddLabel.bind(this);
    }

    renderLabel(l) {
        return (
            <li key={l._id} onClick={() => this.props.onDeleteLabel(l._id)} className={'card-label card-label-' + l.color}>
                <span className="card-label-text">{l.desc}</span>
            </li>
        );
    }

    renderLabelMaker(color) {
        return (
            <li onClick={() => this.handleAddLabel(color)} key={color} className={'add-label-selector card-label-' + color}>
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
            return <CardComment key={c._id} username={c.username} content={c.content} datetimePosted={c.datetimePosted} />
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
                            {!this.state.cardNameEditOpen &&
                                <h3 id="current-card-page-name" className="card-page-name" onClick={this.handleNameClick}>
                                    {this.props.name}
                                </h3>
                            }
                            {this.state.cardNameEditOpen &&
                                <input type="text" id="edit-card-name-input" defaultValue={this.props.name} onKeyPress={this.handleNameKeypress} className="card-page-name" />
                            }
                        </div>
                        <div className="card-page-topbar-right">
                            <div id="close-card-btn" className="btn" onClick={this.handleClose}>X</div>
                        </div>
                    </div>
                    <div className="flex-container">
                        <div className="card-info">
                            <p className="card-section-name">Author</p>
                            <span id="current-card-page-author" className="card-member">
                                {this.props.author}
                            </span>
                            <p className="card-section-name">Description</p>
                            {!this.state.cardDescEditOpen &&
                                <div>
                                    <p id="current-card-page-description" className="card-page-description" value={this.state.desc} onChange={this.handleDescEditChange}>
                                        {this.props.desc}
                                    </p>
                                    <div id="current-card-page-edit-desc-btn" className="btn" onClick={this.handleDescEditOpen}>Edit description...</div>
                                </div>
                            }
                            {this.state.cardDescEditOpen &&
                                <div>
                                    <textarea id="edit-card-desc-input" rows="3" cols="35" value={this.state.desc} onChange={this.handleDescEditChange} />
                                    <div id="edit-card-desc-submit-btn" className="btn" onClick={this.handleDescEditSubmit}>Submit</div>
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
                            <textarea id="comment-input" value={this.state.commentContent} onChange={this.handleCommentChange} rows="3" cols="35" />
                            <div id="send-comment-btn" className="btn" onClick={this.handleSendComment}>Send</div>
                            <p className="card-section-name">Activity</p>
                            <ul id="card-activity-list">
                                {comments}
                            </ul>
                        </div>
                        <div className="card-options">
                            <p className="card-section-name">Add</p>
                            <ul className="card-option-list">
                                <li className="btn">Members</li>
                                <li id="add-label-btn" className="btn" onClick={this.toggleLabelMenu}>Labels</li>
                                {this.state.cardLabelMenuOpen &&
                                    <div id="add-label-menu">
                                        <input id="add-label-desc" onChange={this.handleLabelDescChange} placeholder="Enter label description..." />
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
                <div onClick={this.handleClose} className="modal-bg"></div>
            </div >
        );
    }
}
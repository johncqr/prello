import React from 'react';

export default class NewModal extends React.Component {
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
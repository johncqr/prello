import React from 'react';

class Card extends React.Component {
    renderLabel(la) {
        return (
            <li key={la._id} className={"card-label-surface card-label-" + la.color}>
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

export default class List extends React.Component {
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

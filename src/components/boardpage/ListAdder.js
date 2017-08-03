import React from 'react';

export default class ListAdder extends React.Component {
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
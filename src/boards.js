import $ from 'jquery';
import React from 'react';

import Navbar from './components/boards/Navbar';
import BoardCollection from './components/boards/BoardCollection';

export default class Boards extends React.Component {
    constructor() {
        super();
        this.state = {
            boards: [],
        }

        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
        this.handleCreateBoard = this.handleCreateBoard.bind(this);
    }

    componentDidMount() {
        // API information
        let PORT = 3000;
        let HOST = `http://localhost:${PORT}`

        $.ajax({
            url: `${HOST}/board`,
            type: 'GET',
            dataType: 'json',
        }).done((json) => {
            this.setState({
                boards: json,
            });
        });

    }

    handleDeleteBoard(bid) {
        $.ajax({
            url: `${HOST}/board/${bid}`,
            type: 'DELETE',
        });
        let newBoards = this.state.boards;
        newBoards.splice(newBoards.findIndex(b => (b._id === bid)), 1);
        this.setState({
            boards: newBoards,
        });
    }

    handleCreateBoard(name) {
        $.ajax({
            url: `${HOST}/board`,
            type: 'POST',
            data: {
                name: name,
            },
        }).done((json) => {
            let newBoards = this.state.boards;
            newBoards.push(json);
            this.setState({
                boards: newBoards,
            });
        });
    }

    render() {
        return (
            <div>
                <Navbar
                    boards={this.state.boards}
                    username={USERNAME}
                    onCreateBoard={this.handleCreateBoard}
                />
                <BoardCollection
                    name={'Personal Boards'}
                    boards={this.state.boards}
                    onDeleteBoard={this.handleDeleteBoard}
                />
            </div>
        );
    }
}

ReactDOM.render(<Boards />, document.getElementById('app'));
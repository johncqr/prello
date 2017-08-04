import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './Login';

ReactDOM.render(
    <Router>
        <Route path="/" render={() => <Login/>} />
    </Router>
, document.getElementById('app'));
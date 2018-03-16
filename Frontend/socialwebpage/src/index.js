import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Login from './Pages/Login';
import Register from './Pages/Register';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/register" component={Register}></Route>

        </Switch>
    </BrowserRouter>,
root);

registerServiceWorker();

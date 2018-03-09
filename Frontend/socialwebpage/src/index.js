import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Home from './Pages/Home';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home}></Route>
        </Switch>
    </BrowserRouter>,
root);

registerServiceWorker();

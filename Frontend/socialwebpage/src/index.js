import React from 'react';
import ReactDOM from 'react-dom';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import Feed from './Pages/Feed';
import Roadmap from './Pages/Roadmap'
import Settings from './Pages/Settings'
import About from './Pages/About'
import Legal from './Pages/Legal'
import Search from './Pages/Search'
import Notifications from './Pages/Notifications'

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

//

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/register" component={Register}></Route>
            <Route path="/profile/:username?" component={Profile}></Route>
            <Route exact path="/notifications/:type/:typeCommented/:postId?" component={Notifications}></Route>
            <Route exact path="/" component={Feed}></Route>
            <Route exact path="/roadmap" component={Roadmap}></Route>
            <Route exact path="/settings" component={Settings}></Route>
            <Route exact path="/about" component={About}></Route>
            <Route exact path="/legal" component={Legal}></Route>
            <Route exact path="/search" component={Search}></Route>
        </Switch>
    </BrowserRouter>,
root);

registerServiceWorker();

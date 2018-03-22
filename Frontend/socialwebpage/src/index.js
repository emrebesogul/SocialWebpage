import React from 'react';
import ReactDOM from 'react-dom';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import Feed from './Pages/Feed';
import UploadImage from './Pages/UploadImage'
import PostText from './Pages/PostText'

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/profile" component={Profile}></Route>
            <Route exact path="/upload" component={UploadImage}></Route>
            <Route exact path="/post" component={PostText}></Route>
            <Route exact path="/" component={Feed}></Route>
        </Switch>
    </BrowserRouter>,
root);

registerServiceWorker();

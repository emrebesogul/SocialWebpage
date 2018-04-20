import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Tab, Card, Image, Icon, Rating, List, Button, Header, Comment, Form } from 'semantic-ui-react'
import {fetchFeedData} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'
import SearchBar from '../Components/SearchBar';
import {checkSession} from '../API/GET/GetMethods';
import '../profileStyle.css';

var feedPosts = [];
var friendRequests = [];
var friends = [];
var comments = [];
var notifications = [];

class Posts extends Component {

  constructor(props) {
      super(props);

      this.state = {
        redirectToLogin: false,
        test: props.name
      }

      this.apiCheckSession = "/checkSession";

      this.pageTitle = "Ivey - Posts";
      document.title = this.pageTitle;
  }

  componentDidMount() {
      this.checkThisSession();

  }

  async checkThisSession() {
    const response = await checkSession(this.apiCheckSession);
    if(response.message !== "User is authorized") {
        this.setState({redirectToLogin: true})
    }
  }


    render() {
        const { redirectToLogin } = this.state;
        if (redirectToLogin) {
            return <Redirect to='/login' />;
        }

        feedPosts = this.state.resFeedPosts;
        friendRequests = this.state.resFriendsRequests;
        friends = this.state.resFriends;
        comments = this.state.resComments;
        notifications = this.state.resNotifications;

        return (
          <div id="main-content">

            <div className="feed">
                <Sidebar />
            </div>

            <div id="feed-content">
                {this.props.match.params.type}
                {this.props.match.params.postId}
            </div>

          </div>
        );
    }
}

export default Posts;

import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Tab, Card, Image, Icon, Rating, List, Button } from 'semantic-ui-react'
import {fetchFeedData} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'

import {checkSession} from '../API/GET/GetMethods';
import {getFriendRequests} from '../API/GET/GetMethods';
import {likeStoryEntryById, likeImageById} from '../API/POST/PostMethods';
import '../profileStyle.css';

var feedPosts = [];
var friendRequests = [];
var friends = [{requester: "Emre"}, {requester: "Johannes"}];

class Profile extends Component {

  constructor() {
      super();

      this.state = {
        redirectToLogin: false,
        resFriendsRequests: [],
        resFriends: [],
        resFeedPosts: []
      }

      this.apiCheckSession = "/checkSession";

      this.checkThisSession();
      this.getfeeddata();
      this.getFriendRequests();

      this.pageTitle = "Recent posts and updates...";
      document.title = this.pageTitle;
  }

  async checkThisSession() {
    const response = await checkSession(this.apiCheckSession);
    if(response.message !== "User is authorized") {
        this.setState({redirectToLogin: true})
    }
  }


 async getfeeddata() {
      const response = await fetchFeedData("/feed");
      this.setState({resFeedPosts: response});
  }

  async getFriendRequests() {
      const response = await getFriendRequests("/friends/getFriendRequests");
      this.setState({resFriendsRequests: response});
  }


async handleRate(event, data){
  event.preventDefault();

  this.state.entryId = data._id;

  if(data.src) {
    const response = await likeImageById(
      "/image/like",
      this.state.entryId
    );
  }
  else {
    const response = await likeStoryEntryById(
      "/story/like",
      this.state.entryId
    );
  }


  // Redirect to feed if respose is message is true
  // this.setState({status: response});
  // if(this.state.status === true) {
  //     this.setState({ redirectToFeed: true });
  // } else {
  //     let errorField = document.getElementById("error-message-upload-story");
  //     errorField.style.display = "block";
  // }
}


    render() {
        const { redirectToLogin } = this.state;
        if (redirectToLogin) {
            return <Redirect to='/login' />;
        }

        feedPosts = this.state.resFeedPosts;
        friendRequests = this.state.resFriendsRequests;
        console.log("feedPosts ", feedPosts)
        console.log("friendRequests ", friendRequests)

        return (
          <div id="main-content">

            <div className="feed">
                 <Sidebar />
             </div>
                <div id="feed-content">
                      <Tab menu={{ secondary: true, pointing: true }} panes={
                        [
                          { menuItem: 'Feed', render: () => <Tab.Pane attached={false}>
                          <Link to="/upload">
                            <Button  size="medium" id="upload-button-mobile" icon>
                              <Icon className="menu-icons" name='upload' />
                              Upload Image
                            </Button>
                          </Link>
                          <Link to="/post">
                          <Button  size="medium" id="upload-button-mobile" icon>
                            <Icon className="menu-icons" name='plus' />
                            Add Story
                          </Button></Link>

                          {feedPosts.map((item, index) =>
                          {return(
                            <div key={index} id="feed-card">
                              <Card.Group>
                                <Card fluid centered>
                                  <div className="username-label">
                                    <Link to={`/profile/${item.username}`}>
                                        <span > @{item.username} </span>
                                    </Link>
                                  </div>

                                  <Image className="image-feed" src={item.src} />
                                  <Card.Content id="card-content">
                                    <Card.Header className="card-header">
                                      <Rating onRate={((e) => this.handleRate(e, item))} icon='heart' size="large" defaultRating={item.current_user_has_liked} maxRating={1}>
                                      </Rating>
                                         {item.title}
                                        <div className="ui mini horizontal statistic post-likes">
                                          <div className="value">
                                            {item.number_of_likes}
                                          </div>
                                          <div className="label">
                                            Likes
                                          </div>
                                      </div>

                                    </Card.Header>
                                    <Card.Meta className="card-meta">
                                      <span className='date'>
                                        {item.date_created}
                                      </span>
                                    </Card.Meta>
                                    <Card.Description>
                                      {item.content}
                                    </Card.Description>
                                  </Card.Content>
                                </Card>
                              </Card.Group>
                             </div>
                             )
                          })}


                          </Tab.Pane> },
                          { menuItem: 'Friends', render: () => <Tab.Pane attached={false}>
                            <div id="friends">
                              <List className="friend-list" relaxed divided>

                                {friends.map((item, index) =>
                                  {
                                    return(
                                      <div key={index}>
                                        <List.Item>
                                          <Image size="tiny" avatar src='/assets/images/boy.png' />
                                          <List.Content>
                                            <List.Header as='a'>{item.requester} wants to be friends with you.</List.Header>
                                            <List.Description>{item.time}</List.Description>
                                            <List.Description>4 mutual contacts</List.Description>
                                          </List.Content>
                                          <List.Content floated="right">
                                            <Button>Confirm</Button>
                                            <Button>Decline</Button>
                                          </List.Content>
                                        </List.Item>
                                      </div>
                                    )
                                  }
                                )}
                              </List>

                              <div className="seperator"></div>

                              <List className="friend-list" relaxed divided>
                                {friends.map((item, index) =>
                                  {
                                    return(
                                      <div key={index}>
                                        <List.Item>
                                          <Image size="tiny" avatar src='/assets/images/boy.png' />
                                          <List.Content>
                                            <List.Header as='a'>{item.requester}</List.Header>
                                            <List.Description>4 mutual contacts</List.Description>
                                          </List.Content>
                                          <List.Content floated="right">
                                            <Button>Delete Friend</Button>
                                          </List.Content>
                                        </List.Item>
                                      </div>
                                    )
                                  }
                                )}
                              </List>
                            </div>

                          </Tab.Pane> },
                          { menuItem: 'Notifications', render: () => <Tab.Pane attached={false}>
                            Hello
                          </Tab.Pane> },
                        ]
                        } />
                </div>
          </div>
        );
    }
}

export default Profile;

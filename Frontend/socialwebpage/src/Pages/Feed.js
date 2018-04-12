import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Tab, Card, Image, Icon, Rating, List, Button, Header } from 'semantic-ui-react'
import {fetchFeedData} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'

import {checkSession} from '../API/GET/GetMethods';
import {getFriendRequests, getFriends} from '../API/GET/GetMethods';
import {likeStoryEntryById, likeImageById, deleteFriendshipRequest, confirmFriendshipRequest, deleteFriend} from '../API/POST/PostMethods';
import '../profileStyle.css';

var feedPosts = [];
var friendRequests = [];
var friends = [];

class Feed extends Component {

  constructor() {
      super();

      this.state = {
        redirectToLogin: false,
        resFriendsRequests: [],
        resFriends: [],
        resFeedPosts: []
      }

      this.apiCheckSession = "/checkSession";

      //this.checkThisSession();
      //this.getfeeddata();
      //this.getFriends();
      //this.getFriendRequests();


      this.pageTitle = "Recent posts and updates...";
      document.title = this.pageTitle;
  }

  componentDidMount() {
      this.checkThisSession();
      this.getfeeddata();
      this.getFriends();
      this.getFriendRequests();
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
      response.map(item => {
        item.number_of_likes_in_state = item.number_of_likes;
      });
  }

  async getFriendRequests() {
      const response = await getFriendRequests("/friends/getFriendRequests");
      this.setState({resFriendsRequests: response});
  }

  async getFriends() {
      const response = await getFriends("/friends/getFriends");
      this.setState({resFriends: response})
  }

  async confirmFriendRequest(e, item) {
      //Set state of status to accepted
      //Add both to friends: []
      const response = await confirmFriendshipRequest(
          "/friends/confirmFriendRequest",
          item.requester,
          item.recipient
      );
      if(response) {
          window.location.reload();
      }

  }

  async declineFriendRequest(e, item) {
      //Set state of status to rejected
      //Delete from friendRequests collection
      const response = await deleteFriendshipRequest(
          "/friends/declineFriendRequest",
          item.requester,
          item.recipient
      );
      if(response) {
          window.location.reload();
      }
  }

  async deleteFriend(e, item) {
      const response = await deleteFriend(
          "/friends/deleteFriend",
          item
      );
      if(response) {
          window.location.reload();
      }
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

  this.state.resFeedPosts.map(item => {
    if(item._id === data._id) {
      if(item.current_user_has_liked == 0) {
        item.number_of_likes_in_state++;
        item.current_user_has_liked = 1;
      } else {
        item.number_of_likes_in_state--;
        item.current_user_has_liked = 0;
      }
    }
  });
  this.setState({resFeedPosts: this.state.resFeedPosts});
}

getNumberOfLikes(currentItem) {
  let numberOfLikes = 0;
  this.state.resFeedPosts.map(item => {
    if(item._id === currentItem._id) {
      numberOfLikes = item.number_of_likes_in_state;
    }
  });
  if(numberOfLikes == undefined) {
    numberOfLikes = currentItem.number_of_likes;
  }
  return numberOfLikes;
}


    render() {
        const { redirectToLogin } = this.state;
        if (redirectToLogin) {
            return <Redirect to='/login' />;
        }

        feedPosts = this.state.resFeedPosts;
        friendRequests = this.state.resFriendsRequests;
        friends = this.state.resFriends;

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
                              Add Image
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
                                    <Image className="user-card-avatar" src={"https://gruppe1.testsites.info" + item.profile_picture_url} />
                                    <Link to={`/profile/${item.username}`}>
                                      <span className="content-card-username-label"> @{item.username} </span>
                                    </Link>
                                  </div>

                                  <Image className="image-feed" src={item.src} />
                                  <Card.Content id="card-content">
                                    <Card.Header className="card-header">
                                      <Rating onRate={((e) => this.handleRate(e, item))} icon='heart' size="large" rating={item.current_user_has_liked} maxRating={1}>
                                      </Rating>
                                         {item.title}
                                        <div className="ui mini horizontal statistic post-likes">
                                          <div className="value">
                                            {this.getNumberOfLikes(item)}
                                          </div>
                                          <div className="label">
                                            Likes
                                          </div>
                                      </div>

                                    </Card.Header>
                                    <Card.Meta className="card-meta">
                                      <span className='date'>
                                        {item.date_created}
                                        {item.updated ? <p>(edited)</p> :  null}
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
                              <div>
                                <Header as='h2' icon textAlign='center'>
                                  <Icon name='users' circular />
                                  <Header.Content>
                                    Friends
                                  </Header.Content>
                                  <Header.Subheader className="feed-subheader">
                                    View your current friends and manage requests from people you may know.

                                  </Header.Subheader>
                                </Header>
                              </div>
                                {friendRequests.map((item, index) =>
                                  {
                                    return(
                                      <div key={index}>
                                        <List  divided relaxed verticalAlign='middle'>
                                          <List.Item>
                                            <Image className="user-card-avatar" src={"https://gruppe1.testsites.info" + item.profile_picture_url} />
                                            <List.Content>
                                              <List.Header as='a'>
                                                  <Link to={`/profile/${item.requester}`}>
                                                      <span>{item.requester} </span>
                                                  </Link>
                                                   wants to be friends with you.
                                              </List.Header>
                                              <List.Description>4 mutual contacts</List.Description>
                                            </List.Content>
                                            <List.Content floated="right">
                                              <Button onClick={((e) => this.confirmFriendRequest(e, item))}>Confirm</Button>
                                              <Button onClick={((e) => this.declineFriendRequest(e, item))}>Decline</Button>
                                            </List.Content>
                                          </List.Item>
                                        </List>
                                      </div>
                                    )
                                  }
                                )}
                                {friends.map((item, index) =>
                                  {
                                    return(
                                      <div key={index}>
                                        <List  divided relaxed verticalAlign='middle'>
                                          <List.Item>
                                            <Image className="user-card-avatar" src={"https://gruppe1.testsites.info" + item.profile_picture_url} />
                                            <List.Content>
                                              <List.Header >
                                                  <Link to={`/profile/${item}`}>
                                                      {item}
                                                  </Link>
                                              </List.Header>
                                              <List.Description>4 mutual contacts</List.Description>
                                            </List.Content>
                                            <List.Content floated="right">
                                                <Button onClick={((e) => this.deleteFriend(e, item))}>Delete Friend</Button>
                                            </List.Content>
                                          </List.Item>
                                        </List>
                                      </div>
                                    )
                                  }
                                )}
                            </div>


                          </Tab.Pane> },
                          { menuItem: 'Notifications', render: () => <Tab.Pane attached={false}>
                            <div id="friends">
                              <div>
                                <Header as='h2' icon textAlign='center'>
                                  <Icon name='discussions' circular />
                                  <Header.Content>
                                    Notifications
                                  </Header.Content>
                                  <Header.Subheader className="feed-subheader">
                                    Check your notifications and see posts with interaction.
                                  </Header.Subheader>
                                </Header>
                              </div>
                              {friends.map((item, index) =>
                                {
                                  return(
                                    <div key={index}>
                                      <List  divided relaxed verticalAlign='middle'>
                                        <List.Item>
                                          <Image size="tiny" avatar src='/assets/images/boy.png' />
                                          <List.Content>
                                            <List.Header >
                                                <Link to={`/profile/${item}`}>
                                                    {item}
                                                </Link>
                                            </List.Header>
                                            <List.Description>4 mutual contacts</List.Description>
                                          </List.Content>
                                          <List.Content floated="right">
                                              <Button onClick={((e) => this.deleteFriend(e, item))}>Delete Friend</Button>
                                          </List.Content>
                                        </List.Item>
                                      </List>
                                    </div>
                                  )
                                }
                              )}
                            </div>
                          </Tab.Pane> },
                        ]
                        } />
                </div>
          </div>
        );
    }
}

export default Feed;

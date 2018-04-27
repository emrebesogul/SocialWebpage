import React, {Component} from 'react';
import Sidebar from '../Components/Sidebar';
import Dropzone from 'react-dropzone'
import { Link, Redirect } from 'react-router-dom';
import { Tab, Card, Image, Icon, Rating, List, Button, Header, Comment, Message, TextArea, Input, Form } from 'semantic-ui-react'
import { fetchFeedData } from '../API/GET/GetMethods';
import { getCurrentUserData, checkAuthorization } from '../API/GET/GetMethods';
import { uploadStoryToPlatform, uploadPictureToPlatform, deleteImageById, deleteStoryEntryById } from '../API/POST/PostMethods';
import { getFriendRequests, getFriends, getComments, getNotifications } from '../API/GET/GetMethods';
import { likeStoryEntryById, likeImageById, deleteFriendshipRequest, confirmFriendshipRequest, deleteFriend, createComment, deleteCommentById, likeComment } from '../API/POST/PostMethods';
import '../profileStyle.css';

var feedPosts = [];
var friendRequests = [];
var friends = [];
var comments = [];
var notifications = [];

class Feed extends Component {

  constructor() {
      super();

      this.state = {
        commentStatus: "Show Comments",
        redirectToLogin: false,
        resFriendsRequests: [],
        resFriends: [],
        resFeedPosts: [],
        resComments: [],
        resNotifications: [],
        files: [],
        showMessage: false,
        sourceImage: "",
        err: "",
        title: "",
        content: "",
        redirectToFeed: false,
        status: false
      }
      this.pageTitle = "Ivey - Feed";
      document.title = this.pageTitle;
  }

  componentDidMount() {
      this.checkAuthorization();
      this.getCurrentUserData();
      this.getfeeddata();
      this.getFriends();
      this.getFriendRequests();
      this.getComments();
      this.getNotifications();
  }

  async checkAuthorization() {
    const userIsAuthorized = await checkAuthorization();
    if(!userIsAuthorized) {
      this.setState({redirectToLogin: true})
    }
  }

  async getCurrentUserData() {
    const currentUserData = await getCurrentUserData();
    this.setState({currentUserId: currentUserData.userId})
    this.setState({currentUserIsAdmin: currentUserData.is_admin});
  }


 async getfeeddata() {
      let response = await fetchFeedData();
      this.setState({resFeedPosts: response});
      if (response){
        response.map(item => {
          item.number_of_likes_in_state = item.number_of_likes;
        });
      }
  }

  async getFriendRequests() {
      const response = await getFriendRequests();
      this.setState({resFriendsRequests: response});
  }

  async getFriends() {
      const response = await getFriends();
      this.setState({resFriends: response})
  }

  async getNotifications() {
      const response = await getNotifications();
      this.setState({resNotifications: response})
  }

  async confirmFriendRequest(e, item) {
      const response = await confirmFriendshipRequest(String(item.requesterId));
      if(response) {
          window.location.reload();
      }
  }

  async declineFriendRequest(e, item) {
      const response = await deleteFriendshipRequest(String(item.requesterId));
      if(response) {
          window.location.reload();
      }
  }

  async deleteFriend(e, item) {
      const response = await deleteFriend(item.friendId);
      if(response) {
          window.location.reload();
      }
  }

async handleRatePost(event, data){
  event.preventDefault();

  if(data.src) {
    await likeImageById(data._id);
  }
  else {
    await likeStoryEntryById(data._id);
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

getNumberOfLikesOfPost(currentItem) {
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

async handleCreateComment(event, data) {
  if(event.target[0].value.trim() != "" && event.target[0].value != null) {
    let commentData = {
      "content": event.target[0].value,
      "postId" : data._id,
      "postType" : data.type
    }
    let response = await createComment(commentData);
    if(response) {
      let commentInputElements = Array.from(document.getElementsByClassName('commentInput'));
      commentInputElements.map(item => {
        item.value = "";
      })
      this.getComments();
    }
  }
}

async getComments() {
  let response = [];
  response = await getComments();
  this.setState({resComments: response});
  if (response){
    response.map(item => {
      item.number_of_likes_in_state = item.number_of_likes;
      item.showOrHide = 0;
      item.commentStatus = "Show Comments";
    });
  }
}

async handleRateComment(event, data) {
  event.preventDefault();

  await likeComment(data._id);
  this.state.resComments.map(item => {
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
  this.setState({resComments: this.state.resComments});
}

getNumberOfLikesOfComment(currentItem) {
  let numberOfLikes = 0;
  this.state.resComments.map(item => {
    if(item._id === currentItem._id) {
      numberOfLikes = item.number_of_likes_in_state;
    }
  });
  if(numberOfLikes == undefined) {
    numberOfLikes = currentItem.number_of_likes;
  }
  return numberOfLikes;
}

async handleSubmit(event) {
  event.preventDefault();

  this.state.title =  event.target[0].value;
  this.state.content =  event.target[1].value;

  if(this.state.files[0]){
    const fd = new FormData();
    fd.append('theImage', this.state.files[0]);
    fd.append('title', this.state.title);
    fd.append('content', this.state.content);

    const response = await uploadPictureToPlatform(fd);

    this.setState({message : JSON.parse(response).message});
    if(this.state.message === "Image uploaded") {
        this.setState({ redirectToFeed: true });
        window.location.reload();
    } else {
        this.setState({ showMessage: true });
    }

  }else{
    const response = await uploadStoryToPlatform(this.state.title, this.state.content);

    this.setState({status: response});

    if(this.state.status === true) {
        this.setState({ redirectToFeed: true });
        window.location.reload();
    } else {
        this.setState({ showMessage: true });
    }
  }
}

    onDrop(files) {
      this.setState({files: files});
      document.getElementById("textarea-feed").removeAttribute("required");
    }

    async handleDeleteComment(event, data) {
      const response = await deleteCommentById(data._id);
      if(response) {
        this.getComments();
      }
    }

    async handleDeletePost(event, data) {
      if(data.type == "story") {
        await deleteStoryEntryById(data._id);
        this.getfeeddata();
      }
      if(data.type == "image") {
        await deleteImageById(data._id);
        this.getfeeddata();
      }
    }

    showOrHideComments() {
        if (this.state.commentStatus === "Show Comments") {
            this.setState({showComments: true});
            this.setState({commentState: 1});
            this.setState({commentStatus: "Hide Comments"});
        } else if (this.state.commentStatus === "Hide Comments") {
            this.setState({showComments: false});
            this.setState({commentState: 0});
            this.setState({commentStatus: "Show Comments"});
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

                      <Tab menu={{ secondary: true, pointing: true }} panes={
                        [
                          { menuItem: 'Feed', render: () => <Tab.Pane attached={false}>
                          <div id="feed-card">
                            <Card.Group>
                              <Card fluid centered id="feed-upload">
                                <div className="username-label">
                                  Share something with your friends
                                </div>
                                <Card.Content id="feed-upload-content">
                                  <div id="upload-content">
                                     <Form onSubmit={this.handleSubmit.bind(this)}>

                                        <div>{this.state.files.map((file, index) => <img key={index} className="upload-image" alt="preview" src={file.preview} /> )}</div>
                                        <Input className="input-upload" placeholder=" What's the title of your post?" type="text"/>
                                        <span className="input-label-upload"> </span>
                                        <TextArea id="textarea-feed" className="input-upload" placeholder="What story do you want to share?" required type="text"></TextArea>

                                        {this.state.showMessage ? <Message negative><p>{this.state.message}</p></Message> : null}

                                        <Dropzone id="dz-repair" multiple={ false } name="theImage" acceptedFiles="image/jpeg, image/png, image/gif" className="upload-dropzone mobile-button-border" onDrop={this.onDrop.bind(this)} >
                                            <p id="feed-share-text"><Icon name='image' size="large" id="settings-icon" /> Add Photo</p>
                                        </Dropzone>
                                        <Button id="feed-post-button" className="button-upload mobile-button-border" type="submit">Post</Button>

                                      </Form>
                                  </div>
                                </Card.Content>
                              </Card>
                            </Card.Group>
                          </div>

                          {feedPosts.map((item, index) =>
                          {return(
                            <div key={index} id="feed-card">
                              <Card.Group>
                                <Card fluid centered>
                                  <div className="username-label">
                                    {item.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image src={item.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                    <Link to={`/profile/${item.username}`}>
                                      <span className="content-card-username-label"> @{item.username} </span>
                                    </Link>
                                    {(this.state.currentUserId === item.user_id) || this.state.currentUserIsAdmin ? <Button onClick={((e) => this.handleDeletePost(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                                  </div>

                                  <Image className="image-feed" src={item.src} />
                                  <Card.Content id="card-content">
                                    <Card.Header className="card-header">
                                      <Rating onRate={((e) => this.handleRatePost(e, item))} icon='heart' size="large" rating={item.current_user_has_liked} maxRating={1}>
                                      </Rating>
                                         {item.title}
                                        <div className="ui mini horizontal statistic post-likes">
                                          <div className="value">
                                            {this.getNumberOfLikesOfPost(item)}
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
                                <Card fluid centered className="comment-card">
                                  <Card.Content className="feed-comment-content">
                                      <Header as='h3' dividing onClick={((e) => this.showOrHideComments(e))}>{this.state.commentStatus}</Header>

                                        {this.state.showComments ?
                                            <div>
                                                {comments.map((comment, index) => {
                                                return(
                                                  <Comment.Group key={index}>
                                                    {comment.post_id === item._id ?
                                                    <Comment className="comment-box">

                                                      {comment.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image className="comments-user-image" src={comment.profile_picture_url} /></div> : <div><Image className="comments-user-image" src="/assets/images/user.png"></Image></div> }

                                                      <Comment.Content className="comment-content">
                                                        <div className="comment-header">
                                                            <Comment.Author className="comment-author" >
                                                              <Link to={`/profile/${comment.authorName}`}>
                                                                @{comment.authorName}
                                                              </Link>
                                                            </Comment.Author>
                                                        </div>
                                                        <div className="ui mini horizontal statistic post-likes comment-likes">
                                                          <div className="value">
                                                          {this.getNumberOfLikesOfComment(comment)}
                                                          </div>
                                                          <div className="label">
                                                            Likes
                                                          </div>
                                                        </div>
                                                        {(this.state.currentUserId === comment.author_id) || this.state.currentUserIsAdmin ? <Button className="button-upload delete-button-comment" onClick={((e) => this.handleDeleteComment(e, comment))} circular icon="delete" size="tiny"></Button> : null }

                                                        <div className="comment-user-info">
                                                          <Comment.Metadata>
                                                            <div>{comment.date_created}</div>
                                                          </Comment.Metadata>
                                                        </div>
                                                        <Comment.Text>
                                                          <Rating className="comment-rating" onRate={((e) => this.handleRateComment(e, comment))} icon='heart' size="large" rating={comment.current_user_has_liked} maxRating={1}>
                                                          </Rating>
                                                          {comment.content}
                                                        </Comment.Text>
                                                      </Comment.Content>
                                                    </Comment>
                                                    : null }
                                                  </Comment.Group>
                                                )
                                              })}
                                            </div>

                                        : null}





                                      <Form className="feed-comments-form" onSubmit={((e) => this.handleCreateComment(e, item))} reply>
                                        <Form.TextArea class="commentInput" rows="1" placeholder="Add a comment.." />
                                        <Button className="button-upload button-styles add-comment-button">
                                          <Icon name="send" />
                                        </Button>
                                      </Form>
                                  </Card.Content>
                                </Card>
                              </Card.Group>
                             </div>
                             )
                          })}


                          </Tab.Pane> },
                          { menuItem: 'Friends', render: () => <Tab.Pane attached={false}>
                            <div id="friends">
                              <div className="feed-friend-header">
                                <Header as='h2'  icon textAlign='center'>
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
                                        <List className="feed-list-item" divided relaxed verticalAlign='middle'>
                                          <List.Item>
                                            {item.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image src={item.profile_picture_url} size="tiny" className="user-card-avatar friends-avatar"/></div> : <div><Image className="user-card-avatar friends-avatar" size="tiny" src="/assets/images/user.png"></Image></div> }
                                            <List.Content className="friends-content">
                                              <List.Header>
                                                  <Link to={`/profile/${item.requester}`}>
                                                      <span>{item.requester} </span>
                                                  </Link>
                                                   wants to be friends with you.
                                              </List.Header>
                                              <List.Description>{item.date_created}</List.Description>
                                            </List.Content>
                                            <List.Content className="flex">
                                              <div className="flex-item">
                                                <Button className="button-styles mobile-button-border" onClick={((e) => this.confirmFriendRequest(e, item))}>Confirm</Button>
                                              </div>
                                              <div className="flex-item">
                                                <Button id="red-border-button" className=" button-styles delete-friend-button mobile-button-border" onClick={((e) => this.declineFriendRequest(e, item))}>Decline</Button>
                                              </div>
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
                                        <List className="feed-list-item" divided relaxed verticalAlign='middle'>
                                          <List.Item>
                                            {item.picture !== "http://localhost:8000/uploads/posts/" ? <div><Image src={item.picture} size="tiny" className="user-card-avatar friends-avatar"/></div> : <div><Image size="tiny" className="user-card-avatar friends-avatar" src="/assets/images/user.png"></Image></div> }
                                            <List.Content className="friends-content">
                                              <List.Header >
                                                  <Link to={`/profile/${item.name}`}>
                                                      {item.name} <br />
                                                  </Link>
                                                  <span className="notifications-metatext">{item.firstName} {item.lastName}</span>
                                              </List.Header>
                                            </List.Content>

                                            <List.Content className="flex">
                                              <div className="flex-item">
                                                <Button id="red-border-button" className="button-styles delete-friend-button mobile-button-border" onClick={((e) => this.deleteFriend(e, item))}>Delete Friend</Button>
                                                </div>
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
                              <div className="feed-friend-header">
                                <Header  as='h2' icon textAlign='center'>
                                  <Icon name='discussions' circular />
                                  <Header.Content>
                                    Notifications
                                  </Header.Content>
                                  <Header.Subheader className="feed-subheader">
                                    Check your notifications and see posts with interaction.
                                  </Header.Subheader>
                                </Header>
                              </div>

                              {notifications.map((item, index) =>
                                {
                                  return(
                                    <div key={index}>
                                      <List className="feed-list-item" divided verticalAlign='middle'>
                                        <List.Item>
                                          {item.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image size="tiny" src={item.profile_picture_url} className="user-card-avatar friends-avatar"/></div> : <div><Image size="tiny" className="user-card-avatar friends-avatar" src="/assets/images/user.png"></Image></div> }
                                          <List.Content className="friends-content">
                                            <List.Header>
                                                {item.redirect ? <div><Link to={`/notifications/${item.type}/${item.typeCommented}/${item.linkToPost}`}>
                                              {item.username} {' '} {item.action} <br/>
                                            <span className="notifications-metatext">{item.date_created}</span></Link></div> : <div >{item.username} {' '} {item.action} <br/> <span className="notifications-metatext">{item.date_created}</span> </div> }
                                            </List.Header>
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

import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Tab, Message, Input, Card, Image, Icon, Rating, List, Button, Header, Comment, Form } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'
import SearchBar from '../Components/SearchBar';
import { checkAuthorization, getNotificationData, getComments, getCurrentUserData } from '../API/GET/GetMethods';
import { likeStoryEntryById, likeImageById, likeGuestbookEntryById, likeComment, createComment, deleteCommentById } from '../API/POST/PostMethods';
import '../profileStyle.css';

var notification = "";
var comments = [];

class Notifications extends Component {

  constructor(props) {
      super(props);

      this.state = {
        showError: false,
        redirectToLogin: false,
        resComments: [],
        responseNotification: ""
      }

      this.pageTitle = "Ivey - Posts";
      document.title = this.pageTitle;
  }

  componentDidMount() {
      this.checkAuthorization();
      this.getCurrentUserData();
      this.getNotificationData();
      this.getComments();
  }

  async checkAuthorization() {
    const userIsAuthorized = await checkAuthorization();
    if(!userIsAuthorized) {
      this.setState({redirectToLogin: true})
    }
  }

  async getCurrentUserData() {
    const currentUserData = await getCurrentUserData();
    if(currentUserData.userId) {
      this.setState({currentUserId: currentUserData.userId})
    }
  }

  async getNotificationData() {
    let api = "/notifications/data/" + this.props.match.params.type + "/" + this.props.match.params.typeCommented  + "/" + this.props.match.params.postId;
    const responseNotification = await getNotificationData(api);
    responseNotification.number_of_likes_in_state = responseNotification.number_of_likes;

    if(responseNotification === false) {
      this.setState({showError: true});
    } else {
      this.setState({
        responseNotification : responseNotification
      });
    }
  }

  async getComments() {
    let response = await getComments();
    this.setState({resComments: response});
    response.map(item => {
      item.number_of_likes_in_state = item.number_of_likes;
    });
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

  async handleRateNotification(event, data){
    event.preventDefault();
    if(data.type == "story") {
      await likeStoryEntryById(data._id);
    }
    if(data.type == "image") {
      await likeImageById(data._id);
    }
    if(data.type == "guestbook") {
      await likeGuestbookEntryById(data._id);
    }
    if(this.state.responseNotification.current_user_has_liked == 0) {
      this.state.responseNotification.number_of_likes_in_state++;
      this.state.responseNotification.current_user_has_liked = 1;
    } else {
      this.state.responseNotification.number_of_likes_in_state--;
      this.state.responseNotification.current_user_has_liked = 0;
    }
    this.setState({responseNotification: this.state.responseNotification});
   }

  getNumberOfLikesOfPost(currentItem) {
    let numberOfLikes = 0;
    if(this.state.responseNotification._id === currentItem._id) {
      numberOfLikes = this.state.responseNotification.number_of_likes_in_state;
    }

    if(numberOfLikes == undefined) {
      numberOfLikes = currentItem.number_of_likes;
    }
    return numberOfLikes;
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

  async handleDeleteComment(event, data) {
    const response = await deleteCommentById(data._id);
    if(response) {
      this.getComments();
    }
  }

  render() {
      const { redirectToLogin } = this.state;
      if (redirectToLogin) {
          return <Redirect to='/login' />;
      }

      notification = this.state.responseNotification;
      comments = this.state.resComments;

      return (
        <div className="feed">
          <Sidebar />
          <div id="profile-content">
              <Header as='h2' icon textAlign='center'>
                <Icon name='discussions' circular />
                <Header.Content>
                  Notifications
                </Header.Content>
                <Header.Subheader className="feed-subheader">
                  Check your notification.
                </Header.Subheader>
              </Header>

              <div>
                  <div className="profile-card">
                    <Card.Group id="notification-card">
                      <Card fluid centered>
                        <div className="username-label">
                          {notification.profile_picture_url !== "http://localhost:8000/uploads/posts/"? <div><Image src={notification.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                          <Link to={`/profile/${notification.username}`}>
                            <span className="content-card-username-label"> @{notification.username} </span>
                          </Link>
                        </div>

                        <Image className="image-feed" src={notification.src} />
                        <Card.Content id="card-content">
                            <Card.Header className="card-header">
                              <Rating onRate={((e) => this.handleRateNotification(e, notification))} icon='heart' size="large" rating={notification.current_user_has_liked} maxRating={1}>
                              </Rating>
                              {notification.title}
                              <div className="ui mini horizontal statistic post-likes">
                                <div className="value">
                                  {this.getNumberOfLikesOfPost(notification)}
                                </div>
                                <div className="label">
                                  Likes
                                </div>
                              </div>
                            </Card.Header>
                            <Card.Meta className="card-meta">
                              <span className='date'>
                                {notification.date_created}
                                {notification.updated ? <p>(edited)</p> :  null}
                              </span>
                            </Card.Meta>
                            <Card.Description>
                                {notification.content}
                            </Card.Description>
                            <Header as='h4' dividing>Comments</Header>
                            {comments.map((comment, index) => {
                              return(
                                <Comment.Group key={index}>
                                  {comment.post_id === notification._id ?
                                  <Comment className="comment-box">
                                    {comment.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image className="comments-user-image" src={comment.profile_picture_url} /></div> : <div><Image className="comments-user-image" src="/assets/images/user.png"></Image></div> }

                                    <Comment.Content className="comment-content">
                                      <div className="comment-header">
                                          <Comment.Author className="comment-author" >
                                            <Link to={`/profile/${comment.authorName}`}>
                                              {comment.authorName}
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
                                      {this.state.currentUserId === comment.author_id ? <Button className="button-upload delete-button-comment" onClick={((e) => this.handleDeleteComment(e, comment))} circular icon="delete" size="tiny"></Button> : null }
                                      <Rating className="comment-rating" onRate={((e) => this.handleRateComment(e, comment))} icon='heart' size="large" rating={comment.current_user_has_liked} maxRating={1}>
                                      </Rating>
                                      <div className="comment-user-info">
                                        <Comment.Metadata>
                                          <div>{comment.date_created}</div>
                                        </Comment.Metadata>
                                      </div>
                                      <Comment.Text>{comment.content}</Comment.Text>
                                    </Comment.Content>
                                  </Comment>
                                  : null }
                                </Comment.Group>
                              )
                            })}
                          <Form onSubmit={((e) => this.handleCreateComment(e, notification))} reply>
                            <Form.TextArea class="commentInput"/>
                            <Button className="button-upload" content='Add Reply' labelPosition='left' icon='edit'/>
                          </Form>
                        </Card.Content>
                      </Card>
                    </Card.Group>
                    </div>
              </div>
              {this.state.showError ? <Message size='massive'>404 POST ENTRY NOT FOUND!</Message>: null}

          </div>

        </div>
      );
  }
}

export default Notifications;

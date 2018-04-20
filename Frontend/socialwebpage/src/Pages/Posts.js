import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Tab, Message, Input, Card, Image, Icon, Rating, List, Button, Header, Comment, Form } from 'semantic-ui-react'
import {fetchFeedData} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'
import SearchBar from '../Components/SearchBar';
import {checkSession, getNotificationData, getComments } from '../API/GET/GetMethods';
import '../profileStyle.css';

var images = [];
var stories = [];
var guestbookEntries = [];
var comments = [];


class Posts extends Component {

  constructor(props) {
      super(props);

      this.state = {
        redirectToLogin: false,
        resComments: [],
        responseStories: [],
        responseImages: [],
        responseGuestbookEntries: []
      }

      this.apiCheckSession = "/checkSession";

      this.pageTitle = "Ivey - Posts";
      document.title = this.pageTitle;
  }

  componentDidMount() {
      this.checkThisSession();
      this.getNotificationData();
      this.getComments();

  }

  getNumberOfLikesOfImage(currentItem) {
    let numberOfLikes = 0;
    this.state.responseImages.map(item => {
      if(item._id === currentItem._id) {
        numberOfLikes = item.number_of_likes_in_state;
      }
    });
    if(numberOfLikes == undefined) {
      numberOfLikes = currentItem.number_of_likes;
    }
    return numberOfLikes;
  }

  getNumberOfLikesOfStoryEntry(currentItem) {
    let numberOfLikes = 0;
    this.state.responseStories.map(item => {
      if(item._id === currentItem._id) {
        numberOfLikes = item.number_of_likes_in_state;
      }
    });
    if(numberOfLikes == undefined) {
      numberOfLikes = currentItem.number_of_likes;
    }
    return numberOfLikes;
  }

  getNumberOfLikesOfGuestbookEntry(currentItem) {
    let numberOfLikes = 0;
    this.state.responseGuestbookEntries.map(item => {
      if(item._id === currentItem._id) {
        numberOfLikes = item.number_of_likes_in_state;
      }
    });
    if(numberOfLikes == undefined) {
      numberOfLikes = currentItem.number_of_likes;
    }
    return numberOfLikes;
  }

  async getComments() {
    let response = await getComments("/comment/list");
    this.setState({resComments: response});
    console.log("resComments: ", this.state.resComments)
  }

  async checkThisSession() {
    const response = await checkSession(this.apiCheckSession);
    if(response.message !== "User is authorized") {
        this.setState({redirectToLogin: true})
    }
  }

    async getNotificationData() {
        let api = "/user/notifications/data/" + this.props.match.params.type + "/" + this.props.match.params.typeCommented  + "/" + this.props.match.params.postId;
        const response = await getNotificationData(
            api
        );
        if(response === false) {
            alert("404")
        } else {
            this.setState({
              responseImages : response
            });
        }
    }


    render() {
        const { redirectToLogin } = this.state;
        if (redirectToLogin) {
            return <Redirect to='/login' />;
        }

        images = this.state.responseImages;
        stories = this.state.responseStories;
        comments = this.state.resComments;
        guestbookEntries = this.state.responseGuestbookEntries;

        return (
          <div id="main-content">

            <div className="feed">
                <Sidebar />
            </div>

            <div id="feed-content">

                <div>
                  <Header as='h2' icon textAlign='center'>
                    <Icon name='discussions' circular />
                    <Header.Content>
                      Notifications
                    </Header.Content>
                    <Header.Subheader className="feed-subheader">
                      Check your notification.
                    </Header.Subheader>
                  </Header>
                </div>

                {images.map((item, index) =>
                {return(
                    <div key={index} className="profile-card">
                      <Card.Group>
                        <Card fluid centered>
                          <div className="username-label">
                            {item.profile_picture_url !== "http://localhost:8000/uploads/posts/"? <div><Image src={item.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                            <span className="content-card-username-label"> @{item.username} </span>
                            {this.state.show ? <Button onClick={((e) => this.handleDeleteImage(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                          </div>
                          <Image className="image-feed" src={item.src} />
                          <Card.Content id="card-content">
                            <Form onSubmit={((e) => this.handleUpdateImage(e, item))}>
                              <Card.Header className="card-header">
                                {this.state.updateItemId == item._id ? <Form.Field><Input  placeholder={this.state.imageTitle} value={this.state.imageTitle} onChange={(e) => this.handleChangeImageData(e,"imageTitle")}/></Form.Field> : item.title}
                                  <div className="ui mini horizontal statistic post-likes">
                                    <div className="value">
                                      {this.getNumberOfLikesOfImage(item)}
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
                                {this.state.updateItemId == item._id ? <Input placeholder={this.state.imageContent} value={this.state.imageContent} onChange={(e) => this.handleChangeImageData(e,"imageContent")} /> : item.content}
                                {this.state.updateItemId == item._id ? <Button className="button-upload save-button-guestbook">Save</Button> : null}
                              </Card.Description>
                            </Form>
                            <Header as='h4' dividing>Comments</Header>
                            {comments.map((comment, index) => {
                              return(
                                <Comment.Group>
                                  {comment.post_id === item._id ?
                                  <Comment>
                                    {comment.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image src={comment.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                    <Comment.Content>
                                      <Comment.Author as='a'>{comment.authorName}</Comment.Author>
                                      <Comment.Metadata>
                                        <div>{comment.date_created}</div>
                                      </Comment.Metadata>
                                      <Comment.Text>{comment.content}</Comment.Text>
                                    </Comment.Content>
                                  </Comment>
                                  : null }
                                </Comment.Group>
                              )
                            })}
                          </Card.Content>
                        </Card>
                      </Card.Group>
                     </div>
                   )
                })}


                {stories.map((item, index) =>
                {return(
                  <div key={index} className="profile-card">
                    <Card.Group>
                      <Card fluid centered>
                        <div className="username-label">
                            {item.profile_picture_url !== "http://localhost:8000/uploads/posts/"? <div><Image src={item.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                            <span className="content-card-username-label"> @{item.username} </span>
                          {this.state.show ? <Button onClick={((e) => this.handleDeleteStoryEntry(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                        </div>
                        <Card.Content id="card-content">

                          <Form onSubmit={((e) => this.handleUpdateStoryEntry(e, item))}>
                            <Card.Header className="card-header">
                                {this.state.updateItemId == item._id ? <Form.Field required ><Input  placeholder={this.state.storyTitle} value={this.state.storyTitle} onChange={(e) => this.handleChangeStoryData(e,"storyTitle")}/></Form.Field> : item.title}
                                  <div className="ui mini horizontal statistic post-likes">
                                  <div className="value">
                                    {this.getNumberOfLikesOfStoryEntry(item)}
                                  </div>
                                  <div className="label">
                                    Likes
                                  </div>
                              </div>
                            </Card.Header>
                            <Card.Meta className="card-meta">
                            </Card.Meta>
                          </Form>
                          <Header as='h4' dividing>Comments</Header>
                          {comments.map((comment, index) => {
                            return(
                              <Comment.Group>
                                {comment.post_id === item._id ?
                                <Comment>
                                  {comment.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image src={comment.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                  <Comment.Content>
                                    <Comment.Author as='a'>{comment.authorName}</Comment.Author>
                                    <Comment.Metadata>
                                      <div>{comment.date_created}</div>
                                    </Comment.Metadata>
                                    <Comment.Text>{comment.content}</Comment.Text>
                                  </Comment.Content>
                                </Comment>
                                : null }
                              </Comment.Group>
                            )
                          })}
                        </Card.Content>
                      </Card>
                    </Card.Group>
                   </div>
                   )
                })}




            </div>

          </div>
        );
    }
}

export default Posts;

import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { Message, Input, Card, Image, Icon, Button, Header, Comment, Form } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'
import { checkAuthorization, getNotificationData, getComments } from '../API/GET/GetMethods';
import '../profileStyle.css';

var posts = [];
var comments = [];


class Notifications extends Component {

  constructor(props) {
      super(props);

      this.state = {
        showError: false,
        redirectToLogin: false,
        resComments: [],
        responsePost: []
      }

      this.pageTitle = "Ivey - Posts";
      document.title = this.pageTitle;
  }

  componentDidMount() {
      this.checkAuthorization();
      this.getNotificationData();
      this.getComments();
  }

  getNumberOfLikesOfPost(currentItem) {
    let numberOfLikes = 0;
    this.state.responsePost.map(item => {
      if(item._id === currentItem._id) {
        numberOfLikes = item.number_of_likes_in_state;
      }
    });
    if(numberOfLikes === undefined) {
      numberOfLikes = currentItem.number_of_likes;
    }
    return numberOfLikes;
  }

  async getComments() {
    let response = await getComments();
    this.setState({resComments: response});
  }

  async checkAuthorization() {
    const userIsAuthorized = await checkAuthorization();
    if(!userIsAuthorized) {
      this.setState({redirectToLogin: true})
    }
  }

    async getNotificationData() {
        let api = "/user/notifications/data/" + this.props.match.params.type + "/" + this.props.match.params.typeCommented  + "/" + this.props.match.params.postId;
        const response = await getNotificationData(
            api
        );
        if(response === false) {
            this.setState({showError: true});
        } else {
            this.setState({
              responsePost : response
            });
        }
    }


    render() {
        const { redirectToLogin } = this.state;
        if (redirectToLogin) {
            return <Redirect to='/login' />;
        }

        posts = this.state.responsePost;
        comments = this.state.resComments;

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

                {posts.map((item, index) =>
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
                                {this.state.updateItemId == item._id ? <Input placeholder={this.state.imageContent} value={this.state.imageContent}/> : item.content}
                              </Card.Description>
                            </Form>
                            <Header as='h4' dividing>Comments</Header>
                            {comments.map((comment, index) => {
                              return(
                                <Comment.Group key={index}>
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

                {this.state.showError ? <Message size='massive'>404 POST ENTRY NOT FOUND!</Message>: null}

            </div>

          </div>
        );
    }
}

export default Notifications;

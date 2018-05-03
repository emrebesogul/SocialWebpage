import React, {Component} from 'react';
import { Input, Tab, Card, Image, Comment, Rating, Icon, Form, Button, Message, Header, TextArea } from 'semantic-ui-react'
import { Redirect, Link } from 'react-router-dom';
import SidebarProfile from '../Components/SidebarProfile'
import ProfileHeader from '../Components/ProfileHeader'
import '../profileStyle.css';
import { checkAuthorization, getCurrentUserData, getStoryForUserId, getImagesForUserId, getGuestbookEntriesForUserId, getUserData, getComments } from '../API/GET/GetMethods';
import { likeStoryEntryById, likeImageById, deleteStoryEntryById, deleteImageById, createGuestbookentry, deleteGuestbookEntryById, likeGuestbookEntryById, getStoryEntryById, getImageById, createComment, deleteCommentById, likeComment } from '../API/POST/PostMethods';
import { updateStoryEntry, updateImage } from '../API/PUT/PutMethods';

var images = [];
var stories = [];
var guestbookEntries = [];
var comments = [];

class Profile extends Component {
  constructor(props) {
      super(props);

      this.state = {
        showOrHideCommentsInImages: [],
        showOrHideCommentsInStories: [],
        showOrHideCommentsInGuestbook: [],

        commentStatusInImages: [],
        commentStatusInStories: [],
        commentStatusInGuestbook: [],

        show: false,
        responseImages: [],
        responseStories: [],
        responseGuestbookEntries: [],
        newGuestbookEntryTitle: "",
        newGuestbookEntryContent: "",
        redirectToLogin: false,
        rerender: false,
        updateItemId: "",
        statusUpdateStoryEntry: false,
        showUpdateStoryErrorMessage: false,
        statusUpdateImage: false,
        showUpdateImageErrorMessage: false,
        resComments: []
      }

      this.property = props.match.params.username;
      this.ownerName = props.match.params.username;
      this.getProfileData(this.property);
      this.getCurrentUserData();
      this.checkAuthorization();
      this.getComments();

      if(this.property === undefined) {
          this.pageTitle = "Ivey - My Profile"
      } else {
          this.pageTitle = "Ivey - Profile of " + this.property
      }
      document.title = this.pageTitle;
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

      async getProfileData(username) {
        if(username === undefined) {
            const responseStories = await getStoryForUserId("/story/list");
            const responseImages = await getImagesForUserId("/image/list");
            const responseGuestbookEntries = await getGuestbookEntriesForUserId("/guestbook/list");

            let i = 0;
            let j = 0;
            let k = 0;

            responseStories.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
              item.position = i;
              this.state.showOrHideCommentsInStories.push(0);
              this.state.commentStatusInStories.push("angle down");
              i++;
            });
            responseImages.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
              item.position = j;
              this.state.showOrHideCommentsInImages.push(0);
              this.state.commentStatusInImages.push("angle down");
              j++;
            });
            responseGuestbookEntries.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
              item.position = k;
              this.state.showOrHideCommentsInGuestbook.push(0);
              this.state.commentStatusInGuestbook.push("angle down");
              k++;
            });

            if (i === responseStories.length && j=== responseImages.length && k === responseGuestbookEntries.length) {
                this.setState({
                  responseStories : responseStories,
                  responseImages : responseImages,
                  responseGuestbookEntries : responseGuestbookEntries
                });
            }

            const currentUserData = await getCurrentUserData();
            this.setState({currentUserIsAdmin: currentUserData.is_admin});

            const response = await getUserData("/getUserData");
            this.setState({username: response.username})
            this.setState({picture: response.picture})
            this.setState({pictureURL: response.pictureURL})

            this.setState({guestbookEntryTitle: responseGuestbookEntries.title});
            this.setState({guestbookEntryContent: responseGuestbookEntries.content});

            if(this.state.picture) {
                this.setState({pictureExists: true})
            }

            if(currentUserData.username === this.state.username) {
                this.setState({ show: true});
            } else {
                this.setState({ show: false});
            }

        } else {
            let apiStoriesWithUsername = "/story/list?username=" + username;
            let apiImagesWithUsername = "/image/list?username=" + username;
            let apiGuestbookEntriesWithUsername = "/guestbook/list?username=" + username;
            const responseStories = await getStoryForUserId(apiStoriesWithUsername);
            const responseImages = await getImagesForUserId(apiImagesWithUsername);
            const responseGuestbookEntries = await getGuestbookEntriesForUserId(apiGuestbookEntriesWithUsername);

            let i = 0;
            let j = 0;
            let k = 0;

            responseStories.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
              item.position = i;
              this.state.showOrHideCommentsInStories.push(0);
              this.state.commentStatusInStories.push("angle down");
              i++;
            });
            responseImages.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
              item.position = j;
              this.state.showOrHideCommentsInImages.push(0);
              this.state.commentStatusInImages.push("angle down");
              j++;
            });
            responseGuestbookEntries.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
              item.position = k;
              this.state.showOrHideCommentsInGuestbook.push(0);
              this.state.commentStatusInGuestbook.push("angle down");
              k++;
            });

            if (i === responseStories.length && j=== responseImages.length && k === responseGuestbookEntries.length) {
                this.setState({
                  responseStories : responseStories,
                  responseImages : responseImages,
                  responseGuestbookEntries : responseGuestbookEntries
                });
            }

            const currentUserData = await getCurrentUserData();
            this.setState({currentUserIsAdmin: currentUserData.is_admin});

            let api = "/getUserData?username=" + username;
            const response = await getUserData(api);
            this.setState({username: response.username})
            this.setState({picture: response.picture})
            this.setState({pictureURL: response.pictureURL})

            this.setState({guestbookEntryTitle: responseGuestbookEntries.title});
            this.setState({guestbookEntryContent: responseGuestbookEntries.content});

            if(this.state.picture) {
                this.setState({pictureExists: true})
            }

            if(currentUserData.username === this.state.username) {
                this.setState({ show: true});
            } else {
                this.setState({ show: false});
            }
        }
      }

      async handleCreateGuestbookEntry(event) {
        event.preventDefault();

        this.state.newGuestbookEntryTitle =  event.target[0].value;
        this.state.newGuestbookEntryContent =  event.target[1].value;

        let response = await createGuestbookentry(
              this.state.newGuestbookEntryTitle,
              this.state.newGuestbookEntryContent,
              this.ownerName
        );
        if(response) {
          this.getProfileData(this.property);
          this.setState({guestbookEntryTitle: ""});
          this.setState({guestbookEntryContent: ""});
        } else {
          this.setState({ guestbookEntryUploadLimitMessage : "The upload limit for this hour has beed reached. Please try again later."});
          this.setState({ showGuestbookEntryUploadLimitMessage: true });
        }
      }

      handleChangeGuestbookEntryInput(e, attribut) {
        switch(attribut) {
          case "guestbookEntryTitle": this.setState({"guestbookEntryTitle": e.target.value}); break;
          case "guestbookEntryContent": this.setState({"guestbookEntryContent": e.target.value}); break;
          default: /* nothing to do */;
    }}

      async handleRateStoryEntry(event, data){
        event.preventDefault();
        this.state.entryId = data._id;
        await likeStoryEntryById(this.state.entryId);

        this.state.responseStories.map(item => {
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
        this.setState({responseStories: this.state.responseStories});
      }

      async handleRateImage(event, data){
        event.preventDefault();
        this.state.entryId = data._id;
        await likeImageById(this.state.entryId);

        this.state.responseImages.map(item => {
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
        this.setState({responseImages: this.state.responseImages});
      }

      async handleRateGuestbookEntry(event, data){
        event.preventDefault();
        this.state.entryId = data._id;
        await likeGuestbookEntryById(this.state.entryId);

        this.state.responseGuestbookEntries.map(item => {
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
        this.setState({responseGuestbookEntries: this.state.responseGuestbookEntries});
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

      async handleDeleteImage(event, data) {
        await deleteImageById(data._id);
        this.getProfileData(this.property);
      }

      async handleDeleteStoryEntry(event, data) {
        await deleteStoryEntryById(data._id);
        this.getProfileData(this.property);
      }

      async handleDeleteGuestbookEntry(event, data) {
        await deleteGuestbookEntryById(data._id);
        this.getProfileData(this.property);
      }

      async handleOpenStoryUpdateWindow(event, data) {
        const response = await getStoryEntryById(data._id);
        if(response) {
            this.setState({storyTitle: response.title})
            this.setState({storyContent: response.content})
        }
            this.setState({ updateItemId: data._id});
      }

      handleChangeStoryData(event, data) {
        switch(data) {
          case "storyTitle": this.setState({"storyTitle": event.target.value}); break;
          case "storyContent":  this.setState({"storyContent": event.target.value}); break;
          default: //Nothing to do;
        }
      }

      async handleUpdateStoryEntry(event, data) {
        event.preventDefault();
        const storyId = data._id;
        const title = event.target[0].value;
        const content = event.target[1].value;
        const response = await updateStoryEntry(storyId, title, content);
        this.setState({statusUpdateStoryEntry: response});

        if(this.state.statusUpdateStoryEntry) {
          this.setState({ updateItemId: ""});
        } else {
          this.setState({ showUpdateStoryErrorMessage: true });
        }
        this.getProfileData(this.property);
      }

      handleCancelUpdateStoryEntry(event, data) {
        this.setState({ updateItemId: ""});
      }

      async handleOpenImageUpdateWindow(event, data) {
        const response = await getImageById(data._id);
        if(response) {
            this.setState({imageTitle: response.title})
            this.setState({imageContent: response.content})
        }
            this.setState({ updateItemId: data._id});
      }

      handleChangeImageData(event, data) {
        switch(data) {
          case "imageTitle": this.setState({"imageTitle": event.target.value}); break;
          case "imageContent":  this.setState({"imageContent": event.target.value}); break;
          default: //Nothing to do;
        }
      }

      async handleUpdateImage(event, data) {
        event.preventDefault();
        const imageId = data._id;
        const title = event.target[0].value;
        const content = event.target[1].value;
        const response = await updateImage(imageId, title, content);
        this.setState({statusUpdateImage: response});

        if(this.state.statusUpdateImage) {
          this.setState({ updateItemId: ""});
        } else {
          this.setState({ showUpdateImageErrorMessage: true });
        }
        this.getProfileData(this.property);
      }

      handleCancelUpdateImage(event, data) {
        this.state.responseImages.map(item => {
          if(item._id === data._id) {
            this.setState({"imageTitle": item.title});
            this.setState({"imageContent": item.content});
          }
        });

        this.setState({ updateItemId: ""});
      }

      async handleCreateComment(event, data, string) {
        if(event.target[0].value.trim() != "" && event.target[0].value != null) {
          let commentData = {
            "content": event.target[0].value,
            "postId" : data._id,
            "postType" : data.type
          }
          let response = await createComment(commentData);
          if (string==="image"){
            let newIds1 = this.state.showOrHideCommentsInImages.slice()
            newIds1[data.position] = 1
            this.setState({showOrHideCommentsInImages: newIds1})

            let newIds = this.state.commentStatusInImages.slice()
            newIds[data.position] = "angle up"
            this.setState({commentStatusInImages: newIds})
          }
          if (string==="story"){
            let newIds1 = this.state.showOrHideCommentsInStories.slice()
            newIds1[data.position] = 1
            this.setState({showOrHideCommentsInStories: newIds1})

            let newIds = this.state.commentStatusInStories.slice()
            newIds[data.position] = "angle up"
            this.setState({commentStatusInStories: newIds})
          }
          if (string==="guestbook"){
            let newIds1 = this.state.showOrHideCommentsInGuestbook.slice()
            newIds1[data.position] = 1
            this.setState({showOrHideCommentsInGuestbook: newIds1})

            let newIds = this.state.commentStatusInGuestbook.slice()
            newIds[data.position] = "angle up"
            this.setState({commentStatusInGuestbook: newIds})
          }
          if(response) {
            let commentInputElements = Array.from(document.getElementsByClassName('commentInput'));
            commentInputElements.map(item => {
              item.value = "";
            });
            this.getComments();
          }
          else {
            let commentInputElements = Array.from(document.getElementsByClassName('commentInput'));
            commentInputElements.map(item => {
              item.value = "";
            });
            this.setState({ commentUploadLimitMessage : "The upload limit for this hour has beed reached. Please try again later." });
            this.setState({ currentPostId: data._id});
            this.setState({ showCommentUploadLimitMessage: true });
          }
        }
      }

      async getComments() {
        let response = await getComments();
        this.setState({resComments: response});
        response.map(item => {
          item.number_of_likes_in_state = item.number_of_likes;
        });
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

      async handleDeleteComment(event, data) {
        const response = await deleteCommentById(data._id);
        if(response) {
          this.getComments();
        }
      }


      showOrHideComments(e, item, tabName) {
          if (tabName === "Image") {
              if (this.state.commentStatusInImages[item.position] == "angle down") {
                  let newIds1 = this.state.showOrHideCommentsInImages.slice()
                  newIds1[item.position] = 1
                  this.setState({showOrHideCommentsInImages: newIds1})

                  let newIds = this.state.commentStatusInImages.slice()
                  newIds[item.position] = "angle up"
                  this.setState({commentStatusInImages: newIds})

              } else if (this.state.commentStatusInImages[item.position] == "angle up") {
                  let newIds3 = this.state.showOrHideCommentsInImages.slice()
                  newIds3[item.position] = 0
                  this.setState({showOrHideCommentsInImages: newIds3})

                  let newIds4 = this.state.commentStatusInImages.slice() //copy the array
                  newIds4[item.position] = "angle down" //execute the manipulations
                  this.setState({commentStatusInImages: newIds4}) //set the new state
              }
          } else if (tabName === "Story") {
              if (this.state.commentStatusInStories[item.position] == "angle down") {
                  let newIds1 = this.state.showOrHideCommentsInStories.slice()
                  newIds1[item.position] = 1
                  this.setState({showOrHideCommentsInStories: newIds1})

                  let newIds = this.state.commentStatusInStories.slice()
                  newIds[item.position] = "angle up"
                  this.setState({commentStatusInStories: newIds})

              } else if (this.state.commentStatusInStories[item.position] == "angle up") {
                  let newIds3 = this.state.showOrHideCommentsInStories.slice()
                  newIds3[item.position] = 0
                  this.setState({showOrHideCommentsInStories: newIds3})

                  let newIds4 = this.state.showOrHideCommentsInStories.slice() //copy the array
                  newIds4[item.position] = "angle down" //execute the manipulations
                  this.setState({commentStatusInStories: newIds4}) //set the new state
              }
          } else if (tabName === "Guestbook") {
              if (this.state.commentStatusInGuestbook[item.position] == "angle down") {
                  let newIds1 = this.state.showOrHideCommentsInGuestbook.slice()
                  newIds1[item.position] = 1
                  this.setState({showOrHideCommentsInGuestbook: newIds1})

                  let newIds = this.state.commentStatusInGuestbook.slice()
                  newIds[item.position] = "angle up"
                  this.setState({commentStatusInGuestbook: newIds})

              } else if (this.state.commentStatusInGuestbook[item.position] == "angle up") {
                  let newIds3 = this.state.showOrHideCommentsInGuestbook.slice()
                  newIds3[item.position] = 0
                  this.setState({showOrHideCommentsInGuestbook: newIds3})

                  let newIds4 = this.state.commentStatusInGuestbook.slice() //copy the array
                  newIds4[item.position] = "angle down" //execute the manipulations
                  this.setState({commentStatusInGuestbook: newIds4}) //set the new state
              }
          }
      }

    render() {

    const { redirectToLogin } = this.state;
    if (redirectToLogin) {
        return <Redirect to='/login' />;
    }

      images = this.state.responseImages;
      stories = this.state.responseStories;
      guestbookEntries = this.state.responseGuestbookEntries;
      comments = this.state.resComments;

        return (
          <div className="feed">
              <SidebarProfile />
              <ProfileHeader name={this.property}/>
              <div id="profile-content">
                  <Tab menu={{ secondary: true, pointing: true }} panes={
                      [
                        { menuItem: 'Gallery', render: () => <Tab.Pane attached={false}>
                          {images.map((item, index) =>
                          {return(
                            <div key={index} className="profile-card">
                              <Card.Group>
                                <Card fluid centered>
                                  <div className="username-label">
                                    {this.state.pictureExists ? <div><Image src={this.state.pictureURL} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }

                                    <span className="content-card-username-label"> @{item.username} </span>
                                    {this.state.show || this.state.currentUserIsAdmin ? <Button onClick={((e) => this.handleDeleteImage(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                                    {this.state.show && this.state.updateItemId != item._id ? <Button onClick={((e) => this.handleOpenImageUpdateWindow(e, item))} className="button-upload edit-button-guestbook" circular icon="edit" size="small"></Button> : null}
                                  </div>
                                  <Image className="image-feed" src={item.src} />
                                  <Card.Content id="card-content">
                                    <Form onSubmit={((e) => this.handleUpdateImage(e, item))}>
                                      <Card.Header className="card-header">
                                        <Rating onRate={((e) => this.handleRateImage(e, item))} icon='heart' size="large" rating={item.current_user_has_liked} maxRating={1}></Rating>
                                        {this.state.updateItemId == item._id ? <Form.Field><Input  placeholder={this.state.imageTitle} value={this.state.imageTitle} onChange={(e) => this.handleChangeImageData(e,"imageTitle")}/></Form.Field> : item.title}
                                          <div className="ui mini horizontal statistic post-likes">
                                            <div className="value">
                                              {this.getNumberOfLikesOfImage(item)}
                                            </div>
                                            <div className="label">
                                              Likes
                                            </div>
                                            <Button id="comments-button" className="button-upload" onClick={((e) => this.showOrHideComments(e, item, "Image"))}>
                                              <Icon name="comment" />
                                              <Icon name={this.state.commentStatusInImages[item.position]} />
                                            </Button>
                                          </div>
                                      </Card.Header>
                                      <Card.Meta className="card-meta">
                                        <span className='date'>
                                          {item.date_created}
                                          {item.updated ? <p>(edited)</p> :  null}
                                        </span>
                                      </Card.Meta>
                                      <Card.Description className="content-card-description">
                                        {this.state.updateItemId == item._id ? <Input className="input-upload" placeholder={this.state.imageContent} value={this.state.imageContent} onChange={(e) => this.handleChangeImageData(e,"imageContent")} /> : (item.content ? item.content : <br/>)}
                                        <div className="profile-edit-buttons">
                                          {this.state.updateItemId == item._id ? <Button className="button-upload save-button-guestbook">Save</Button> : null}
                                          {this.state.updateItemId == item._id ? <Button onClick={((e) => this.handleCancelUpdateImage(e, item))} className="button-upload save-button-guestbook">Cancel</Button> : null}
                                        </div>
                                        {this.state.showUpdateImageErrorMessage && this.state.updateItemId == item._id ? <Message negative><p>Error while updating this image!</p></Message> : null}
                                      </Card.Description>
                                    </Form>
                                  </Card.Content>
                                </Card>
                                <Card fluid centered className="comment-card">
                                  <Card.Content className="feed-comment-content">
                                    {this.state.showOrHideCommentsInImages[item.position] ?
                                        <div>
                                            <Header as='h3' dividing>Comments</Header>
                                            {comments.map((comment, index) => {
                                              return(
                                                <Comment.Group key={index}>
                                                  {comment.post_id === item._id ?
                                                  <Comment className="comment-box">
                                                    <Comment.Content className="comment-content">
                                                      {comment.profile_picture_url !== "https://gruppe1.testsites.info/uploads/posts/" ? <div><Image className="comments-user-image" src={comment.profile_picture_url} /></div> : <div><Image className="comments-user-image" src="/assets/images/user.png"></Image></div> }
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
                                                      {this.state.currentUserId === comment.author_id || this.state.currentUserIsAdmin ? <Button className="button-upload delete-button-comment" onClick={((e) => this.handleDeleteComment(e, comment))} circular icon="delete" size="tiny"></Button> : null }

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


                                    <Form className="feed-comments-form" onSubmit={((e) => this.handleCreateComment(e, item, "image"))} reply>
                                      <Form.TextArea  class="commentInput" rows="1" placeholder="Add a comment.."/>
                                      <Button className="button-upload button-styles add-comment-button">
                                        <Icon name="send" />
                                      </Button>
                                      {this.state.showCommentUploadLimitMessage && this.state.currentPostId === item._id ? <Message negative><p>{this.state.commentUploadLimitMessage}</p></Message> : null}
                                    </Form>
                                  </Card.Content>
                                </Card>
                              </Card.Group>
                             </div>
                             )
                          })}
                        </Tab.Pane> },
                        { menuItem: 'Story', render: () => <Tab.Pane attached={false}>
                              {stories.map((item, index) =>
                              {return(
                                <div key={index} className="profile-card">
                                  <Card.Group>
                                    <Card fluid centered>
                                      <div className="username-label">
                                          {this.state.pictureExists ? <div><Image src={this.state.pictureURL} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                          <span className="content-card-username-label"> @{item.username} </span>
                                        {this.state.show || this.state.currentUserIsAdmin ? <Button onClick={((e) => this.handleDeleteStoryEntry(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                                        {this.state.show && this.state.updateItemId != item._id ? <Button onClick={((e) => this.handleOpenStoryUpdateWindow(e, item))} className="button-upload edit-button-guestbook" circular icon="edit" size="small"></Button> : null}
                                      </div>
                                      <Card.Content id="card-content">
                                        <Form onSubmit={((e) => this.handleUpdateStoryEntry(e, item))}>
                                          <Card.Header className="card-header">
                                              <Rating onRate={((e) => this.handleRateStoryEntry(e, item))} icon='heart' size="large" rating={item.current_user_has_liked} maxRating={1}></Rating>
                                              {this.state.updateItemId == item._id ? <Form.Field required ><Input  placeholder={this.state.storyTitle} value={this.state.storyTitle} onChange={(e) => this.handleChangeStoryData(e,"storyTitle")}/></Form.Field> : item.title}
                                                <div className="ui mini horizontal statistic post-likes">
                                                <div className="value">
                                                  {this.getNumberOfLikesOfStoryEntry(item)}
                                                </div>
                                                <div className="label">
                                                  Likes
                                                </div>
                                                <Button id="comments-button" className="button-upload" onClick={((e) =>  this.showOrHideComments(e, item, "Story"))}>
                                                  <Icon name="comment" />
                                                  <Icon name={this.state.commentStatusInStories[item.position]} />
                                                </Button>
                                            </div>
                                          </Card.Header>
                                          <Card.Meta className="card-meta">
                                            <span className='date'>
                                              {item.date_created}
                                              {item.updated ? <p>(edited)</p> :  null}
                                            </span>
                                          </Card.Meta>
                                          <Card.Description className="content-card-description">
                                          {this.state.updateItemId == item._id ? <TextArea required placeholder={this.state.storyContent} value={this.state.storyContent} onChange={(e) => this.handleChangeStoryData(e,"storyContent")}></TextArea> : item.content}
                                          <div className="profile-edit-buttons">
                                            {this.state.updateItemId == item._id ? <Button className="button-upload save-button-guestbook">Save</Button> : null}
                                            {this.state.updateItemId == item._id ? <Button onClick={((e) => this.handleCancelUpdateStoryEntry(e, item))} className="button-upload save-button-guestbook">Cancel</Button> : null}
                                          </div>
                                          {this.state.showUpdateStoryErrorMessage && this.state.updateItemId == item._id ? <Message negative><p>Error while updating this story!</p></Message> : null}
                                          </Card.Description>
                                        </Form>
                                      </Card.Content>
                                    </Card>
                                    <Card fluid centered className="comment-card">
                                      <Card.Content className="feed-comment-content">
                                          {this.state.showOrHideCommentsInStories[item.position] ?
                                              <div>
                                                  <Header as='h3' dividing >Comments</Header>
                                                  {comments.map((comment, index) => {
                                                    return(
                                                      <Comment.Group key={index}>
                                                        {comment.post_id === item._id ?
                                                        <Comment className="comment-box">
                                                          <Comment.Content className="comment-content">
                                                            {comment.profile_picture_url !== "https://gruppe1.testsites.info/uploads/posts/" ? <div><Image className="comments-user-image" src={comment.profile_picture_url} /></div> : <div><Image className="comments-user-image" src="/assets/images/user.png"></Image></div> }
                                                            <div className="comment-header">
                                                                <Comment.Author className="comment-author">
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
                                                            {this.state.currentUserId === comment.author_id || this.state.currentUserIsAdmin ?  <Button className="button-upload delete-button-comment" onClick={((e) => this.handleDeleteComment(e, comment))} circular icon="delete" size="tiny"></Button> : null }

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

                                        <Form className="feed-comments-form" onSubmit={((e) => this.handleCreateComment(e, item, "story"))} reply>
                                          <Form.TextArea class="commentInput" rows="1" placeholder="Add a comment.."/>
                                          <Button className="button-upload button-styles add-comment-button">
                                            <Icon name="send" />
                                          </Button>
                                          {this.state.showCommentUploadLimitMessage && this.state.currentPostId === item._id ? <Message negative><p>{this.state.commentUploadLimitMessage}</p></Message> : null}
                                        </Form>
                                      </Card.Content>
                                    </Card>
                                  </Card.Group>
                                 </div>
                                 )
                              })}

                        </Tab.Pane> },
                        { menuItem: 'Guestbook', render: () => <Tab.Pane attached={false}>
                        <div>
                          {!this.state.show ?
                            <Card.Group id="guestbook-wrapper">
                              <Card fluid centered>
                                <div className="username-label">
                                Add a new guestbook post
                                </div>
                                <Card.Content id="card-content">
                                  <Form reply id="guestbook-reply" onSubmit={this.handleCreateGuestbookEntry.bind(this)}>
                                    <Form.Field>
                                      <Input placeholder="Titel" value={this.state.guestbookEntryTitle} onChange={(e) => this.handleChangeGuestbookEntryInput(e,"guestbookEntryTitle")}/>
                                    </Form.Field>
                                    <Form.TextArea required placeholder="What do you want to say?" autoHeight rows="3" value={this.state.guestbookEntryContent} onChange={(e) => this.handleChangeGuestbookEntryInput(e,"guestbookEntryContent")}/>
                                    {this.state.showGuestbookEntryUploadLimitMessage ? <Message negative><p>{this.state.guestbookEntryUploadLimitMessage}</p></Message> : null}
                                    <Button className="button-styles mobile-button-border">Add Posts</Button>
                                  </Form>
                                </Card.Content>
                              </Card>
                            </Card.Group>
                          : null }
                          {guestbookEntries.map((item, index) => {
                            return(
                              <div key={index} className="profile-card">
                                <Card.Group>
                                  <Card fluid centered>
                                    <div className="username-label">
                                      {item.profile_picture_url !== "https://gruppe1.testsites.info/uploads/posts/" ? <div><Image src={item.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                        <Link to={`/profile/${item.username}`} onClick={window.location.reload}>
                                          <span className="content-card-username-label"> @{item.username} </span>
                                        </Link>
                                      {this.state.show || this.state.currentUserIsAdmin ? <Button onClick={((e) => this.handleDeleteGuestbookEntry(e, item))}  className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                                    </div>
                                    <Card.Content id="card-content">
                                      <Card.Header className="card-header">
                                          <Rating onRate={((e) => this.handleRateGuestbookEntry(e, item))} icon='heart' size="large" rating={item.current_user_has_liked} maxRating={1}>
                                          </Rating> {item.title}
                                          <div className="ui mini horizontal statistic post-likes">
                                            <div className="value">
                                              {this.getNumberOfLikesOfGuestbookEntry(item)}
                                            </div>
                                            <div className="label">
                                              Likes
                                            </div>
                                            <Button id="comments-button" className="button-upload" onClick={((e) => this.showOrHideComments(e, item, "Guestbook"))}>
                                              <Icon name="comment" />
                                              <Icon name={this.state.commentStatusInGuestbook[item.position]} />
                                            </Button>
                                        </div>
                                      </Card.Header>
                                      <Card.Meta className="card-meta">
                                        <span className='date'>
                                          {item.date_created}
                                        </span>
                                      </Card.Meta>
                                      <Card.Description className="content-card-description">
                                         {item.content}
                                      </Card.Description>
                                    </Card.Content>
                                  </Card>
                                  <Card fluid centered className="comment-card">
                                    <Card.Content className="feed-comment-content">
                                      {this.state.showOrHideCommentsInGuestbook[item.position] ?
                                          <div>
                                            <Header as='h3' dividing>Comments</Header>
                                              {comments.map((comment, index) => {
                                                return(
                                                  <Comment.Group key={index}>
                                                    {comment.post_id === item._id ?
                                                    <Comment className="comment-box">
                                                      <Comment.Content className="comment-content">
                                                        {comment.profile_picture_url !== "https://gruppe1.testsites.info/uploads/posts/" ? <div><Image className="comments-user-image" src={comment.profile_picture_url} /></div> : <div><Image className="comments-user-image" src="/assets/images/user.png"></Image></div> }
                                                        <div className="comment-header">
                                                            <Comment.Author className="comment-author">
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
                                                        {this.state.currentUserId === comment.author_id || this.state.currentUserIsAdmin ? <Button className="button-upload delete-button-comment" onClick={((e) => this.handleDeleteComment(e, comment))} circular icon="delete" size="tiny"></Button> : null }

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

                                      <Form className="feed-comments-form" onSubmit={((e) => this.handleCreateComment(e, item, "guestbook"))} reply>
                                        <Form.TextArea class="commentInput" rows="1" placeholder="Add a comment.."/>
                                          <Button className="button-upload button-styles add-comment-button">
                                            <Icon name="send" />
                                          </Button>
                                          {this.state.showCommentUploadLimitMessage && this.state.currentPostId === item._id ? <Message negative><p>{this.state.commentUploadLimitMessage}</p></Message> : null}
                                      </Form>
                                    </Card.Content>
                                  </Card>
                                </Card.Group>
                              </div>
                            )
                          })}
                        </div>

                        </Tab.Pane> },
                      ]
                      } />
              </div>
          </div>

        )
    }
}



export default Profile;

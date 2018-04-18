import React, {Component} from 'react';
import { Input, Tab, Card, Image, Comment, Rating, Form, Button, Message, Header } from 'semantic-ui-react'
import { checkSession, getStoryForUserId, getImagesForUserId, getGuestbookEntriesForUserId, getCurrentUser} from '../API/GET/GetMethods';
import {likeStoryEntryById, likeImageById, deleteStoryEntryById, deleteImageById, createGuestbookentry, deleteGuestbookEntryById, likeGuestbookEntryById, getStoryEntryById, getImageById } from '../API/POST/PostMethods';
import { Redirect, Link } from 'react-router-dom';
import SidebarProfile from '../Components/SidebarProfile'
import ProfileHeader from '../Components/ProfileHeader'
import '../profileStyle.css';
import { updateStoryEntry, updateImage } from '../API/PUT/PutMethods';

var images = [];
var stories = [];
var guestbookEntries = [];
var comments = [];

class Profile extends Component {
  constructor(props) {
      super(props);

      this.state = {
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
        showUpdateImageErrorMessage: false
      }

      this.apiCheckSession = "/checkSession"
      this.apiDeleteSession = "/deleteSession";
      this.apiStories = "/story/list";
      this.apiImages = "/image/list";
      this.apiUser = "/getUserInfo"
      this.apiGuestbookEntries = "/guestbook/list";

      this.property = props.match.params.username;
      this.ownerName = props.match.params.username;
      this.getProfileData(this.property);
      this.checkThisSession();

      if(this.property === undefined) {
          this.pageTitle = "My Profile "
      } else {
          this.pageTitle = "Profile of user: " + this.property
      }
      document.title = this.pageTitle;
  }

    async checkThisSession() {
      const response = await checkSession(this.apiCheckSession);
      if(response.message !== "User is authorized") {
          this.setState({redirectToLogin: true})
      }
    }

      async getProfileData(username) {
        if(username === undefined) {
            const responseStories = await getStoryForUserId(this.apiStories);
            const responseImages = await getImagesForUserId(this.apiImages);
            const responseGuestbookEntries = await getGuestbookEntriesForUserId(this.apiGuestbookEntries);
            this.setState({
              responseStories : responseStories,
              responseImages : responseImages,
              responseGuestbookEntries : responseGuestbookEntries
            });

            responseStories.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
            });
            responseImages.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
            });
            responseGuestbookEntries.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
            });

            const responseMyData = await checkSession(this.apiCheckSession);

            const response = await getCurrentUser(this.apiUser);
            this.setState({username: response.username})
            this.setState({picture: response.picture})
            this.setState({pictureURL: response.pictureURL})

            if(this.state.picture) {
                this.setState({pictureExists: true})
            }

            if(responseMyData.username === this.state.username) {
                this.setState({ show: true});
            } else {
                this.setState({ show: false});
            }

        } else {
            let apiStoriesWithUsername = this.apiStories + "?username=" + username;
            let apiImagesWithUsername = this.apiImages + "?username=" + username;
            let apiGuestbookEntriesWithUsername = this.apiGuestbookEntries + "?username=" + username;
            const responseStories = await getStoryForUserId(apiStoriesWithUsername);
            const responseImages = await getImagesForUserId(apiImagesWithUsername);
            const responseGuestbookEntries = await getGuestbookEntriesForUserId(apiGuestbookEntriesWithUsername);
            this.setState({
              responseStories : responseStories,
              responseImages : responseImages,
              responseGuestbookEntries : responseGuestbookEntries
            });

            responseStories.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
            });
            responseImages.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
            });
            responseGuestbookEntries.map(item => {
              item.number_of_likes_in_state = item.number_of_likes;
            });

            const responseMyData = await checkSession(this.apiCheckSession);

            let api = this.apiUser + "?username=" + username;
            const response = await getCurrentUser(api);
            this.setState({username: response.username})
            this.setState({picture: response.picture})
            this.setState({pictureURL: response.pictureURL})

            if(this.state.picture) {
                this.setState({pictureExists: true})
            }

            if(responseMyData.username === this.state.username) {
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

        const response = await createGuestbookentry(
          "/guestbook/create",
            this.state.newGuestbookEntryTitle,
            this.state.newGuestbookEntryContent,
            this.ownerName
        );
        window.location.reload();
      }

      async handleRateStoryEntry(event, data){
        event.preventDefault();
        this.state.entryId = data._id;
        const responseStories = await likeStoryEntryById("/story/like",this.state.entryId);

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
        const responseImages = await likeImageById("/image/like",this.state.entryId);

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
        const responseGuestbookEntries = await likeGuestbookEntryById("/guestbook/like",this.state.entryId);

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
        const response = await deleteImageById("/image/delete",data._id);
        this.getProfileData(this.property);
      }

      async handleDeleteStoryEntry(event, data) {
        const response = await deleteStoryEntryById("/story/delete", data._id);
        this.getProfileData(this.property);
      }

      async handleDeleteGuestbookEntry(event, data) {
        const response = await deleteGuestbookEntryById("/guestbook/delete",data._id);
        this.getProfileData(this.property);
      }

      async handleOpenStoryUpdateWindow(event, data) {
        const response = await getStoryEntryById("/story/getEntry", data._id);
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
          default: null;
        }
      }

      async handleUpdateStoryEntry(event, data) {
        event.preventDefault();
        const storyId = data._id;
        const title = event.target[0].value;
        const content = event.target[1].value;
        const response = await updateStoryEntry("/story/edit", storyId, title, content);
        this.setState({statusUpdateStoryEntry: response});

        if(this.state.statusUpdateStoryEntry) {
          this.setState({ updateItemId: ""});
        } else {
          this.setState({ showUpdateStoryErrorMessage: true });
        }
      }

      handleCancelUpdateStoryEntry(event, data) {
        this.setState({ updateItemId: ""});
      }


      async handleOpenImageUpdateWindow(event, data) {
        const response = await getImageById("/image/get", data._id);
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
          default: null;
        }
      }

      async handleUpdateImage(event, data) {
        event.preventDefault();
        const imageId = data._id;
        const title = event.target[0].value;
        const content = event.target[1].value;
        const response = await updateImage("/image/edit", imageId, title, content);
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


    render() {

    const { redirectToLogin } = this.state;
    if (redirectToLogin) {
        return <Redirect to='/login' />;
    }

      images = this.state.responseImages;
      stories = this.state.responseStories;
      guestbookEntries = this.state.responseGuestbookEntries;

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
                                    {this.state.show ? <Button onClick={((e) => this.handleDeleteImage(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
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
                                        {this.state.updateItemId == item._id ? <Button onClick={((e) => this.handleCancelUpdateImage(e, item))} className="button-upload save-button-guestbook">Cancel</Button> : null}
                                        {this.state.showUpdateImageErrorMessage && this.state.updateItemId == item._id ? <Message negative><p>Error while updating this image!</p></Message> : null}
                                      </Card.Description>
                                    </Form>
                                    <Header as='h4' dividing>Comments</Header>
                                    {comments.map((comment, index) => {
                                      return(
                                        <Comment.Group>
                                          {comment.post_id === item._id ?
                                          <Comment>
                                            <Comment.Avatar src='/assets/images/boy.png' />
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
                                    <Form onSubmit={((e) => this.handleCreateComment(e, item))} reply>
                                      <Form.TextArea value={this.state.commentInput}/>
                                      <Button className="button-upload" content='Add Reply' labelPosition='left' icon='edit'/>
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
                                        {this.state.show ? <Button onClick={((e) => this.handleDeleteStoryEntry(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
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
                                            </div>
                                          </Card.Header>
                                          <Card.Meta className="card-meta">
                                            <span className='date'>
                                              {item.date_created}
                                              {item.updated ? <p>(edited)</p> :  null}
                                            </span>
                                          </Card.Meta>
                                          <Card.Description>
                                          {this.state.updateItemId == item._id ? <Input required placeholder={this.state.storyContent} value={this.state.storyContent} onChange={(e) => this.handleChangeStoryData(e,"storyContent")} /> : item.content}
                                          {this.state.updateItemId == item._id ? <Button className="button-upload save-button-guestbook">Save</Button> : null}
                                          {this.state.updateItemId == item._id ? <Button onClick={((e) => this.handleCancelUpdateStoryEntry(e, item))} className="button-upload save-button-guestbook">Cancel</Button> : null}
                                          {this.state.showUpdateStoryErrorMessage && this.state.updateItemId == item._id ? <Message negative><p>Error while updating this story!</p></Message> : null}
                                          </Card.Description>
                                        </Form>
                                        <Header as='h4' dividing>Comments</Header>
                                        {comments.map((comment, index) => {
                                          return(
                                            <Comment.Group>
                                              {comment.post_id === item._id ?
                                              <Comment>
                                                <Comment.Avatar src='/assets/images/boy.png' />
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
                                        <Form onSubmit={((e) => this.handleCreateComment(e, item))} reply>
                                          <Form.TextArea value={this.state.commentInput}/>
                                          <Button className="button-upload" content='Add Reply' labelPosition='left' icon='edit'/>
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

                          {guestbookEntries.map((item, index) => {
                            return(
                              <div key={index} className="profile-card">
                                <Card.Group>
                                  <Card fluid centered>
                                    <div className="username-label">
                                      {item.profile_picture_url !== "/uploads/posts/" ? <div><Image src={item.profile_picture_url} className="user-card-avatar"/></div> : <div><Image className="user-card-avatar" src="/assets/images/user.png"></Image></div> }
                                        <Link to={`/profile/${item.username}`} onClick={window.location.reload}>
                                          <span className="content-card-username-label"> @{item.username} </span>
                                        </Link>
                                      {this.state.show ? <Button onClick={((e) => this.handleDeleteGuestbookEntry(e, item))}  className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
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
                                      <Header as='h4' dividing>Comments</Header>
                                      {comments.map((comment, index) => {
                                        return(
                                          <Comment.Group>
                                            {comment.post_id === item._id ?
                                            <Comment>
                                              <Comment.Avatar src='/assets/images/boy.png' />
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
                                      <Form onSubmit={((e) => this.handleCreateComment(e, item))} reply>
                                        <Form.TextArea value={this.state.commentInput}/>
                                        <Button className="button-upload" content='Add Reply' labelPosition='left' icon='edit'/>
                                      </Form>
                                    </Card.Content>
                                  </Card>
                                </Card.Group>
                              </div>
                            )
                          })}

                          {!this.state.show ?
                           <Form reply id="guestbook-reply" onSubmit={this.handleCreateGuestbookEntry.bind(this)}>
                             <Form.Field>
                               <label>Title of your guestbook entry</label>
                               <Input placeholder="Titel"/>
                             </Form.Field>
                             <Form.TextArea required autoHeight rows="3" />
                             <Button content='Add Reply' className="button-upload" labelPosition='left' icon='edit' type="submit" />
                           </Form>
                           : null }
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

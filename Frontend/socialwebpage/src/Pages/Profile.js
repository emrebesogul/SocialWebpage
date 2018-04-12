import React, {Component} from 'react';
import { Input, Tab, Card, Image, Comment, Rating, Form, Button, Message } from 'semantic-ui-react'
import { checkSession, getStoryForUserId, getImagesForUserId, getGuestbookEntriesForUserId, getCurrentUser} from '../API/GET/GetMethods';
import {likeStoryEntryById, likeImageById, deleteStoryEntryById, deleteImageById, createGuestbookentry, deleteGuestbookEntryById, likeGuestbookEntryById, getStoryEntryById} from '../API/POST/PostMethods';
import { Redirect, Link } from 'react-router-dom';
import SidebarProfile from '../Components/Sidebar'
import ProfileHeader from '../Components/ProfileHeader'

import '../profileStyle.css';
import { updateStoryEntry } from '../API/PUT/PutMethods';

var images = [];
var stories = [];
var guestbookEntries = [];

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
        showUpdateStoryErrorMessage: false
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

            const responseMyData = await checkSession(this.apiCheckSession);

            const response = await getCurrentUser(this.apiUser);
            this.setState({username: response.username})

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

            const responseMyData = await checkSession(this.apiCheckSession);

            let api = this.apiUser + "?username=" + username;
            const response = await getCurrentUser(api);
            this.setState({username: response.username})

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
        const response = await likeStoryEntryById("/story/like",this.state.entryId);
      }

      async handleRateImage(event, data){
        event.preventDefault();
        this.state.entryId = data._id;
        const response = await likeImageById("/image/like",this.state.entryId);
      }

      async handleRateGuestbookEntry(event, data){
        event.preventDefault();
        this.state.entryId = data._id;
        const response = await likeGuestbookEntryById("/guestbook/like",this.state.entryId);
        window.location.reload();
      }

      async handleDeleteImage(event, data) {
        const response = await deleteImageById("/image/delete",data._id);
        window.location.reload();
      }

      async handleDeleteStoryEntry(event, data) {
        const response = await deleteStoryEntryById("/story/delete", data._id);
        window.location.reload();
      }

      async handleDeleteGuestbookEntry(event, data) {
        const response = await deleteGuestbookEntryById("/guestbook/delete",data._id);
        window.location.reload();
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
                                    <Image src="/assets/images/boy.png" className="user-card-avatar"/>
                                    <span className="content-card-username-label"> @{item.username} </span>
                                    {this.state.show ? <Button onClick={((e) => this.handleDeleteImage(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                                  </div>
                                  <Image className="image-feed" src={item.src} />
                                  <Card.Content id="card-content">
                                    <Card.Header className="card-header">
                                      <Rating onRate={((e) => this.handleRateImage(e, item))} icon='heart' size="large" defaultRating={item.current_user_has_liked} maxRating={1}>
                                      </Rating> {item.title}
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
                        { menuItem: 'Story', render: () => <Tab.Pane attached={false}>


                              {stories.map((item, index) =>
                              {return(
                                <div key={index} className="profile-card">
                                  <Card.Group>
                                    <Card fluid centered>
                                      <div className="username-label">
                                          <Image src="/assets/images/boy.png" className="user-card-avatar"/>
                                          <span className="content-card-username-label"> @{item.username} </span>
                                        {this.state.show ? <Button onClick={((e) => this.handleDeleteStoryEntry(e, item))} className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                                        {this.state.show && this.state.updateItemId != item._id ? <Button onClick={((e) => this.handleOpenStoryUpdateWindow(e, item))} className="button-upload edit-button-guestbook" circular icon="edit" size="small"></Button> : null}
                                      </div>
                                      <Card.Content id="card-content">

                                        <Form onSubmit={((e) => this.handleUpdateStoryEntry(e, item))}>
                                          <Card.Header className="card-header">
                                              <Rating onRate={((e) => this.handleRateStoryEntry(e, item))} icon='heart' size="large" defaultRating={item.current_user_has_liked} maxRating={1}></Rating>
                                              {this.state.updateItemId == item._id ? <Form.Field required ><Input  placeholder={this.state.storyTitle} value={this.state.storyTitle} onChange={(e) => this.handleChangeStoryData(e,"storyTitle")}/></Form.Field> : item.title}
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
                                          {this.state.updateItemId == item._id ? <Input required placeholder={this.state.storyContent} value={this.state.storyContent} onChange={(e) => this.handleChangeStoryData(e,"storyContent")} /> : item.content}
                                          {this.state.updateItemId == item._id ? <Button className="button-upload save-button-guestbook">Save</Button> : null}
                                          {this.state.updateItemId == item._id ? <Button onClick={((e) => this.handleCancelUpdateStoryEntry(e, item))} className="button-upload save-button-guestbook">Cancel</Button> : null}
                                          {this.state.showUpdateStoryErrorMessage && this.state.updateItemId == item._id ? <Message negative><p>Error while updating this story!</p></Message> : null}
                                          </Card.Description>
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
                                      <Image src="/assets/images/boy.png" className="user-card-avatar"/>
                                        <Link to={`/profile/${item.username}`} onClick={window.location.reload}>
                                          <span className="content-card-username-label"> @{item.username} </span>
                                        </Link>
                                      {this.state.show ? <Button onClick={((e) => this.handleDeleteStoryEntry(e, item))}  className="button-upload delete-button-guestbook" circular icon="delete" size="small"></Button> : null}
                                    </div>
                                    <Card.Content id="card-content">
                                      <Card.Header className="card-header">
                                          <Rating onRate={((e) => this.handleRateStoryEntry(e, item))} icon='heart' size="large" defaultRating={item.current_user_has_liked} maxRating={1}>
                                          </Rating> {item.title}
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

                              {/*  <Comment.Group>
                                  <Comment>
                                    <Comment.Avatar src='/assets/images/boy.png' id="comment-avatar" />
                                    <Comment.Content>
                                      <Rating onRate={((e) => this.handleRateGuestbookEntry(e, item))} icon='heart' size="large" defaultRating={item.current_user_has_liked} maxRating={1}>
                                      </Rating> <span>&nbsp;</span>
                                      <div className="ui mini horizontal statistic post-likes">
                                        <div className="value">
                                          {item.number_of_likes}
                                        </div>
                                        <div className="label">
                                          Likes
                                        </div>
                                      </div>
                                      <Comment.Author as='a'><h3><i>{item.title}</i></h3></Comment.Author>
                                      <Comment.Author>posted by {item.username}</Comment.Author>
                                      <Comment.Metadata id="comment-metadata">
                                        <div>{item.date_created}</div>
                                      </Comment.Metadata>
                                      {this.state.show ? <Button onClick={((e) => this.handleDeleteGuestbookEntry(e, item))} id="delete-button" circular icon="delete" size="small"></Button> : null}

                                      <Comment.Text id="comment-content">{item.content}</Comment.Text>
                                    </Comment.Content>
                                  </Comment>
                                </Comment.Group> */}
                              </div>
                            )
                          })}


                           <Form reply id="guestbook-reply" onSubmit={this.handleCreateGuestbookEntry.bind(this)}>
                             <Form.Field>
                               <label>Title of your guestbook entry</label>
                               <Input placeholder="Titel"/>
                             </Form.Field>
                             <Form.TextArea autoHeight rows="3" />
                             <Button content='Add Reply' className="button-upload" labelPosition='left' icon='edit' type="submit" />
                           </Form>
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

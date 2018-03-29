import React, {Component} from 'react';
import { Tab, Card, Image, Comment, Rating, Form, Button } from 'semantic-ui-react'
import { checkSession, getStoryForUserId, getImagesForUserId} from '../API/GET/GetMethods';
import {likeStoryEntryById, likeImageById, deleteStoryEntryById, deleteImageById} from '../API/POST/PostMethods';
import SidebarProfile from '../Components/SidebarProfile'
import ProfileHeader from '../Components/ProfileHeader'

import '../profileStyle.css';

var images;
var stories;

class Profile extends Component {
  constructor(props) {
      super(props);

      this.state = {
        show: false,
        responseImages: [],
        responseStories: [],
        redirectToLogin: false,
        rerender: false
      }

      this.apiCheckSession = "/checkSession"
      this.apiDeleteSession = "/deleteSession";

      this.apiStories = "/story/list";
      this.apiImages = "/image/list";

      this.api = "/story/list";
      this.property = props.match.params.username;

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
            this.setState({
              responseStories : responseStories,
              responseImages : responseImages
            });
        } else {
            let apiStoriesWithUsername = this.apiStories + "?username=" + username;
            let apiImagesWithUsername = this.apiImages + "?username=" + username;
            const responseStories = await getStoryForUserId(apiStoriesWithUsername);
            const responseImages = await getImagesForUserId(apiImagesWithUsername);
            this.setState({
              responseStories : responseStories,
              responseImages : responseImages
            });
        }
        if(username === this.state.responseImages.username) {
            this.setState({ show: true});
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

        window.location.reload();
        // Redirect to feed if respose is message is true
        // this.setState({status: response});
        // if(this.state.status === true) {
        //     this.setState({ redirectToFeed: true });
        // } else {
        //     let errorField = document.getElementById("error-message-upload-story");
        //     errorField.style.display = "block";
        // }
      }

      async handleDeleteImage(event, data) {
        const response = await deleteImageById(
          "/image/delete",
          data._id
        );
        window.location.reload();
      }

      async handleDeleteStoryEntry(event, data) {
        const response = await deleteStoryEntryById(
          "/story/delete",
          data._id
        );
        window.location.reload();
      }

    render() {

      images = this.state.responseImages;
      stories = this.state.responseStories;

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
                            <div key={index} id="profile-card">
                              <Card.Group>
                                <Card fluid centered>
                                  <div className="username-label">
                                    <span > @{item.username} </span>
                                    {this.state.show ? <Button onClick={((e) => this.handleDeleteImage(e, item))} id="delete-button" circular icon="delete" size="small"></Button> : null}

                                  </div>
                                  <Image className="image-feed" src={item.src} />
                                  <Card.Content id="card-content">
                                    <Card.Header className="card-header">
                                      <Rating onRate={((e) => this.handleRate(e, item))} icon='heart' size="large" defaultRating={item.current_user_has_liked} maxRating={1}>
                                      </Rating> {item.title}
                                        <div className="ui mini horizontal statistic post-likes">
                                          <div className="value">
                                            {item.number_of_likes}
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
                                <div key={index}>
                                  <Card.Group>
                                    <Card fluid centered>
                                      <div className="username-label">
                                        <span > @{item.username} </span>


                                        {this.state.show ? <Button onClick={((e) => this.handleDeleteStoryEntry(e, item))} id="delete-button" circular icon="delete" size="small"></Button> : null}

                                      </div>
                                      <Card.Content id="card-content">
                                        <Card.Header className="card-header">
                                            <Rating onRate={((e) => this.handleRate(e, item))} icon='heart' size="large" defaultRating={item.current_user_has_liked} maxRating={1}>
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
                        { menuItem: 'Guestbook', render: () => <Tab.Pane attached={false}>
                        <div className="settings">
                        <Comment.Group className="account-settings profile-comments">
                           <Comment>
                             <Comment.Avatar src='/assets/images/boy.png' />
                             <Comment.Content>
                               <Comment.Author as='a'>Matt</Comment.Author>
                               <Comment.Metadata>
                                 <div>Today at 5:42PM</div>
                               </Comment.Metadata>
                               <Comment.Text>How artistic!</Comment.Text>
                               <Comment.Actions>
                                 <Comment.Action>Reply</Comment.Action>
                               </Comment.Actions>
                             </Comment.Content>
                           </Comment>

                           <Comment>
                             <Comment.Avatar src='/assets/images/boy.png' />
                             <Comment.Content>
                               <Comment.Author as='a'>Elliot Fu</Comment.Author>
                               <Comment.Metadata>
                                 <div>Yesterday at 12:30AM</div>
                               </Comment.Metadata>
                               <Comment.Text>
                                 <p>This has been very useful for my research. Thanks as well!</p>
                               </Comment.Text>
                               <Comment.Actions>
                                 <Comment.Action>Reply</Comment.Action>
                               </Comment.Actions>
                             </Comment.Content>
                             <Comment.Group>
                               <Comment>
                                 <Comment.Avatar src='/assets/images/girl.png' />
                                 <Comment.Content>
                                   <Comment.Author as='a'>Jenny Hess</Comment.Author>
                                   <Comment.Metadata>
                                     <div>Just now</div>
                                   </Comment.Metadata>
                                   <Comment.Text>
                                     Elliot you are always so right :)
                                   </Comment.Text>
                                   <Comment.Actions>
                                     <Comment.Action>Reply</Comment.Action>
                                   </Comment.Actions>
                                 </Comment.Content>
                               </Comment>
                             </Comment.Group>
                           </Comment>

                           <Comment>
                             <Comment.Avatar src='/assets/images/girl.png' />
                             <Comment.Content>
                               <Comment.Author as='a'>Joe Henderson</Comment.Author>
                               <Comment.Metadata>
                                 <div>5 days ago</div>
                               </Comment.Metadata>
                               <Comment.Text>
                                 Dude, this is awesome. Thanks so much
                               </Comment.Text>
                               <Comment.Actions>
                                 <Comment.Action>Reply</Comment.Action>
                               </Comment.Actions>
                             </Comment.Content>
                           </Comment>

                           <Form reply>
                             <Form.TextArea autoHeight rows="3" />
                             <Button content='Add Reply' labelPosition='left' icon='edit' />
                           </Form>
                          </Comment.Group>
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

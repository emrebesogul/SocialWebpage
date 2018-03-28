import React, {Component} from 'react';
import { Tab, Card, Image, Comment, Header, Rating, Form, Button, Icon } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom';
import {callFetch, checkSession, deleteSession, getStoryForUserId, getImagesForUserId} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'
import ProfileHeader from '../Components/ProfileHeader'

import '../profileStyle.css';

var images;
var stories;

class Profile extends Component {
  constructor(props) {
      super(props);

      this.state = {
        responseImages: [],
        responseStories: [],
        redirectToLogin: false
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
        console.log("Username: " + username)
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
      }

    render() {

      images = this.state.responseImages;
      stories = this.state.responseStories;

        return (
          <div className="feed">

              <Sidebar />
              <ProfileHeader name={this.property}/>

              <div id="profile-content">
                  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
              </div>
          </div>

        )
    }
}

const panes = [
  { menuItem: 'Gallery', render: () => <Tab.Pane attached={false}>

  <Card.Group>
    {images.map((item, index) =>
    {return(
      <div key={index} id="profile-card">
        <Card fluid centered>
          <div className="username-label">
            <span > @{item.username} </span>
            <Button id="delete-button" circular icon="delete" size="small"></Button>
          </div>
          <Image className="image-feed" src={item.src} />
          <Card.Content id="card-content">
            <Card.Header className="card-header">
                <Rating icon='heart' size="large" defaultRating={0} maxRating={1}>
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
       </div>
       )
    })}

</Card.Group>

  </Tab.Pane> },
  { menuItem: 'Story', render: () => <Tab.Pane attached={false}>


        {stories.map((item, index) =>
        {return(
          <div key={index}>
            <Card.Group>
              <Card fluid centered>
                <div className="username-label">
                  <span > @{item.username} </span>
                  <Button id="delete-button" circular icon="delete" size="small"></Button>
                </div>
                <Card.Content id="card-content">
                  <Card.Header className="card-header">
                      <Rating icon='heart' size="large" defaultRating={0} maxRating={1}>
                      </Rating> {item.title}
                      <div class="ui mini horizontal statistic post-likes">
                        <div class="value">
                          {item.number_of_likes}
                        </div>
                        <div class="label">
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
       <Form.TextArea autoHeight="true" rows="3" />
       <Button content='Add Reply' labelPosition='left' icon='edit' />
     </Form>
    </Comment.Group>
  </div>

  </Tab.Pane> },
]


export default Profile;

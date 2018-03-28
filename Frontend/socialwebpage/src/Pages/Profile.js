import React, {Component} from 'react';
import { Tab, Card, Image, Comment, Header, Rating, Form, Button, Icon } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom';
import {callFetch, checkSession, deleteSession, getStoryForUserId} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'

import '../profileStyle.css';

var images;
var stories;
var username;

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
      this.api = "/story/list";

      this.getProfileData(props.match.params.username);
      this.checkThisSession();

      this.pageTitle = "Social Webpage Home"
      document.title = this.pageTitle;
  }

    async checkThisSession() {
      const response = await checkSession(this.apiCheckSession);
      if(response.message !== "User is authorized") {
          this.setState({redirectToLogin: true})
      }
    }

      async getProfileData(username) {
        if(username == undefined) {
            const response = await getStoryForUserId(this.api);
            this.setState({responseStories : response});
        } else {
            let api = this.api + "?username=" + username;
            const response = await getStoryForUserId(api);
            this.setState({responseStories : response});
        }
      }

    render() {

      images = this.state.responseImages;
      stories = this.state.responseStories;

        return (
          <div className="feed">

              <Sidebar />

                <div id="profile-header">
                  <Header as='h2' size="huge" icon textAlign='center'>
                    <Icon name='user' circular />
                    <Header.Content>
                      Leonardo
                      <Header.Subheader>
                        Johannes Mändle
                      </Header.Subheader>
                      <Header.Subheader>
                        Bempflingen
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </div>
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
    {images.map(item =>
    {return(
      <div >
        <Card fluid="true" centered="true">
          <span className="username-label"> @{item.username} </span>
          <Image className="image-feed" src={item.src} />
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
       </div>
       )
    })}

</Card.Group>

  </Tab.Pane> },
  { menuItem: 'Story', render: () => <Tab.Pane attached={false}>


        {stories.map(item =>
        {return(
          <div>
            <Card.Group>
              <Card fluid="true" centered="true">
                <span className="username-label"> @{item.username} </span>
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

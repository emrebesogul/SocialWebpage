import React, {Component} from 'react';
import { Tab, Card, Image, Comment, Header, Rating, Form, Button, Icon } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom';
import {callFetch, checkSession, deleteSession} from '../API/GET/GetMethods';

import '../profileStyle.css';

var images;
var stories;

class Profile extends Component {
  constructor() {
      super();

      this.state = {
        responseImages: [],
        responseStories: [],
        redirectToLogin: false
      }

      this.apiCheckSession = "/checkSession"
      this.apiDeleteSession = "/deleteSession";

      this.checkThisSession();

      this.pageTitle = "Social Webpage Home"
      document.title = this.pageTitle;
  }

    async checkThisSession() {
      const response = await checkSession(this.apiCheckSession);
      if(response.message === "User is authorized") {
          console.log("Have fun...")
      } else {
          this.setState({redirectToLogin: true})
      }
      }

      handleLogout() {
          deleteSession(this.apiDeleteSession);
          this.setState({ redirectToLogin: true });
      }

  async getProfileData() {

    //response

    render() {

        const { redirectToLogin } = this.state;
         if (redirectToLogin) {
           return <Redirect to='/login'/>;
         }
       // const arr =[{name:"lars"}]
       //{arr.map(item =>

      images = this.state.responseImages;
      stories = this.state.responseStories;

        return (
          <div>

            <div id="mobile-header">
              <Link to="/">
                <Button circular size="medium" id="profile-button-mobile" icon>
                  <Icon className="menu-icons" name='feed' />
                  Feed
                </Button>
              </Link>

                <Button circular size="medium" id="logout-button-mobile" icon onClick={this.handleLogout.bind(this)}>
                  <Icon className="menu-icons" name='log out' />
                  Log out
                </Button>

            </div>
              <div id="profile">
                <div id="profile-header-button">
                <Link to="/">
                  <Button circular size="medium" id="profile-button" icon>
                    <Icon className="menu-icons" name='feed' />
                    Feed
                  </Button>
                </Link>

                  <Button circular size="medium" id="logout-button" icon onClick={this.handleLogout.bind(this)}>
                    <Icon className="menu-icons" name='log out' />
                    Log out
                  </Button>

              </div>
              </div>
                <div id="profile-header">
                  <Header as='h2' size="huge" icon textAlign='center'>
                    <Icon name='user' circular />
                    <Header.Content>
                      Leonardo_64
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
      <div id="card-content">
        <Card fluid="true" centered="true">
          <span className="username-label"> @{item.username} </span>
          <Image src={item.src} />
          <Card.Content>
            <Card.Header>
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
            <Card.Meta>
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
          <div id="card-content">
            <Card.Group>
              <Card fluid="true" centered="true">
                <span className="username-label"> @{item.username} </span>
                <Card.Content>
                  <Card.Header>
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
                  <Card.Meta>
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

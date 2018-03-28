import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Tab, Card, Image, Icon, Comment, Header, Rating, List, Form, Input, Label, Button } from 'semantic-ui-react'
import {fetchFeedData} from '../API/GET/GetMethods';

import {checkSession, deleteSession} from '../API/GET/GetMethods';
import '../profileStyle.css';

var arr;

class Profile extends Component {
    constructor() {
        super();

        this.getFeedData();

        this.state = {
          resArr: [],
          redirectToLogin: false,
          username: "emre"
        }

        this.apiCheckSession = "/checkSession";
        this.apiDeleteSession = "/deleteSession";

        this.checkThisSession();

        this.pageTitle = "Social Webpage Home";
        document.title = this.pageTitle;
    }

    async checkThisSession() {
        const response = await checkSession(this.apiCheckSession);
        if(response.message !== "User is authorized") {
            this.setState({redirectToLogin: true})
        }
    }

    handleLogout() {
        deleteSession(this.apiDeleteSession);
        this.setState({ redirectToLogin: true });
    }

   async getFeedData() {
        const response = await fetchFeedData("/feed");
        this.setState({resArr: response});
    }

    render() {
        const { redirectToLogin } = this.state;
         if (redirectToLogin) {
           return <Redirect to='/login'/>;
         }

        arr = this.state.resArr;

        return (
          <div id="main-content">
            <div className="feed">

              <div id="mobile-header">
                <Link to="/profile">
                  <Button circular size="medium" id="profile-button-mobile" icon>
                    <Icon className="menu-icons" name='user' />
                    Profile
                  </Button>
                </Link>

                <Button circular size="medium" id="logout-button-mobile" icon onClick={this.handleLogout.bind(this)}>
                    <Icon className="menu-icons" name='log out' />
                    Log out
                </Button>

              </div>

              <div className="feed-header">
                <div id="welcome-label">
                  <h4 id="welcome-label-header">Leonardo_64</h4>

                    <Link to="/profile">
                      <Button labelPosition="right"  size="medium" id="upload-button" icon>
                        <Icon className="menu-icons" size="large" name='user' />
                        Profile
                      </Button>
                    </Link>

                    <Link to="/">
                      <Button labelPosition="right"  size="medium" id="upload-button" icon>
                        <Icon className="menu-icons" size="large" name='feed' />
                        Feed
                      </Button>
                    </Link>

                    <Link to="/upload">
                      <Button labelPosition="right" size="medium" id="upload-button" icon>
                        <Icon className="menu-icons" size="large" name='upload' />
                        Upload Content
                      </Button>
                    </Link>
                    <Link to="/post">
                    <Button labelPosition="right" size="medium" id="upload-button" icon>
                      <Icon className="menu-icons" size="large" name='plus' />
                      Add Story
                    </Button>
                  </Link>

                  <div className="seperator"></div>

                  <Link to="/profile">
                    <Button labelPosition="right"  size="medium" id="upload-button" icon>
                      <Icon className="menu-icons" size="large" name='compass' />
                      Roadmap
                    </Button>
                  </Link>

                  <Link to="/profile">
                    <Button labelPosition="right"  size="medium" id="upload-button" icon>
                      <Icon className="menu-icons" size="large" name='group' />
                      About Us
                    </Button>
                  </Link>

                  <div className="seperator"></div>

                  <Button labelPosition="right" size="medium" id="logout-button" icon onClick={this.handleLogout.bind(this)}>
                      <Icon className="menu-icons" size="large" name='log out' />
                      Log out
                  </Button>
                </div>
              </div>

            </div>
            <div>

            </div>

            <div id="feed-content">
                  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
            </div>

          </div>
        );
    }


}

const panes = [
  { menuItem: 'Feed', render: () => <Tab.Pane attached={false}>
  <Link to="/upload">
    <Button circular size="medium" id="upload-button-mobile" icon>
      <Icon className="menu-icons" name='upload' />
      Upload Content
    </Button>
  </Link>
  <Link to="/post">
  <Button circular size="medium" id="upload-button-mobile" icon>
    <Icon className="menu-icons" name='plus' />
    Add Story
  </Button></Link>

<div>
  <getFeedData />
</div>


  {arr.map(item =>
  {return(
    <div id="feed-card">
      <Card.Group>
        <Card fluid="true" centered="true">
          <div className="username-label">
            <Link to={`/profile/${item.username}`}>
                <span > @{item.username} </span>
            </Link>
          </div>

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
      </Card.Group>
     </div>
     )
  })}
{/*
  <Card fluid="true" centered="true">
    <Image src='/assets/images/john-towner-154060-unsplash.jpg' />
    <Card.Content>
      <Card.Header>
          <Rating icon='heart' size="large" defaultRating={0} maxRating={1}/> Matthew
      </Card.Header>
      <Card.Meta>
        <span className='date'>
          March 15, 2018
        </span>
      </Card.Meta>
      <Card.Description>
        Matthew is a musician living in Nashville.
      </Card.Description>
      <Comment.Group>

      <Header as='h4' dividing>Comments</Header>
      <Comment>
        <Comment.Avatar src='/assets/images/bg.jpg' />
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
    </Comment.Group>
    </Card.Content>
  </Card>
  */}


  </Tab.Pane> },
  { menuItem: 'Friends', render: () => <Tab.Pane attached={false}>
  <div className="settings">
    <div id="friends">
      <List className="friend-list" relaxed divided>
        <List.Item>
          <Image size="tiny" avatar src='/assets/images/bg.jpg' />
          <List.Content>
            <List.Header as='a'>Rachel B.</List.Header>
            <List.Description>Last seen watching <a><b>Arrested Development</b></a> just now.</List.Description>
              <List.Description>Connected since May 21th, 2017</List.Description>
              <List.Description>4 mutual contacts</List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <Image avatar circular size="tiny" src='/assets/images/bg.jpg' />
          <List.Content>
            <List.Header as='a'>Jimmy Neutron</List.Header>
            <List.Description>Last seen watching Arrested Developmentjust now.</List.Description>
            <List.Description>Connected since May 20th, 2017</List.Description>
            <List.Description>22 mutual contacts</List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <Image size="tiny" avatar src='/assets/images/bg.jpg' />
          <List.Content>
            <List.Header as='a'>Conor McGregor</List.Header>
            <List.Description>Last seen watching <a><b>Arrested Development</b></a> just now.</List.Description>
              <List.Description>Connected since May 20th, 2018</List.Description>
              <List.Description>222 mutual contacts</List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <Image size="tiny" avatar src='/assets/images/bg.jpg' />
          <List.Content>
            <List.Header as='a'>Steve Jobs</List.Header>
            <List.Description>Last seen watching <a><b>Arrested Development</b></a> just now.</List.Description>
              <List.Description>Connected since May 20th, 2017</List.Description>
              <List.Description>22 mutual contacts</List.Description>
          </List.Content>
        </List.Item>
      </List>
    </div>
  </div>

  </Tab.Pane> },
  { menuItem: 'Settings', render: () => <Tab.Pane attached={false}>
  <div className="settings">
    <div className="account-settings">
      <Header as='h2' size="medium" icon textAlign="left">
      <Icon name='settings' id="settings-icon" />
      Account Settings
      <Header.Subheader>
        Manage your account settings and set e-mail preferences.
      </Header.Subheader>
      </Header>

      <Form >

        <Form.Field className="account-input" required>
          <Label basic="true" className="input-label">First Name</Label>
          <Input required  inverted className="account-input-text" placeholder='First name' />
          <Label basic="true" className="input-label">Last Name</Label>
          <Input required inverted className="account-input-text" placeholder='Last name' />
        </Form.Field>

        <Form.Field className="account-input" required>
          <Label basic="true" className="input-label">Username</Label>
          <Input required inverted className="account-input-text" placeholder='Username' />
          <Label basic="true" className="input-label">Password</Label>
          <Input required className="account-input-text" type="password" placeholder='Password' />
        </Form.Field>

        <Form.Field className="account-input" required>
          <Label basic="true" className="input-label">Email</Label>
          <Input required inverted className="account-input-text" iconPosition='left' placeholder='Email'>
             <Icon name='at' />
             <input />
           </Input>
        </Form.Field>

        <Button id="button-upload">Save</Button>
      </Form>

    </div>
    <div className="account-settings">
      <Header as='h2' size="medium" icon textAlign="left">
      <Icon name='user' id="settings-icon" />
      Profile Settings
      <Header.Subheader>
        Manage your profile settings and set e-mail preferences.
      </Header.Subheader>
      </Header>
    </div>
  </div>


  </Tab.Pane> },
]



/* {arr.map(item =>
{return(

   <div>{item.name}</div>
   )
})}

*/

export default Profile;

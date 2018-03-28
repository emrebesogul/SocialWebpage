import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Tab, Card, Image, Icon, Header, Rating, List, Form, Input, Label, Button } from 'semantic-ui-react'
import {fetchFeedData} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'

import {checkSession} from '../API/GET/GetMethods';
import '../profileStyle.css';

var arr;

class Profile extends Component {

  constructor() {
      super();

      this.getfeeddata();

      this.state = {
        resArr: []
      }

      this.apiCheckSession = "/checkSession";

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


 async getfeeddata() {
      const response = await fetchFeedData("/feed");
      this.setState({resArr: response});
  }

handleRate(){
  alert("hello");
}


    render() {

        arr = this.state.resArr;

        return (
          <div id="main-content">
            <div className="feed">
                 <Sidebar />
             </div>
                <div id="feed-content">
                      <Tab menu={{ secondary: true, pointing: true }} panes={
                        [
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

                        {/*
                          <div>
                            <getfeeddata />
                          </div>
                           */}


                          {arr.map(item =>
                          {return(
                            <div id="feed-card">
                              <Card.Group>
                                <Card fluid centered>
                                  <div className="username-label">
                                    <Link to={`/profile/${item.username}`}>
                                        <span > @{item.username} </span>
                                    </Link>
                                  </div>

                                  <Image className="image-feed" src={item.src} />
                                  <Card.Content id="card-content">
                                    <Card.Header className="card-header">
                                      <Rating onClick={this.handleRate} icon='heart' size="large" defaultRating={0} maxRating={1}>
                                      </Rating>
                                         {item.title}
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
                        } />
                </div>
          </div>
        );
    }
}

export default Profile;

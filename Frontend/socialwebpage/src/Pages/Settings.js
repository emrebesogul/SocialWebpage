<<<<<<< HEAD
import React from 'react';
import {Icon, Header,  Form, Input, Label, Button } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'

class Settings extends React.Component{


  render(){
    return(
      <div>
        <div className="feed">
          <Sidebar />
        </div>
        <div >
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
                  <Label basic className="input-label">First Name</Label>
                  <Input required  inverted className="account-input-text" placeholder='First name' />
                  <Label basic className="input-label">Last Name</Label>
                  <Input required inverted className="account-input-text" placeholder='Last name' />
                </Form.Field>

                <Form.Field className="account-input" required>
                  <Label basic className="input-label">Username</Label>
                  <Input required inverted className="account-input-text" placeholder='Username' />
                  <Label basic className="input-label">Password</Label>
                  <Input required className="account-input-text" type="password" placeholder='Password' />
                </Form.Field>

                <Form.Field className="account-input" required>
                  <Label basic className="input-label">Email</Label>
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
        </div>
      </div>
    )
  }
=======
import React, {Component} from 'react';
import { Tab, Card, Image, Icon, Header, Rating, List, Form, Input, Label, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom';
import {callFetch, checkSession, deleteSession, getStoryForUserId, getImagesForUserId} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'

import '../profileStyle.css';


class Settings extends Component {
  constructor(props) {
      super(props);

      this.state = {
        responseImages: [],
        responseStories: [],
        redirectToLogin: false
      }

      this.apiCheckSession = "/checkSession"

      this.checkThisSession();

      this.pageTitle = "Settings"
      document.title = this.pageTitle;
  }

    async checkThisSession() {
      const response = await checkSession(this.apiCheckSession);
      if(response.message !== "User is authorized") {
          this.setState({redirectToLogin: true})
      }
    }


    render() {
        return (
            <div id="main-content">
                <div className="feed">
                    <Sidebar />
                </div>

            </div>

        )
    }
>>>>>>> c75d81634ba53f3864eb104612cb5a66327292ba
}

export default Settings;

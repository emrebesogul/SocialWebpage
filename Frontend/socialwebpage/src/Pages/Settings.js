import React from 'react';
import {Icon, Header,  Form, Input, Label, Button, Message } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'
import {getCurrentUserData} from '../API/GET/GetMethods';
import {updateUserData} from '../API/PUT/PutMethods';

class Settings extends React.Component{
    constructor() {
        super();

        this.state = {
          showMessageSuccess: false,
          showMessageError: false,
          redirectToLogin: false,
          username: "Username",
          firstname: "First name",
          lastname: "Last name",
          email: "beast@hpe.com",
          message: "",
          messageDetail: "",
          rerender: false
        }
        this.api = "/getUserInfo"
        this.apiUpdate = "/user/edit"

        this.getCurrentUserData();
    }

    async getCurrentUserData() {
        const response = await getCurrentUserData(this.api);
        if(response) {
            this.setState({username: response.username})
            this.setState({firstname: response.firstname})
            this.setState({lastname: response.lastname})
            this.setState({email: response.email})
        }
    }

    handleAccountSettings(event) {
        event.preventDefault();

        let obj = new Object();
        obj.first_name  = event.target[0].value
        obj.last_name = event.target[1].value
        obj.username = event.target[2].value
        obj.password = event.target[3].value
        obj.email = event.target[4].value
        const jsonUserData= JSON.stringify(obj);

        updateUserData("/user/edit", jsonUserData);

        this.setState({ showMessageSuccess: true });
    }

handleChange(e, attribut) {
    switch(attribut) {
      case "firstname": this.setState({"firstname": e.target.value}); break;
      case "lastname":  this.setState({"lastname": e.target.value}); break;
      case "username": this.setState({"username": e.target.value}); break;
      case "email":  this.setState({"email": e.target.value}); break;
      default: null;
    }}


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

              <Form onSubmit={this.handleAccountSettings.bind(this)}>

                <Form.Field className="account-input" required >
                  <Label basic className="input-label">First name</Label>
                  <Input required inverted className="account-input-text" placeholder={this.state.firstname} value={this.state.firstname} onChange={(e) => this.handleChange(e,"firstname")} />
                  <Label basic className="input-label">Last name</Label>
                  <Input required inverted className="account-input-text" placeholder={this.state.lastname} value={this.state.lastname} onChange={(e) => this.handleChange(e,"lastname")} />
                </Form.Field>

                <Form.Field className="account-input">
                  <Label basic className="input-label">Username</Label>
                  <Input required inverted className="account-input-text" placeholder={this.state.username} value={this.state.username} onChange={(e) => this.handleChange(e,"username")}/>
                  <Label basic className="input-label">Password</Label>
                  <Input className="account-input-text" type="password" placeholder='Enter new password' />
                </Form.Field>

                <Form.Field className="account-input">
                  <Label basic className="input-label">Email</Label>
                  <Input required inverted className="account-input-text" iconPosition='left' placeholder={this.state.email} value={this.state.email} onChange={(e) => this.handleChange(e,"email")} >
                     <Icon name='at' />
                     <input />
                   </Input>
                </Form.Field>

                {this.state.showMessageSuccess ? <div><Message color='green'><p>User data was updated successfully.</p></Message></div> : null}

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
}

export default Settings;

import React from 'react';
import { Icon, Header,  Form, Input, Label, Button, Message } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'
import Dropzone from 'react-dropzone'
import { getUserData } from '../API/GET/GetMethods';
import { updateUserData } from '../API/PUT/PutMethods';
import { uploadProfilePicture } from '../API/POST/PostMethods';

class Settings extends React.Component{
    constructor() {
        super();

        this.state = {
          show_old_password: false,
          showMessage: false,
          showMessageError: false,
          redirectToLogin: false,
          username: "",
          firstname: "",
          lastname: "",
          email: "",
          message: "",
          messageDetail: "",
          rerender: false,
          files: []
        }
        this.pageTitle = "Settings"
        document.title = this.pageTitle;
    }

    componentDidMount() {
        this.getCurrentUserData();
    }

    async getCurrentUserData() {
        const response = await getUserData("/getUserData");
        if(response) {
            this.setState({username: response.username})
            this.setState({firstname: response.firstname})
            this.setState({lastname: response.lastname})
            this.setState({email: response.email})
        }
    }

    async handleAccountSettings(event) {
        event.preventDefault();

        let obj = {};
        obj.first_name  = event.target[0].value
        obj.last_name = event.target[1].value
        obj.username = event.target[2].value
        obj.new_password = event.target[3].value
        obj.email = event.target[4].value
        obj.old_password = event.target[5].value
        const jsonUserData= JSON.stringify(obj);

        const response = await updateUserData(jsonUserData);
        this.setState({ message: JSON.parse(response).message });
        if(this.state.message === "User data successfully updated.") {
            this.setState({ showMessageSuccess: true });
            this.setState({ showMessageError: false });
        } else {
            this.setState({ showMessageSuccess: false });
            this.setState({ showMessageError: true });
        }
    }

    async handleProfilePicUpload(event) {
        event.preventDefault();

        const fd = new FormData();
        fd.append('image', this.state.files[0]);

        const response = await uploadProfilePicture(fd);
        console.log(response)
        if(response) {
          this.setState({ message: "Profile picture has been uploaded successfully." });
          this.setState({ showMessageSuccess: true });
          this.setState({ showMessageError: false });
        } else {
          this.setState({ message: "Error while uploading profile picture." });
          this.setState({ showMessageSuccess: false });
          this.setState({ showMessageError: true });
        }
    }

    handleChange(e, attribut) {
        switch(attribut) {
          case "firstname": this.setState({"firstname": e.target.value}); break;
          case "lastname":  this.setState({"lastname": e.target.value}); break;
          case "username": this.setState({"username": e.target.value}); break;
          case "email":  this.setState({"email": e.target.value}); break;
          default: //Nothing to do;
        }
        if (attribut === "new_password") {
            if (e.target.value || e.target.value.length !== 0) {
                this.setState({"show_old_password": true});
            } else {
                this.setState({"show_old_password": false});
            }
        }
    }

    onDrop(files) {
      this.setState({
        files: files
      });
    }


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
                  <Input className="account-input-text" type="password" placeholder='Enter new password' onChange={(e) => this.handleChange(e,"new_password")}/>
                </Form.Field>

                <Form.Field className="account-input">
                  <Label basic className="input-label">Email</Label>
                  <Input required inverted className="account-input-text" iconPosition='left' placeholder={this.state.email} value={this.state.email} onChange={(e) => this.handleChange(e,"email")} >
                     <Icon name='at' />
                     <input />
                   </Input>
                    {this.state.show_old_password ? <Label basic className="input-label">Old Password</Label> : null}
                    {this.state.show_old_password ? <Input className="account-input-text" type="password" placeholder='Enter old password for confirmation' /> : null}
                </Form.Field>

                <Button className="button-upload mobile-button-border">Save</Button>
              </Form>

            </div>
            <div className="account-settings">
              <Header as='h2' size="medium" icon textAlign="left">
              <Icon name='user' id="settings-icon" />
              Profile Settings
              <Header.Subheader>
                Manage your profile settings and set your profile picture.
              </Header.Subheader>
              </Header>

              <div>{this.state.files.map((file, index) => <img key={index} className="upload-image" alt="preview" src={file.preview} /> )}</div>

              {this.state.showMessageError ? <Message color='red'><p>{this.state.message}</p></Message> : null}
              {this.state.showMessageSuccess ? <Message color='green'><p>{this.state.message}<br/></p></Message> : null}

              <Dropzone id="dz-repair" multiple={ false } name="image" acceptedFiles="image/jpeg, image/png" className="upload-dropzone mobile-button-border" onDrop={this.onDrop.bind(this)} >
                <p id="feed-share-text"><Icon name='image' size="large" id="settings-icon" /> Add Photo</p>
              </Dropzone>
              <Button id="settings-upload-button" className="button-upload button-styles mobile-button-border" type="submit" onClick={this.handleProfilePicUpload.bind(this)}>Upload Picture</Button>


            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings;

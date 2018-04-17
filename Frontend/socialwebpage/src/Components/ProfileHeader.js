import React, {Component} from 'react';
import { Icon, Header, Button, Image} from 'semantic-ui-react'
import {getCurrentUser, checkSession} from '../API/GET/GetMethods';
import {sendFriendshipRequest, deleteProfilePic, deleteFriend} from '../API/POST/PostMethods';

import '../profileStyle.css';

class ProfileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
          show: false,
          redirectToLogin: false,
          username: "",
          firstname: "",
          lastname: "",
          email: "",
          picture: "",
          pictureURL: "",
          pictureExists: false,

          //ButtonState variiert je nachdem, ob sie freunde sind, anfrage raus ist oder status anders ist
          buttonState: "Loading"
        }
        this.api = "/getUserInfo"
        this.apiFriendshipRequest = "/friends/sendFriendshipRequest"
        this.apiCheckSession = "/checkSession"

        //this.getCurrentUser(props.name);
    }

    componentDidMount() {
        this.getCurrentUser(this.props.name);

    }

    async getCurrentUser(username) {

        if(username === undefined) {
            const response = await getCurrentUser(this.api);
            this.setState({username: response.username})
            this.setState({firstname: response.firstname})
            this.setState({lastname: response.lastname})
            this.setState({email: response.email})
            this.setState({picture: response.picture})
            this.setState({pictureURL: response.pictureURL})

            const responseMyData = await checkSession(this.apiCheckSession);

            if(responseMyData.username === this.state.username) {
                this.setState({ show: false});
            } else {
                this.setState({ show: true});
            }

        } else {
            let api = this.api + "?username=" + username;
            const response = await getCurrentUser(api);
            this.setState({username: response.username})
            this.setState({firstname: response.firstname})
            this.setState({lastname: response.lastname})
            this.setState({email: response.email})
            this.setState({picture: response.picture})
            this.setState({pictureURL: response.pictureURL})
            this.setState({buttonState: response.buttonState})

            const responseMyData = await checkSession(this.apiCheckSession);

            if(responseMyData.username === this.state.username) {
                this.setState({ show: false});
            } else {
                this.setState({ show: true});
            }
        }
        if(this.state.picture) {
            this.setState({pictureExists: true})
        }
    }

    async handleDeleteProfilePic(event) {
      const response = await deleteProfilePic(
        "/user/delete/picture"
      );
      if(response) {
        window.location.reload();
      }
    }

    async doSomethingWithUser() {

        // Send friendship request to user
        if(this.state.buttonState == "Add Friend") {
            const response = await sendFriendshipRequest(this.apiFriendshipRequest, this.state.username);
            this.setState({buttonState: JSON.parse(response).buttonState})
        }

        // Delete friendship request to user
        if(this.state.buttonState == "Delete Friend") {
            const response = await deleteFriend(
                "/friends/deleteFriend",
                this.state.username
            );
            if(response) {
                window.location.reload();
            }
        }
    }

    async handleImageClick(event, bool){
      let wrapper = document.getElementsByClassName("wrapper");
      let profile = document.getElementById("profile-content");
      if (bool === true){
        wrapper[0].style.display = "block";
        wrapper[0].style.animation= "fadeIn 0.3s";

      }else{
        wrapper[0].style.display = "none";
      }

    }


    render() {
        return (
            <div>

                <div id="profile-header">

                  <div className="wrapper"  onClick={((e) => this.handleImageClick(e, false))}>
                    <div className="wrapper-content">
                      <div id="parent_div" >
                        <div id="background"></div>
                        <div id="textarea">My Text</div>
                      </div>

                      <Button id="profile-image-close-button" onClick={((e) => this.handleImageClick(e, false))} >Hide Image</Button>
                      <Image src={this.state.pictureURL} id="profile-image-large"/>
                    </div>
                  </div>

                    <div>
                        {!this.state.show && this.state.pictureExists ? <Button onClick={this.handleDeleteProfilePic} id="delete-button-profile-picture" circular icon="delete" ></Button> : null}

                        {this.state.pictureExists ? <div><Image onClick={((e) => this.handleImageClick(e, true))} id="profile-header-picture" src={this.state.pictureURL} /> </div> : <div><Image id="profile-header-picture" src="/assets/images/user.png"></Image></div> }

                    </div>
                    <Header as='h2' size="huge" icon textAlign='center'>
                    <Header.Content>
                      {this.state.username}
                      <Header.Subheader>
                          {this.state.firstname + " " + this.state.lastname}
                      </Header.Subheader>
                      <Header.Subheader>
                          {this.state.email}
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <div>
                      {this.state.show ? <Button id="button-add-friend" icon onClick={this.doSomethingWithUser.bind(this)}>{this.state.buttonState}<Icon name="user"/></Button> : null}
                  </div>
                </div>

            </div>
        );
    }


}

export default ProfileHeader;

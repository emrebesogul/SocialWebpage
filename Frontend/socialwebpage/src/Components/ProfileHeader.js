import React, {Component} from 'react';
import { Icon, Header, Button} from 'semantic-ui-react'

import {getCurrentUser} from '../API/GET/GetMethods';
import {sendFriendshipRequest} from '../API/POST/PostMethods';

import '../profileStyle.css';


class ProfileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
          show: false,
          redirectToLogin: false,
          username: "Username",
          firstname: "First name",
          lastname: "Last name",
          email: "beast@hpe.com"
        }
        this.api = "/getUserInfo"
        this.apiFriendshipRequest = "/sendFriendshipRequest"

        this.getCurrentUser(props.name);
    }

    async getCurrentUser(username) {

        if(username === undefined) {
            const response = await getCurrentUser(this.api);
            this.setState({username: response.username})
            this.setState({firstname: response.firstname})
            this.setState({lastname: response.lastname})
            this.setState({email: response.email})

        } else {
            let api = this.api + "?username=" + username;
            const response = await getCurrentUser(api);
            this.setState({username: response.username})
            this.setState({firstname: response.firstname})
            this.setState({lastname: response.lastname})
            this.setState({email: response.email})
        }

        if(username === this.state.username) {
            this.setState({ show: true});
        }
    }

    //alert("You want to add " + this.state.username + " to your friendlist?")

    async doSomethingWithUser() {

        const response = await sendFriendshipRequest(this.apiFriendshipRequest);
        alert(response)
    }


    render() {
        return (
            <div>

                <div id="profile-header">

                  <div>
                      {this.state.show ? <Button id="button-add-friend" icon onClick={this.doSomethingWithUser.bind(this)}>Add Friend<Icon name="user"/></Button> : null}
                  </div>


                  <Header as='h2' size="huge" icon textAlign='center'>
                    <Icon name='user' circular />
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
                </div>

            </div>
        );
    }


}

export default ProfileHeader;

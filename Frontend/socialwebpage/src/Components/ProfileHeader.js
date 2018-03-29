import React, {Component} from 'react';
import { Icon, Header, Button} from 'semantic-ui-react'

import {getCurrentUser} from '../API/GET/GetMethods';

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

        console.log("checking...")
        console.log(username)
        console.log(this.state.username)

        if(username === this.state.username) {
            console.log("Different user...", "...", this.state.show)
            this.setState({ show: true});
        }
    }


    doSomethingWithUser() {
        alert("You want to add " + this.state.username + " to your friendlist?")
    }


    render() {
        return (
            <div>

                <div id="profile-header">

                  <div>
                      {this.state.show ? <Button onClick={this.doSomethingWithUser.bind(this)}>Add Friend<Icon name="user"/></Button> : null}
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

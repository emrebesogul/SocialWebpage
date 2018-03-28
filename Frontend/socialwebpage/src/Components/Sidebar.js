import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react'

import {checkSession, deleteSession} from '../API/GET/GetMethods';
import {getCurrentUser} from '../API/GET/GetMethods';

import '../profileStyle.css';


class Sidebar extends Component {
    constructor() {
        super();

        this.state = {
          redirectToLogin: false,
          username: "Username"
        }
        this.api = "/getUserInfo"
        this.apiCheckSession = "/checkSession";
        this.apiDeleteSession = "/deleteSession";

        this.checkThisSession();
        this.getCurrentUser();
    }

    async checkThisSession() {
        const response = await checkSession(this.apiCheckSession);
        if(response.message !== "User is authorized") {
            this.setState({redirectToLogin: true})
        }
    }

    async getCurrentUser() {
        const response = await getCurrentUser(this.api);
        this.setState({username: response.username})
    }

    handleLogout() {
        deleteSession(this.apiDeleteSession);
        this.setState({ redirectToLogin: true });
    }



    render() {
        const { redirectToLogin } = this.state;
         if (redirectToLogin) {
           return <Redirect to='/login'/>;
         }

        return (
            <div>
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
                  <h4 id="welcome-label-header">{this.state.username}</h4>

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

                  <Link to="/roadmap">
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

                  <Link to="/settings">
                    <Button labelPosition="right"  size="medium" id="upload-button" icon>
                      <Icon className="menu-icons" size="large" name='group' />
                      Settings
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
        );
    }


}

export default Sidebar;

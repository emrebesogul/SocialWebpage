import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Icon, Button, Image, Menu, Dropdown } from 'semantic-ui-react'
import {checkSession, deleteSession} from '../API/GET/GetMethods';
import {getCurrentUser} from '../API/GET/GetMethods';

import '../profileStyle.css';


class Sidebar extends Component {
    constructor() {
        super();

        this.state = {
          redirectToLogin: false,
          username: ""
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

    reloadPage() {
        //window.location.reload();
        //this.forceUpdate();
    }

    render() {
        const { redirectToLogin } = this.state;
         if (redirectToLogin) {
           return <Redirect to='/login'/>;
         }

        return (
            <div>

              <Link to="/"> <Image className="logo" src="../assets/images/Logo_nobg.png" /></Link>
              <Link to="/"><Image className="logo-mobile" src="../assets/images/Logo_nobg.png" /></Link>

              <div id="mobile-header">

                <Menu size="large" className="mobile-menu">
                 <Dropdown  item icon='content'>
                   <Dropdown.Menu>
                    <Link to="/profile">
                     <Dropdown.Item onClick={this.reloadPage.bind(this)} >
                       <Icon name="user"/> {this.state.username}
                     </Dropdown.Item>
                    </Link>
                    <Link to="/">
                     <Dropdown.Item>
                        <Icon name="feed"/> Feed
                     </Dropdown.Item>
                    </Link>
                    <Link to="/search">
                     <Dropdown.Item>
                        <Icon name="search"/> Search
                     </Dropdown.Item>
                    </Link>
                    <Link to="/settings">
                     <Dropdown.Item>
                         <Icon name="setting"/> Settings
                     </Dropdown.Item>
                    </Link>
                    <Link to="/legal">
                     <Dropdown.Item>
                        <Icon name="legal"/> Legal
                     </Dropdown.Item>
                    </Link>
                    <Link to="/about">
                     <Dropdown.Item>
                        <Icon name="users"/> About
                     </Dropdown.Item>
                    </Link>
                     <Dropdown.Item onClick={this.handleLogout.bind(this)}>
                        <Icon name="log out"/>Logout
                     </Dropdown.Item>
                   </Dropdown.Menu>
                 </Dropdown>
               </Menu>

               {/*
                <Link to="/profile">
                  <Button circular size="medium" id="profile-button-mobile" icon>
                    <Icon className="menu-icons" name='user' />
                    Profile
                  </Button>
                </Link> */}

                <Link to="/post">
                  <Button circular size="medium" id="logout-button-mobile" icon>
                      <Icon className="menu-icons" name='plus' />
                      Add Story
                  </Button>
                </Link>

              </div>

              <div className="feed-header">
                <div id="welcome-label">
                  <h2 id="welcome-label-header"></h2>

                    <Link to="/profile">
                      <Button labelPosition="right"  size="medium" id="upload-button" icon onClick={this.reloadPage}>
                        <Icon className="menu-icons" size="large" name='user' />
                        {this.state.username}
                      </Button>
                    </Link>

                    <Link to="/">
                      <Button labelPosition="right"  size="medium" id="upload-button" icon>
                        <Icon className="menu-icons" size="large" name='feed' />
                        Feed
                      </Button>
                    </Link>

                    <Link to="/post">
                    <Button labelPosition="right" size="medium" id="upload-button" icon>
                      <Icon className="menu-icons" size="large" name='plus' />
                      Add Story
                    </Button>
                  </Link>

                    <Link to="/upload">
                      <Button labelPosition="right" size="medium" id="upload-button" icon>
                        <Icon className="menu-icons" size="large" name='upload' />
                        Add Image
                      </Button>
                    </Link>

                    <Link to="/search">
                      <Button labelPosition="right" size="medium" id="upload-button" icon>
                        <Icon className="menu-icons" size="large" name='search' />
                        Search
                      </Button>
                    </Link>

                  <div className="seperator"></div>

                  <Link to="/settings">
                    <Button labelPosition="right"  size="medium" id="upload-button" icon>
                      <Icon className="menu-icons" size="large" name='cogs' />
                      Settings
                    </Button>
                  </Link>

                  <Link to="/roadmap">
                    <Button labelPosition="right"  size="medium" id="upload-button" icon>
                      <Icon className="menu-icons" size="large" name='compass' />
                      Roadmap
                    </Button>
                  </Link>

                  <Link to="/legal">
                    <Button labelPosition="right"  size="medium" id="upload-button" icon>
                      <Icon className="menu-icons" size="large" name='legal' />
                      Legal
                    </Button>
                  </Link>

                  <Link to="/about">
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
        );
    }


}

export default Sidebar;

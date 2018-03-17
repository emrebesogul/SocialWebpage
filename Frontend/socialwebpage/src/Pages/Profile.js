import React, {Component} from 'react';
import { Button, Header, Icon, Image } from 'semantic-ui-react'
import ProfileTab from '../Components/ProfileTab.js';
import { Link } from 'react-router-dom';

import '../profileStyle.css';

class Profile extends Component {
    constructor() {
        super();
        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
    }

    render() {
        return (
          <div>
            <div id="mobile-header">
              <Link to="/feed">
                <Button circular size="medium" id="profile-button-mobile" icon>
                  <Icon className="menu-icons" name='feed' />
                  Feed
                </Button>
              </Link>
              <Link to="/">
                <Button circular size="medium" id="logout-button-mobile" icon>
                  <Icon className="menu-icons" name='log out' />
                  Log out
                </Button>
              </Link>
            </div>
              <div id="profile">
                <div id="profile-header-button">
                <Link to="/feed">
                  <Button circular size="medium" id="profile-button" icon>
                    <Icon className="menu-icons" name='feed' />
                    Feed
                  </Button>
                </Link>
                <Link to="/asd">
                  <Button circular size="medium" id="logout-button" icon>
                    <Icon className="menu-icons" name='log out' />
                    Log out
                  </Button>
                </Link>
              </div>
              </div>
                <div id="profile-header">
                  <Header as='h2' size="huge" icon textAlign='center'>
                    <Icon name='user' circular />
                    <Header.Content>
                      Leonardo_64
                      <Header.Subheader>
                        Johannes Mändle
                      </Header.Subheader>
                      <Header.Subheader>
                        Bempflingen
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </div>
                  <div id="profile-content">
                    <ProfileTab />
                  </div>
              </div>

        )
    }
}

export default Profile;

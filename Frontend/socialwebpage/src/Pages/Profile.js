import React, {Component} from 'react';
import { Button, Header, Icon } from 'semantic-ui-react'
import ProfileTab from '../Components/ProfileTab.js';
import { Link, Redirect } from 'react-router-dom';

import '../profileStyle.css';

class Profile extends Component {
  constructor() {
      super();

      this.state = {
        redirectToLogin: false
      }

      this.checkThisSession();

      this.pageTitle = "Social Webpage Home"
      document.title = this.pageTitle;
  }

  checkThisSession() {

  }

  handleLogout() {
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
              <Link to="/">
                <Button circular size="medium" id="profile-button-mobile" icon>
                  <Icon className="menu-icons" name='feed' />
                  Feed
                </Button>
              </Link>

                <Button circular size="medium" id="logout-button-mobile" icon onClick={this.handleLogout.bind(this)}>
                  <Icon className="menu-icons" name='log out' />
                  Log out
                </Button>

            </div>
              <div id="profile">
                <div id="profile-header-button">
                <Link to="/">
                  <Button circular size="medium" id="profile-button" icon>
                    <Icon className="menu-icons" name='feed' />
                    Feed
                  </Button>
                </Link>

                  <Button circular size="medium" id="logout-button" icon onClick={this.handleLogout.bind(this)}>
                    <Icon className="menu-icons" name='log out' />
                    Log out
                  </Button>

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

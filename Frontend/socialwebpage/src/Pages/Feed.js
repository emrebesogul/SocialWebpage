import React, {Component} from 'react';
import { Button, Header, Icon, Image, Feed, Card } from 'semantic-ui-react'
import FeedTab from '../Components/FeedTab.js';
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
            <div id="feed">

              <div id="mobile-header">
                <Link to="/profile">
                  <Button circular size="medium" id="profile-button-mobile" icon>
                    <Icon className="menu-icons" name='user' />
                    Profile
                  </Button>
                </Link>
                <Link to="/login">
                  <Button circular size="medium" id="logout-button-mobile" icon>
                    <Icon className="menu-icons" name='log out' />
                    Log out
                  </Button>
                </Link>
              </div>

              <div id="feed-header">
                <Link to="/profile">
                  <Button circular size="medium" id="profile-button" icon>
                    <Icon className="menu-icons" name='user' />
                    Profile
                  </Button>
                </Link>
                <Link to="/login">
                  <Button circular size="medium" id="logout-button" icon>
                    <Icon className="menu-icons" name='log out' />
                    Log out
                  </Button>
                </Link>
              </div>

            </div>

            <div id="feed-content">
                <FeedTab />
            </div>

          </div>
        )
    }
}

export default Profile;

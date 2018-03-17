import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Header, Icon, Image, Feed, Card } from 'semantic-ui-react'
import FeedTab from '../Components/FeedTab.js';

import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

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
        let token = read_cookie("token");

        if(token.length == 0) {
            console.log("Token: ", token);
            this.state.redirectToLogin = true;
        } else {
            console.log("Token Key: ", token);
        }
    }

    handleLogout() {
        delete_cookie("token");
        delete_cookie("userID");

        this.setState({ redirectToLogin: true });
    }


    render() {
        const { redirectToLogin } = this.state;
         if (redirectToLogin) {
           return <Redirect to='/login'/>;
         }

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

                <Button circular size="medium" id="logout-button-mobile" icon onClick={this.handleLogout.bind(this)}>
                    <Icon className="menu-icons" name='log out' />
                    Log out
                </Button>

              </div>

              <div id="feed-header">
                <Link to="/profile">
                  <Button circular size="medium" id="profile-button" icon>
                    <Icon className="menu-icons" name='user' />
                    Profile
                  </Button>
                </Link>

                <Button circular size="medium" id="logout-button" icon onClick={this.handleLogout.bind(this)}>
                    <Icon className="menu-icons" name='log out' />
                    Log out
                </Button>

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

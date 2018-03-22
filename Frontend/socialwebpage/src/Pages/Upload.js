import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Form, Input } from 'semantic-ui-react'
import FeedTab from '../Components/FeedTab.js';
import Dropzone from '../Components/Dropzone'

import { read_cookie, delete_cookie } from 'sfcookies';

import '../profileStyle.css';

class Upload extends Component {
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

        if(token.length === 0) {
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

            <div className="content">
                <h2 >Upload new content</h2>
                <Form>
                  <span className="input-label-upload"> Enter the title of your new post</span>
                  <Input className="input-upload" type="text"/>

                  <span className="input-label-upload"> Select the file you want to share</span>
                  <Dropzone />
                <Button id="button-upload" type="submit">Post</Button>
                </Form>
            </div>

          </div>
        )
    }
}

export default Upload;

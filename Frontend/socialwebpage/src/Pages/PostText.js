import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Form, Input, TextArea } from 'semantic-ui-react'
import Dropzone from '../Components/Dropzone'

import '../profileStyle.css';

class PostText extends Component {
    constructor() {
        super();

        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
    }

    render() {
        return (
          <div id="feed">
              <div id="mobile-header">
                <Link to="/profile">
                  <Button circular size="medium" id="profile-button-mobile" icon>
                    <Icon className="menu-icons" name='user' />
                    Profile
                  </Button>
                </Link>

                <Button circular size="medium" id="logout-button-mobile" icon >
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

                <Button circular size="medium" id="logout-button" icon >
                    <Icon className="menu-icons" name='log out' />
                    Log out
                </Button>
              </div>

            <div id="upload-content">
                <Form>
                  <h2>Post a new story</h2>
                  <span className="input-label-upload"> Enter the title of your new story</span>
                  <Input className="input-upload" type="text"/>

                  <span className="input-label-upload"> What story do you want to share?</span>
                  <TextArea className="input-upload"></TextArea>
                  <Button id="button-upload" type="submit">Post</Button>
                </Form>
            </div>
          </div>
        )
    }
}

export default PostText;

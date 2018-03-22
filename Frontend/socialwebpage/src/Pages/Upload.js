import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Form, Input } from 'semantic-ui-react'
import Dropzone from '../Components/Dropzone'

import '../profileStyle.css';

class Upload extends Component {
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
                  <h2>Upload new content</h2>
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

import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Form, Input, TextArea } from 'semantic-ui-react'
import {uploadStoryToPlatform} from '../API/POST/PostMethods';

import '../profileStyle.css';

class PostText extends Component {
    constructor() {
        super();

        this.state = {
          title: "",
          content: "",
          redirectToFeed: false,
          status: false
        }

        this.api = "/story/create";

        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
    }

      // Upload story
      async handleSubmit(event) {
        event.preventDefault();

        this.state.title =  event.target[0].value;
        this.state.content =  event.target[1].value;
        this.state.userId = "UID:123435445645"; 

        const response = await uploadStoryToPlatform(
            this.api,
            this.state.title,
            this.state.content,
            this.state.userId         
        );

        // Redirect to feed if respose is message is true
        this.setState({status: response});
        if(this.state.status == true) {
            this.setState({ redirectToFeed: true });
        } else {
            let errorField = document.getElementById("error-message-upload-story");
            errorField.style.display = "block";
        }

    }

    render() {
        const { redirectToFeed } = this.state;
        if (redirectToFeed) {
           return <Redirect to='/'/>;
        }
        return (
          <div id="feed">
              <div id="mobile-header">
                <Link to="/">
                  <Button circular size="medium" id="profile-button-mobile" icon>
                    <Icon className="menu-icons" name='feed' />
                    Feed
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
               <Form onSubmit={this.handleSubmit.bind(this)}>
                  <span id="error-message-upload-story">Upload failed. Try again later</span>
                  <h2>Post a new story</h2>
                  <span className="input-label-upload"> Enter the title of your new story</span>
                  
                  <Input required className="input-upload" type="text"/>
                  
                  <span className="input-label-upload"> What story do you want to share?</span>
                  <TextArea required className="input-upload"></TextArea>
                  <Button id="button-upload" type="submit">Post</Button>
                </Form>
            </div>
          </div>
        )
    }
}

export default PostText;

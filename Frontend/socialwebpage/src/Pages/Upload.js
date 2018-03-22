import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Form, Input } from 'semantic-ui-react'
import FeedTab from '../Components/FeedTab.js';
import Dropzone from '../Components/Dropzone';
import FormData from 'form-data';

import uuidv4 from 'uuid/v4';

import {uploadPictureToPlatform} from '../API/POST/PostMethods';

import '../profileStyle.css';

class Upload extends Component {
    constructor() {
        super();

        this.state = {
          file: null,
          title: "",
          description: "",
          numberLikes: 0,
          timestamp: 0,
          imagePath: "",
          redirectToFeed: false
        }

        this.checkThisSession();
        this.api = "/image/create";

        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
    }

    render() {
    checkThisSession() {

    }

    handleLogout() {


        this.setState({ redirectToFeed: true });
    }

    //Post image to feed
    async handleSubmit(event) {
        event.preventDefault();
        console.log("clicked now on submit");

        this.state.imageName =  event.target[0].value;
        this.state.imagePath =  uuidv4();

        console.log(this.state.imagePath);
        // public/assets/images/posts

        const response = await uploadPictureToPlatform(
            this.api,
            this.state.title,
            this.state.description,
            this.state.numberLikes,
            this.state.timestamp,
            this.state.imagePath
        );

        alert(response);

        //Do something with response
        //this.setState({message : JSON.parse(response).message});

    }


    render() {
        const { redirectToFeed } = this.state;
         if (redirectToFeed) {
           return <Redirect to='/'/>;
         }

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


            </div>

            <div className="content">
                <h2 >Upload new content</h2>
                    <Form onSubmit={this.handleSubmit.bind(this)}>

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

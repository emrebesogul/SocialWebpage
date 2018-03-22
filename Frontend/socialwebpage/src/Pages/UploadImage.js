import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Form, Input } from 'semantic-ui-react'
import FeedTab from '../Components/FeedTab.js';
//import Dropzone from '../Components/Dropzone';
import Dropzone from 'react-dropzone'
import FormData from 'form-data';

import uuidv4 from 'uuid/v4';

import {uploadPictureToPlatform} from '../API/POST/PostMethods';

import '../profileStyle.css';

class Upload extends Component {
    constructor() {
        super();

        this.state = {
          files: [],
          title: "",
          description: "",
          imagePath: "",
          redirectToFeed: false,
          imageURL: ""
        }

        this.checkThisSession();
        this.api = "/image/create";

        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
    }

    checkThisSession() {

    }

    handleLogout() {


        this.setState({ redirectToFeed: true });
    }

    //Post image to feed
    async handleSubmit(event) {
        event.preventDefault();
        console.log("clicked now on submit");

        this.state.title =  event.target[0].value;
        this.state.description =  event.target[1].value;

        console.log(this.state.files[0])

        const fd = new FormData();
        fd.append('avatar', this.state.files[0], 'filename',this.state.files[0].name, 'filedescription',this.state.files[0].description);

        const response = await uploadPictureToPlatform(
            this.api,
            fd
        );

        console.log(response);
        alert(response);

        //Do something with response
        //this.setState({message : JSON.parse(response).message});

    }


    onDrop(files) {
      this.setState({
        files: files
      });
    }



    render() {
        const { redirectToFeed } = this.state;
         if (redirectToFeed) {
           return <Redirect to='/'/>;
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

            <div id="upload-content">
                <h2 >Upload new content</h2>
                <Form onSubmit={this.handleSubmit.bind(this)}>

                      <span className="input-label-upload"> Enter the title of your new post</span>
                      <Input className="input-upload" type="text"/>

                      <span className="input-label-upload"> Add description...</span>
                      <Input className="input-upload" type="text"/>

                      <span className="input-label-upload"> Select the file you want to share</span>

                      <Dropzone id="dz-repair" multiple={ false } name="avatar" acceptedFiles="image/jpeg, image/png, image/gif" disablePreview="true" className="upload-dropzone" onDrop={this.onDrop.bind(this)} >
                          <p>Try dropping a picture here, or click to select a picture to upload.</p>
                      </Dropzone>

                      <Button id="button-upload" type="submit">Post</Button>

                </Form>

                <img src={this.state.imageURL} alt="img" />

            </div>
          </div>
        )
    }
}

export default Upload;

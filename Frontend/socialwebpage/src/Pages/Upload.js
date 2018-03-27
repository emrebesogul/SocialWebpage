import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon, Form, Input } from 'semantic-ui-react'
//import Dropzone from '../Components/Dropzone';
import Dropzone from 'react-dropzone'
import FormData from 'form-data';

import uuidv4 from 'uuid/v4';

import {callFetch, checkSession, deleteSession} from '../API/GET/GetMethods';
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
          redirectToLogin: false,
          imageURL: "",
          message: "",
        }

        this.apiCheckSession = "/checkSession"
        this.apiDeleteSession = "/deleteSession";
        this.api = "/image/create";

        this.checkThisSession();

        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
    }

    async checkThisSession() {
        const response = await checkSession(this.apiCheckSession);
        if(response.message === "User is authorized") {
            console.log("Have fun...")
        } else {
            this.setState({redirectToLogin: true})
        }
    }

    handleLogout() {
        deleteSession(this.apiDeleteSession);
        this.setState({ redirectToLogin: true });
    }

    //Post image to feed
    async handleSubmit(event) {
        event.preventDefault();
        console.log("clicked now on submit");

        this.state.title =  event.target[0].value;
        this.state.description =  event.target[1].value;

        //let fileAttributes = [];
        //fileAttributes.push({"title": this.state.title, "description": this.state.description});

        const fd = new FormData();
        fd.append('theImage', this.state.files[0]);
        fd.append('title', this.state.title);
        fd.append('description', this.state.description);

        const response = await uploadPictureToPlatform(
            this.api,
            fd
        );

        console.log(response);

        //Do something with response
        this.setState({message : JSON.parse(response).message});

        if(this.state.message === "Image uploaded") {
            this.setState({ redirectToFeed: true });
        } else {
            //Error messages
            let errorField = document.getElementById("error-message");
            let messageText = "<b>"+this.state.message+"</b>";
            errorField.innerHTML = messageText;
        }

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

         const { redirectToLogin } = this.state;
          if (redirectToLogin) {
            return <Redirect to='/login'/>;
        }

        return (
        <div>
            <div id="feed">
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

            <div id="upload-content">
                <h2 >Upload new content</h2>
                <Form onSubmit={this.handleSubmit.bind(this)}>

                      <span className="input-label-upload"> Enter the title of your new post</span>
                      <Input className="input-upload" type="text"/>

                      <span className="input-label-upload"> Add description...</span>
                      <Input className="input-upload" type="text"/>

                      <span className="input-label-upload"> Select the file you want to share</span>

                      <Dropzone id="dz-repair" multiple={ false } name="theImage" acceptedFiles="image/jpeg, image/png, image/gif" disablePreview="true" className="upload-dropzone" onDrop={this.onDrop.bind(this)} >
                          <p>Try dropping a picture here, or click to select a picture to upload.</p>
                      </Dropzone>

                      <Button id="button-upload" type="submit">Post</Button>

                      <div id="error-message">
                      </div>
                </Form>

            </div>
          </div>
        )
    }
}

export default Upload;

import React, {Component} from 'react';
import {  Redirect } from 'react-router-dom';
import { Button, Form, Input, Message } from 'semantic-ui-react'
import SidebarProfile from '../Components/Sidebar'
import Dropzone from 'react-dropzone'
import FormData from 'form-data';

import {checkSession} from '../API/GET/GetMethods';
import {uploadPictureToPlatform} from '../API/POST/PostMethods';

import '../profileStyle.css';

class Upload extends Component {
    constructor() {
        super();

        this.state = {
          showMessage: false,
          files: [],
          title: "",
          content: "",
          redirectToFeed: false,
          message: "",
        }

        this.apiCheckSession = "/checkSession"
        this.api = "/image/create";

        this.checkThisSession();

        this.pageTitle = "Upload an image..."
        document.title = this.pageTitle;
    }

    async checkThisSession() {
        const response = await checkSession(this.apiCheckSession);
        if(response.message !== "User is authorized") {
            this.setState({redirectToLogin: true})
        }
    }

    //Post image to feed
    async handleSubmit(event) {
        event.preventDefault();

        this.state.title =  event.target[0].value;
        this.state.content =  event.target[1].value;

        const fd = new FormData();
        fd.append('theImage', this.state.files[0]);
        fd.append('title', this.state.title);
        fd.append('content', this.state.content);

        console.log(fd)

        const response = await uploadPictureToPlatform(
            this.api,
            fd
        );

        //Do something with response
        this.setState({message : JSON.parse(response).message});

        if(this.state.message === "Image uploaded") {
            this.setState({ redirectToFeed: true });
        } else {
            //Error messages
            this.setState({ showMessage: true });
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

        return (
        <div>
            <div className="feed">

            <SidebarProfile />

            <div id="upload-content">
                <h2 >Upload new content</h2>
                <Form onSubmit={this.handleSubmit.bind(this)}>

                      <span className="input-label-upload"> Enter the title of your new post</span>
                      <Input className="input-upload" type="text"/>

                      <span className="input-label-upload"> Add description...</span>
                      <Input className="input-upload" type="text"/>

                      <span className="input-label-upload">
                        File size has a limit of 4 megabytes.
                      </span>

                      <span className="input-label-upload"> Select the file you want to share</span>

                      <Dropzone id="dz-repair" multiple={ false } name="theImage" acceptedFiles="image/jpeg, image/png, image/gif" className="upload-dropzone" onDrop={this.onDrop.bind(this)} >
                          <p>Try dropping one picture here, or click to select one picture to upload.</p>
                      </Dropzone>

                      <aside>
                        <h4 >Dropped picture</h4>
                        <ul>
                          {
                            this.state.files.map(f => <li key={f.name}>{f.name}</li>)
                          }
                        </ul>
                      </aside>

                      <div>{this.state.files.map((file, index) => <img key={index} width="200" height="200" src={file.preview} /> )}</div>
                      {this.state.showMessage ? <Message negative><p>{this.state.message}</p></Message> : null}

                      <Button className="button-upload" type="submit">Post</Button>

                      <div id="error-message">
                      </div>
                </Form>
                <p></p>
            </div>
          </div>
      </div>
        )
    }
}

export default Upload;

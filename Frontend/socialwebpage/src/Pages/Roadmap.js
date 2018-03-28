import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { Icon, Step } from 'semantic-ui-react'
import {uploadStoryToPlatform} from '../API/POST/PostMethods';
import {checkSession, deleteSession} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'

import '../profileStyle.css';

class Roadmap extends Component {
    constructor() {
        super();

        this.state = {
          title: "",
          content: "",
          redirectToFeed: false,
          status: false
        }

        this.apiCheckSession = "/checkSession"
        this.api = "/story/create";

        this.checkThisSession();

        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
      }

      async checkThisSession() {
          const response = await checkSession(this.apiCheckSession);
          if(response.message !== "User is authorized") {
              this.setState({redirectToLogin: true})
          }
      }

      handleLogout() {
          deleteSession(this.apiDeleteSession);
          this.setState({ redirectToLogin: true });
      }

    render() {
        const { redirectToFeed } = this.state;

        if (redirectToFeed) {
           return <Redirect to='/'/>;
        }

        return (
          <div>
            <div className="feed">
                <Sidebar />
            </div>

            <div id="upload-content">
              <h2>Roadmap for Scope</h2>

              <h3>Milestone 1</h3>
                <span className='roadmap-date'>
                  07. Mar 2018 -23. Mar 2018
                </span>
                <p className="roadmap-content">
                   -  Post text to platform (Show posts in feed and profile) (DONE)  <br/>
                 -  Wokring registration and login w/o Exception handling (DONE)   <br/>
	                 -  First UI implementation (DONE)
                </p>
              <h3>Milestone 2</h3>
                <span className='roadmap-date'>
                  24. Mar 2018 - 05. Apr 2018
                </span>
                <p className="roadmap-content">
                  -  Upload pictures to platform (Show pictures ins feed and profile) (DONE) <br/>
                  -  Like functionality (konstantin) <br/>
                  -  Profile-specific content (DONE) <br/>
                  -  Profile-linking (DONE) <br/>
                  -  Show current user in sidebar & profile (emre) <br/>
                  -  Roadmap-Page  <br/>
                	-  Settings (working) (emre)
                </p>
              <h3>Milestone 3</h3>
                <span className='roadmap-date'>
                  06. Apr 2018 - 21. Apr 2018
                </span>
                <p className="roadmap-content">
                  -  Edit posts <br/>
                  -  Delete posts <br/>
                  -  Friends <br/>
                  -  About Us-Page <br/>
                	-  Add Dropzone confirmation
                </p>
              <h3>Alpha</h3>
                <span className='roadmap-date'>
                  07. Mar 2018
                </span>
                <p className="roadmap-content">
                  -  Notification center (Optional) <br/>
	                -  Comments
                </p>
              <h3>Beta</h3>
                <span className='roadmap-date'>
                  07. Mar 2018
                </span>
                <p className="roadmap-content">
                  -  Exception handling in Login/regstration <br/>
                  -  Content management (Optional) <br/>
                  -  Clean up code <br/>
                  -  Minify (CSS, JS,) <br/>
                	-  GZIP
                </p>
              <h3>Final Release</h3>

            </div>
          </div>
        )
    }
}

export default Roadmap;

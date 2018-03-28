import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import {  } from 'semantic-ui-react'
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
              Roadmap
            </div>
          </div>
        )
    }
}

export default Roadmap;

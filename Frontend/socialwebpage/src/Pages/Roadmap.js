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

        this.pageTitle = "Roadmap"
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
                <span className='date'>
                  007. Mar. 2018
                </span>
              <h3>Milestone 2</h3>
              <h3>Milestone 3</h3>
              <h3>Alpha</h3>
              <h3>Beta</h3>
              <h3>Final Release</h3>

            </div>
          </div>
        )
    }
}

export default Roadmap;

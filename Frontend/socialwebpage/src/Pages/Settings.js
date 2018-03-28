import React, {Component} from 'react';
import { Tab, Card, Image, Icon, Header, Rating, List, Form, Input, Label, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom';
import {callFetch, checkSession, deleteSession, getStoryForUserId, getImagesForUserId} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'

import '../profileStyle.css';


class Settings extends Component {
  constructor(props) {
      super(props);

      this.state = {
        responseImages: [],
        responseStories: [],
        redirectToLogin: false
      }

      this.apiCheckSession = "/checkSession"

      this.checkThisSession();

      this.pageTitle = "Settings"
      document.title = this.pageTitle;
  }

    async checkThisSession() {
      const response = await checkSession(this.apiCheckSession);
      if(response.message !== "User is authorized") {
          this.setState({redirectToLogin: true})
      }
    }


    render() {
        return (
            <div id="main-content">
                <div className="feed">
                    <Sidebar />
                </div>

            </div>

        )
    }
}

export default Settings;

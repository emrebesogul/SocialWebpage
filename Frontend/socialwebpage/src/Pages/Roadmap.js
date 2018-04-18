import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import {checkSession, deleteSession} from '../API/GET/GetMethods';
import Sidebar from '../Components/Sidebar'
import { Item, Icon } from 'semantic-ui-react'

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

        //this.checkThisSession();

        this.pageTitle = "Roadmap"
        document.title = this.pageTitle;
      }

      componentDidMount() {
          this.checkThisSession();

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
              <h2>Roadmap for Ivey</h2>
              <div className="milestone">
                <Item.Group divided relaxed>
                  <Item></Item>
                  <Item className="roadmap-item">
                    <Icon size='huge' name="road" />
                    <Item.Content>
                      <Item.Header as='a'>Milestone 1</Item.Header>
                      <Item.Meta>07.03.2018  -  23.03.2018</Item.Meta>
                      <Item.Description>
                        Post text to platform (Show posts in feed and profile)
                      </Item.Description>
                      <Item.Description>
                        Wokring registration and login w/o Exception handling
                      </Item.Description>
                      <Item.Description>
                        First UI implementation
                      </Item.Description>
                      <Item.Extra>Finished</Item.Extra>
                    </Item.Content>
                  </Item>

                  <Item className="roadmap-item">
                    <Icon size='huge' name="road" />
                    <Item.Content>
                      <Item.Header as='a'>Milestone 2</Item.Header>
                      <Item.Meta>24.03.2018  -  05.04.2018</Item.Meta>
                      <Item.Description>
                        Upload pictures to platform (Show pictures ins feed and profile)
                      </Item.Description>
                      <Item.Description>
                        Profile-linking
                      </Item.Description>
                      <Item.Description>
                        Like functionality
                      </Item.Description>
                      <Item.Description>
                        Profile-specific content
                      </Item.Description>
                      <Item.Description>
                        Show current user in sidebar & profile
                      </Item.Description>
                      <Item.Description>
                        Roadmap-Page
                      </Item.Description>
                      <Item.Description>
                        Settings
                      </Item.Description>
                      <Item.Extra>Finished</Item.Extra>
                    </Item.Content>
                  </Item>

                  <Item className="roadmap-item">
                    <Icon size='huge' name="road" />
                    <Item.Content>
                      <Item.Header as='a'>Milestone 3</Item.Header>
                      <Item.Meta>06.04.2018 - 21.04.2018</Item.Meta>
                      <Item.Description>
                        Edit posts
                      </Item.Description>
                      <Item.Description>
                        Delete posts
                      </Item.Description>
                      <Item.Description>
                        Friends
                      </Item.Description>
                      <Item.Description>
                        About Us-Page
                      </Item.Description>
                      <Item.Description>
                        Add Dropzone confirmation
                      </Item.Description>
                      <Item.Description>
                        Guestbook
                      </Item.Description>
                      <Item.Description>
                        Add profile picture
                      </Item.Description>
                      <Item.Description>
                        Responsive Design platform-wirde
                      </Item.Description>
                      <Item.Extra>Finished</Item.Extra>
                    </Item.Content>
                  </Item>

                  <Item className="roadmap-item">
                    <Icon size='huge' name="road" />
                    <Item.Content>
                      <Item.Header as='a'>Alpha</Item.Header>
                      <Item.Meta>22.04.2018 - 26.04.2018</Item.Meta>
                      <Item.Description>
                        Notification center
                      </Item.Description>
                      <Item.Description>
                        Comments
                      </Item.Description>
                      <Item.Description>
                        Add image compression
                      </Item.Description>
                      <Item.Description>
                        Search for user
                      </Item.Description>
                      <Item.Extra>In Progress</Item.Extra>
                    </Item.Content>
                  </Item>

                  <Item className="roadmap-item">
                    <Icon size='huge' name="road" />
                    <Item.Content>
                      <Item.Header as='a'>Beta</Item.Header>
                      <Item.Meta> TBD </Item.Meta>
                      <Item.Description>
                        Exception handling in Login/regstration
                      </Item.Description>
                      <Item.Description>
                        Clean up code
                      </Item.Description>
                      <Item.Description>
                        GZIP
                      </Item.Description>
                      <Item.Description>
                      Minify (CSS, JS)
                      </Item.Description>
                      <Item.Extra>Not started</Item.Extra>
                    </Item.Content>
                  </Item>

                  <Item className="roadmap-item">
                    <Icon size='huge' name="road" />
                    <Item.Content>
                      <Item.Header as='a'>Final Release</Item.Header>
                      <Item.Meta> TBD </Item.Meta>
                      <Item.Description>
                        Exception handling in Login/regstration
                      </Item.Description>

                      <Item.Extra>Not started</Item.Extra>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </div>
            </div>
          </div>
        )
    }
}

export default Roadmap;

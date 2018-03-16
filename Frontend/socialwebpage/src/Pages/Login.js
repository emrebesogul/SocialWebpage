import React, {Component} from 'react';
import { Button, Form, Image, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import {checkUserDataAtLogin} from '../API/POST/PostMethods';

class Login extends Component {
    constructor() {
        super();

        this.state = {
          username: "",
          userID: "",
          password: "",
          token: "",
          message: ""
        }

        this.api = '/user/loginUser';
        this.handleSubmit = this.handleSubmit.bind(this);

        //const getdata = new GetData();
        //getdata.get()

        this.pageTitle = "Log in to Social Webpage";
        document.title = this.pageTitle;
    }

    //Post user login data and check if they are correct
    async handleSubmit(event) {
        event.preventDefault();
        console.log("clicked now on submit");

        this.state.username = event.target[0].value;
        this.state.password = event.target[1].value;

        const response = await checkUserDataAtLogin(this.api, this.state.username, this.state.password);

        //Do something with response
        this.setState({message : JSON.parse(response).message});
        this.setState({token : JSON.parse(response).sessionToken});
        this.setState({userID : JSON.parse(response).userID});

        alert(response);
    }

    render() {
        return (
          <div id ="body-div">
            <div>

              <div id="login-menu">
                <Link to="/login"><span id="login-active" className="login-menu-label">Sign Up</span></Link>
                <Link to="/register"><span id="login-inactive" className="login-menu-label">Register</span></Link>
              </div>

              <div id="ourProduct">
                  Bild und Produktname
              </div>

              <div id="formularLogin">
                <div>
                    LOGIN
                </div>

                  <Form onSubmit={this.handleSubmit}>
                    <Form.Field required>
                      <Input inverted className="login-input-text" placeholder='Username' name="username" />
                    </Form.Field>
                    <Form.Field required>
                      <Input className="login-input-text" type="password" placeholder='Password' name="password" />
                    </Form.Field>

                    <Button inverted className="ui basic" id="login-button-submit" type="submit" animated='fade'>
                      <Button.Content visible>
                        Login
                      </Button.Content>
                      <Button.Content hidden>
                        Enter the platform!
                      </Button.Content>
                    </Button>
                  </Form>
              </div>

            </div>
          </div>
        )
    }
}

export default Login;

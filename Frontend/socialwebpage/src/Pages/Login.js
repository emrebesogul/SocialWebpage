import React, {Component} from 'react';
import '../style.css';

import { Button, Form, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import {checkUserDataAtLogin} from '../API/POST/PostMethods';

class Login extends Component {
    constructor() {
        super();

        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.api = '/loginUser';

        this.state = {
          username: "",
          password: "",
          token: "",
          message: ""
        }

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

        //Do something with response
        const response = await checkUserDataAtLogin(this.api, this.state.username, this.state.password);
        alert(response);

        //Cookies und Session => SessionID zurückgeben und Key speichern




    }

    render() {
        return (
            <div>
                <div id="ourProduct">
                    <Image src='/assets/images/logos/logo.jpg' size='medium' verticalAlign='middle' /> <span>Ta Daaa!</span>
                </div>

                <div id="formularLogin">
                    <Form onSubmit={this.handleSubmit}>
                      <Form.Field required>
                        <label>Username</label>
                        <input required placeholder='Username' name="username"/>
                      </Form.Field>
                      <Form.Field required>
                        <label>Password</label>
                        <input type="password" required placeholder='Password' name="password" />
                      </Form.Field>

                      <Button type='submit'>Log In</Button>
                      <span>Don't have an account? <Link to="/register">Sign up</Link></span>
                      <span>Test and go to Home:  <Link to="/home">Home</Link></span>
                      Save credentials in cookies
                    </Form>
                </div>

            </div>
        )
    }
}

export default Login;

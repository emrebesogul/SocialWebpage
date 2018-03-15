import React, {Component} from 'react';
import { Button, Form, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import $ from 'jquery';

import PostLoginData from '../API/POST/PostLoginData';

import '../style.css';

class Login extends Component {
    constructor() {
        super();

        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.url = 'http://localhost:8000/loginUser';

        this.state = {
          username: "",
          password: ""
        }

        this.pageTitle = "Log in to Social Webpage";
        document.title = this.pageTitle;
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("clicked now on submit");
        console.log(this.state.username);
        console.log(this.state.password);

        this.state.username = event.target[0].value;
        this.state.password = event.target[1].value;

        console.log(this.state.username);
        console.log(this.state.password);

        this.getdata();
        //<PostLoginData username={this.state.username} password={this.state.password}/>
    }

    getdata() {
      $.ajax({
        url: this.url,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({username:this.state.username, password:this.state.password}),
        success: function(res) {
            console.log("Successfully responded from server: ");
            console.log(res[0].username);
            console.log(res[0].first_name);
            console.log(res[0].last_name);
            console.log(res[0].birthday);
        }.bind(this),
        error: function(xhr, status, err){
            console.log(err);
        }
      });
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
                        <label>Username or Email</label>
                        <input required placeholder='Username or E-Mail...' name="username"/>
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

import React, {Component} from 'react';
import { Button, Form, Input, Icon, Image, Message  } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

import '../style.css';

import {registerUserToPlatform} from '../API/POST/PostMethods';

class Reqister extends Component {
    constructor() {
        super();

        this.state = {
          showMessageSuccess: false,
          showMessageError: false,
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
          birthday: "",
          gender: "",
          message: "",
          messageDetail: ""
        }
        this.pageTitle = "Ivey - Register"
        document.title = this.pageTitle;
    }

    //Create account
    async handleSubmit(event) {
        event.preventDefault();

        this.state.firstname =  event.target[0].value;
        this.state.lastname =  event.target[1].value;
        this.state.username =  event.target[2].value;
        this.state.email =  event.target[3].value;
        this.state.password =  event.target[4].value;
        this.state.birthday =  event.target[5].value;
        this.state.gender =  event.target[6].value;

        const response = await registerUserToPlatform(
            this.state.firstname,
            this.state.lastname,
            this.state.username,
            this.state.email,
            this.state.password,
            this.state.birthday,
            this.state.gender
        );

        //Do something with response
        this.setState({message : JSON.parse(response).message});
        this.setState({messageDetail : JSON.parse(response).messageDetails});

        if(this.state.message === "User successfully created") {
            this.setState({ showMessageSuccess: true });
            this.setState({ showMessageError: false });
        } else {
            //Error messages
            this.setState({ showMessageSuccess: false });
            this.setState({ showMessageError: true });
        }
    }

    render() {
        return (
          <div id ="body-div">

            <div>
              <div id="login-menu">
                <Link to="/login"><span id="login-inactive" className="login-menu-label">Sign Up</span></Link>
                <Link to="/register"><span id="login-active" className="login-menu-label">Register</span></Link>
              </div>

              <div id="ourProduct">
                <Image id="logo-image-login" src="/assets/images/logo_high_res.png"/>
              </div>

              <div id="formularLogin">
                  <Form onSubmit={this.handleSubmit.bind(this)}>

                    <Form.Field required>
                      <Input required inverted className="login-input-text" placeholder='First name' />
                      <Input required inverted className="login-input-text" placeholder='Last name' />
                    </Form.Field>

                    <Form.Field required>
                      <Input required inverted className="login-input-text" iconPosition="left" placeholder='Username'>
                         <Icon name='user' />
                        <input />
                      </Input>

                      <Input required inverted className="login-input-text" iconPosition='left' placeholder='Email'>
                         <Icon name='at' />
                         <input />
                       </Input>
                    </Form.Field>

                    <Form.Field required>
                      <Input required className="login-input-text" type="password" placeholder='Password' />
                    </Form.Field>

                    <Form.Field>
                      <Input className="login-input-text" placeholder='Birthday: dd/mm/yyyy' />
                      <Input className="login-input-text" placeholder='Gender: Male/Female' />
                    </Form.Field>

                    {this.state.showMessageError ? <Message color='red'><p>{this.state.message}</p></Message> : null}
                    {this.state.showMessageSuccess ? <div><Message color='green'><p>{this.state.messageDetail}<br /><Link to="/login">Sign Up</Link></p></Message></div> : null}

                    <Button  id="login-button-submit" type="submit">
                        Register
                    </Button>

                    <div id="error-message">
                    </div>

                  </Form>
              </div>
            </div>
          </div>
        )
    }
}

export default Reqister;

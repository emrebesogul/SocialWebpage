import React, {Component} from 'react';
import { Button, Form, Image, Input, Checkbox, Icon  } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

import '../style.css';

import {registerUserToPlatform} from '../API/POST/PostMethods';

class Reqister extends Component {
    constructor() {
        super();

        this.state = {
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
          birthday: "",
          gender: "",
          message: "",
          redirect: false
        }

        this.api = '/user/create';

        this.pageTitle = "Reqister to Social Webpage"
        document.title = this.pageTitle;
    }

    //Post user login data and check if they are correct
    async handleSubmit(event) {
        event.preventDefault();
        console.log("clicked now on submit");

        this.state.firstname =  event.target[0].value;
        this.state.lastname =  event.target[1].value;
        this.state.username =  event.target[2].value;
        this.state.email =  event.target[3].value;
        this.state.password =  event.target[4].value;
        this.state.birthday =  event.target[5].value;
        this.state.gender =  event.target[6].value;

        const response = await registerUserToPlatform(
            this.api,
            this.state.firstname,
            this.state.lastname,
            this.state.username,
            this.state.email,
            this.state.password,
            this.state.birthday,
            this.state.gender
        );
        alert(response);

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
                  Product
              </div>

              <div id="formularLogin">
                  <Form onSubmit={this.handleSubmit.bind(this)}>

                    <Form.Field required>
                      <Input inverted className="login-input-text" placeholder='First name' />
                      <Input inverted className="login-input-text" placeholder='Last name' />
                    </Form.Field>

                    <Form.Field required>
                      <Input inverted className="login-input-text" placeholder='Username' />

                          <Input inverted className="login-input-text" iconPosition='left' placeholder='Email'>
                             <Icon name='at' />
                             <input />
                           </Input>
                    </Form.Field>

                    <Form.Field required>
                      <Input className="login-input-text" type="password" placeholder='Password' />
                    </Form.Field>

                    <Form.Field>
                      <Input className="login-input-text" placeholder='Birthday: dd-mm-yy' />
                      <Input className="login-input-text" placeholder='Gender: Male/Female' />
                    </Form.Field>


                    <Button inverted className="ui basic" id="login-button-submit" type="submit" animated='fade'>
                      <Button.Content visible>
                        Register
                      </Button.Content>
                      <Button.Content hidden>
                        Join the platform!
                      </Button.Content>
                    </Button>

                  </Form>
              </div>
            </div>
          </div>
        )
    }
}

export default Reqister;

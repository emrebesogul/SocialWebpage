import React, {Component} from 'react';
import { Button, Form, Image, Input, Checkbox, Icon  } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

import '../style.css';


class Reqister extends Component {
    constructor() {
        super();
        this.pageTitle = "Reqister to Social Webpage"
        document.title = this.pageTitle;
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

              </div>
              <div id="formularLogin">
                  <Form>
                    <Form.Field required>
                      <Input inverted  className="login-input-text" placeholder='Surname' />
                      <Input inverted  className="login-input-text" placeholder='Name' />
                    </Form.Field>
                    <Form.Field required>
                      <Input inverted  className="login-input-text" placeholder='Username' />

                          <Input inverted  className="login-input-text" iconPosition='left' placeholder='Email'>
                             <Icon name='at' />
                             <input />
                           </Input>
                    </Form.Field>
                    <Form.Field required>
                      <Input className="login-input-text" type="password" placeholder='Password' />
                      <Input className="login-input-text" type="password" placeholder='Password' />
                    </Form.Field>


                    <Button inverted className="ui basic" id="login-button-submit" type="submit" animated='fade'>
                      <Button.Content visible>
                        Register
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

export default Reqister;

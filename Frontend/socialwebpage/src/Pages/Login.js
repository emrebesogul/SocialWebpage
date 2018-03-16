import React, {Component} from 'react';
import { Button, Form, Image, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import '../style.css';


class Login extends Component {
    constructor() {
        super();
        this.pageTitle = "Log in to Social Webpage"
        document.title = this.pageTitle;

    }

    render() {
        return (
          <div id ="body-div">
            <div>
              <div id="login-menu">
                <Link to="/"><span id="login-active" className="login-menu-label">Sign Up</span></Link>
                <Link to="/register"><span id="login-inactive" className="login-menu-label">Register</span></Link>
              </div>
              <div id="ourProduct">

              </div>
              <div id="formularLogin">
                <div>
                
                </div>
                  <Form>
                    <Form.Field required>
                      <Input inverted  className="login-input-text" placeholder='Username or E-Mail...' />
                    </Form.Field>
                    <Form.Field required>
                      <Input className="login-input-text" type="password" placeholder='Password' />
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

import React, {Component} from 'react';
import { Button, Form, Image } from 'semantic-ui-react';
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
            <div>
                <div id="ourProduct">
                    <Image src='/assets/images/logos/logo.jpg' size='medium' verticalAlign='middle' /> <span>Ta Daaa!</span>
                </div>

                <div id="formularLogin">
                    <Form>
                      <Form.Field required>
                        <label>Username or Email</label>
                        <input placeholder='Username or E-Mail...' />
                      </Form.Field>
                      <Form.Field required>
                        <label>Password</label>
                        <input type="password" placeholder='Password' />
                      </Form.Field>

                      <Button type='submit' onClick={()=>{ alert('Hola'); }}>Log In</Button>
                      <span>Don't have an account? <Link to="/register">Sign up</Link></span>
                    </Form>
                </div>

            </div>
        )
    }
}

export default Login;

import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Icon, Button, Image, Menu, Dropdown } from 'semantic-ui-react'


class Footer extends Component {
    render() {
        return (
            <div>
              <footer>
                <p id="footer">Ivey &copy; 2018</p>
              </footer>
            </div>
        );
    }
}

export default Footer;

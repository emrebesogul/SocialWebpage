import React from 'react';
import { Image } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom';
import { activateAccountOfUser } from '../API/POST/PostMethods';

class About extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            redirectToLogin: false,
            activationToken: props.match.params.activationToken
        }
        document.title = "Ivey - Activation";
    }

    componentDidMount() {
        if(this.state.activationToken !== undefined) {
            this.activateAccount(this.state.activationToken);
        } else {
            this.redirectToLogin();
        }
    }

    async activateAccount(activationToken) {
        await activateAccountOfUser(activationToken);
    }

    redirectToLogin() {
        this.setState({redirectToLogin: true})
    }

  render(){
      const { redirectToLogin } = this.state;
      if (redirectToLogin) {
          return <Redirect to='/login' />;
      }
    return(
      <div>
        <div >
          <div className="settings">
            <div className="account-settings">
              <Image id="about-logo" className="main-logo" src="/assets/images/logo_high_res.png" />
              <p className="about-text">
                  Welcome to Ivey. Your account was activated successfully.
                  <p><span> >>> </span><Link to="/login"><span id="login-active" className="login-menu-label">Sign Up</span></Link></p>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default About;

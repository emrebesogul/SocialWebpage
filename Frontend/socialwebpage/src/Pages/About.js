import React from 'react';
import { Image } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'

class About extends React.Component{
    constructor() {
        super();
        document.title = "Ivey - About Us";
    }

  render(){
    return(
      <div>
        <div className="feed">
          <Sidebar />
        </div>

        <div >
          <div className="settings">
            <div className="account-settings">
              <Image id="about-logo" className="main-logo" src="/assets/images/logo_high_res.png" />
              <p className="about-text">
                Founded in early 2018 by the three students, Yunus Emre Besogul, Konstantin Klaeger and Johannes Maendle,
                Ivey wants to etablish as a new platform in social communication and sharing. Driven by curiosity, engangement
                and the strive to do things better than its competitors, the team works daily to improve Ivey and set new standards
                in social platforms.
              </p>
              <p className="about-text">
                Future plans by the team reveal honest believe in Ivey and suggest a growth by both, the platform, as well as team members.
                The first stable and fully functional release is currently set to late May, 2018.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default About;

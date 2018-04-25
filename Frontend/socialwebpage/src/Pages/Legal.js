import React from 'react';
import { Item } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'

class About extends React.Component{

  render(){
    return(
      <div>
        <div className="feed">
          <Sidebar />
        </div>

        <div>
          <div className="feed">
              <Sidebar />
          </div>

          <div className="legal-content">
            <h2>Terms of Use & Privacy Policy</h2>
            <div className="milestone">
              <Item.Group divided relaxed>

                <Item></Item>
                <Item className="roadmap-item">
                  <Item.Content>
                    <Item.Header as='a'>Legal Notice</Item.Header>
                    <Item.Description>
                      <p>Ivey</p>
                      <p>Made by: Yunus Emre Besogul, Konstantin Kläger & Johannes Mändle</p>
                      <p>0711 Stuttgart</p>
                      <p>DHBW Stuttgart</p>
                      <p>Germany</p>
                    </Item.Description>
                  </Item.Content>
                </Item>

                <Item className="roadmap-item">
                  <Item.Content>
                    <Item.Header as='a'>General terms and conditions</Item.Header>
                    <Item.Description>
                      <p>1. You must be at least 13 years old to use the service.</p>
                      <p>2. You may not post violent, nude, discriminatory, illegal, hurtful, hateful, pornographic or sexually explicit photos or other content on the Service.</p>
                      <p>3. You are responsible for any activity that occurs through your account and you agree not to sell, transfer, license or assign your account, your followers, your username or any account rights. Except for individuals or companies that are expressly authorized to create accounts on behalf of their employees or customers, Ivey prohibits the creation of an account for anyone other than yourself, and you agree not to do so. You also represent and warrant that any information you provide to Ivey upon registration or at any time thereafter is true, accurate, current and complete and you agree to update your information to the extent necessary to maintain its truthfulness and accuracy.</p>
                      <p>4. You agree that you will not request, collect or use the credentials of other Ivey users.</p>
                      <p>5. You are responsible for maintaining the confidentiality and security of your password.</p>
                      <p>6. You may not defame, stalk, harass, abuse, harass, threaten, imitate or intimidate any person or business, and you may not post any private or confidential information about the Service, including, but not limited to, your credit card information and that of others, social security or alternative national identity numbers, non-public telephone numbers or non-public e-mail addresses.</p>
                      <p>7. You may not use the Service for any illegal or unauthorized purpose. You agree to comply with all laws, rules and regulations (for example at the federal, state, local and local levels) applicable to your use of the Service and your Content (defined below), including without limitation copyright.</p>
                      <p>8. You may not modify, modify, adapt, or alter the Service, or modify, modify, or alter any other Web site in any way that falsely suggests it is related to the Service or Instagram.</p>
                      <p>9. You may not create or send unsolicited email, comments, "Like" notices or other forms of commercial or harassing communications (also called "spam") to any Instagram users.</p>
                      <p>10. You may not create accounts on the Service by unauthorized methods, including the use of automatic devices, scripts, robotic, spider, crawler, or scraper services.</p>
                      <p>11. You may not attempt to restrict another user's use of or enjoyment of the Service, and you may not encourage or support any violation of these Terms of Use or any other instagram terms.</p>
                      <p>12. We respect the rights of others and expect you to do the same.</p>
                      <p>13. If you repeatedly violate the intellectual property rights of others, we may block your account.</p>
                      <p>14. Wenn du einen Nutzernamen bzw. eine ähnliche Kennung für dein Konto auswählst, behalten wir uns das Recht vor, diese/n zu entfernen oder zu widerrufen, wenn wir das als angemessen oder erforderlich erachten (zum Beispiel, wenn der Nutzername bzw. die Kennung das geistige Eigentum von jemanden verletzt).</p>
                      <p>15. You must have fun!</p>
                    </Item.Description>
                  </Item.Content>
                </Item>

                <Item className="roadmap-item">
                  <Item.Content>
                    <Item.Header as='a'>Privacy Policy</Item.Header>
                    <Item.Description>
                        <p>Entry into force: 1st May 2018</p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </Item.Description>
                  </Item.Content>
                </Item>

              </Item.Group>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default About;

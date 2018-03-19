import React from 'react'
import { Tab, Card, Image, Comment, Header, Rating, Form, Button } from 'semantic-ui-react'

const panes = [
  { menuItem: 'Gallery', render: () => <Tab.Pane attached={false}>
  <Card.Group>
    <Card fluid="true" centered="true">
      <Image src='/assets/images/bg.jpg' />
      <Card.Content>
        <Card.Header>
            <Rating icon='heart' size="large" defaultRating={0} maxRating={1}>
            </Rating> Dunes
        </Card.Header>
        <Card.Meta>
          <span className='date'>
            March 15, 2018
          </span>
        </Card.Meta>
        <Card.Description>
          Matthew is a musician living in Nashville.
        </Card.Description>
        <Comment.Group>

        <Header as='h4' dividing>Comments</Header>
        <Comment>
          <Comment.Avatar src='/assets/images/bg.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>Matt</Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>
            <Comment.Text>How artistic!</Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
      </Card.Content>
    </Card>
    <Card fluid="true" centered="true">
      <Image src='/assets/images/john-towner-154060-unsplash.jpg' />
      <Card.Content>
        <Card.Header>
            <Rating icon='heart' size="large" defaultRating={0} maxRating={1}/> Matthew
        </Card.Header>
        <Card.Meta>
          <span className='date'>
            March 15, 2018
          </span>
        </Card.Meta>
        <Card.Description>
          Matthew is a musician living in Nashville.
        </Card.Description>
        <Comment.Group>

        <Header as='h4' dividing>Comments</Header>
        <Comment>
          <Comment.Avatar src='/assets/images/bg.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>Matt</Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>
            <Comment.Text>How artistic!</Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
      </Card.Content>
    </Card>
  </Card.Group>

  </Tab.Pane> },
  { menuItem: 'Story', render: () => <Tab.Pane attached={false}>
  <Card.Group id="cg">
  <Card fluid="true" centered="true">
      <Card.Content>
        <Card.Header>
          Windows 10 Polaris
        </Card.Header>
        <Card.Meta>
          <span className='date'>
            March 15, 2018
          </span>
        </Card.Meta>
        <Card.Description>
          Mobile First means designing for mobile before designing for desktop or any other device (This will make the page display faster on smaller devices).

This means that we must make some changes in our CSS.

Instead of changing styles when the width gets smaller than 768px, we should change the design when the width gets larger than 768px. This will make our design Mobile First:
        </Card.Description>
      </Card.Content>
    </Card>
    <Card fluid="true" centered="true">
      <Card.Content>
        <Card.Header>
          Windows 10 Andromeda
        </Card.Header>
        <Card.Meta>
          <span className='date'>
            March 15, 2018
          </span>
        </Card.Meta>
        <Card.Description>
          Matthew is a musician living in Nashville.
        </Card.Description>
      </Card.Content>
    </Card>
    <Card fluid="true" centered="trues">
      <Card.Content>
        <Card.Header>
          MacOS High Sierra
        </Card.Header>
        <Card.Meta>
          <span className='date'>
            March 15, 2018
          </span>
        </Card.Meta>
        <Card.Description>
          Matthew is a musician living in Nashville.
        </Card.Description>
      </Card.Content>
    </Card>
  </Card.Group>


  </Tab.Pane> },
  { menuItem: 'Guestbook', render: () => <Tab.Pane attached={false}>
  <div className="settings">
  <Comment.Group className="account-settings profile-comments">
     <Comment>
       <Comment.Avatar src='/assets/images/boy.png' />
       <Comment.Content>
         <Comment.Author as='a'>Matt</Comment.Author>
         <Comment.Metadata>
           <div>Today at 5:42PM</div>
         </Comment.Metadata>
         <Comment.Text>How artistic!</Comment.Text>
         <Comment.Actions>
           <Comment.Action>Reply</Comment.Action>
         </Comment.Actions>
       </Comment.Content>
     </Comment>

     <Comment>
       <Comment.Avatar src='/assets/images/boy.png' />
       <Comment.Content>
         <Comment.Author as='a'>Elliot Fu</Comment.Author>
         <Comment.Metadata>
           <div>Yesterday at 12:30AM</div>
         </Comment.Metadata>
         <Comment.Text>
           <p>This has been very useful for my research. Thanks as well!</p>
         </Comment.Text>
         <Comment.Actions>
           <Comment.Action>Reply</Comment.Action>
         </Comment.Actions>
       </Comment.Content>
       <Comment.Group>
         <Comment>
           <Comment.Avatar src='/assets/images/girl.png' />
           <Comment.Content>
             <Comment.Author as='a'>Jenny Hess</Comment.Author>
             <Comment.Metadata>
               <div>Just now</div>
             </Comment.Metadata>
             <Comment.Text>
               Elliot you are always so right :)
             </Comment.Text>
             <Comment.Actions>
               <Comment.Action>Reply</Comment.Action>
             </Comment.Actions>
           </Comment.Content>
         </Comment>
       </Comment.Group>
     </Comment>

     <Comment>
       <Comment.Avatar src='/assets/images/girl.png' />
       <Comment.Content>
         <Comment.Author as='a'>Joe Henderson</Comment.Author>
         <Comment.Metadata>
           <div>5 days ago</div>
         </Comment.Metadata>
         <Comment.Text>
           Dude, this is awesome. Thanks so much
         </Comment.Text>
         <Comment.Actions>
           <Comment.Action>Reply</Comment.Action>
         </Comment.Actions>
       </Comment.Content>
     </Comment>

     <Form reply>
       <Form.TextArea autoHeight="true" rows="3" />
       <Button content='Add Reply' labelPosition='left' icon='edit' />
     </Form>
    </Comment.Group>
  </div>

  </Tab.Pane> },
]

const TabExampleSecondaryPointing = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
)

export default TabExampleSecondaryPointing

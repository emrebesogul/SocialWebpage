import React from 'react'
import { Tab, Card, Image, Icon, Comment, Header, Rating } from 'semantic-ui-react'

const panes = [
  { menuItem: 'Gallery', render: () => <Tab.Pane attached={false}>
  <div>
    <Card fluid="true">
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
    <Card fluid="true">
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
  </div>



  </Tab.Pane> },
  { menuItem: 'Story', render: () => <Tab.Pane attached={false}>
  <Card.Group>
    <Card>
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
          Matthew is a musician living in Nashville.
        </Card.Description>
      </Card.Content>
    </Card>
    <Card>
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
  </Card.Group>
  <Card>
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

  </Tab.Pane> },
  { menuItem: 'Guestbook', render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> },
]

const TabExampleSecondaryPointing = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
)

export default TabExampleSecondaryPointing

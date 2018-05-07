import React from 'react';
import { Image, List, Button, Input,  Card } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'
import { Link, Redirect } from 'react-router-dom';
import { checkAuthorization, getAllUsers, getCurrentUserData } from '../API/GET/GetMethods';
import { deleteUser } from '../API/POST/PostMethods';

var users = [{username: "Jimmy", firstName: "James", lastName: "Carter", profile_picture_url: "/assets/images/user.png"}];

class Users extends React.Component{

  constructor() {
    super();

    this.state = {
      redirectToLogin: false,
      users: [],
      currentUserId: "",
      currentUserIsAdmin: false
    }

    this.pageTitle = "Ivey - Network"
    document.title = this.pageTitle;
  }

  componentDidMount() {
    this.checkAuthorization();
    this.getCurrentUserData();
    this.getUsers();
  }

  async getUsers() {
    const users = await getAllUsers();
    this.setState({users: users})
  }

  async getCurrentUserData() {
    const currentUserData = await getCurrentUserData();
    this.setState({currentUserId: currentUserData.userId})
    this.setState({currentUserIsAdmin: currentUserData.is_admin});
  }

  async checkAuthorization() {
    const userIsAuthorized = await checkAuthorization();
    if(!userIsAuthorized) {
      this.setState({redirectToLogin: true})
    }
  }

  async handleChange(event) {
    let requestedName = event.target.value.toLowerCase().replace(/\s/g, '');
    let result = [];
    let allUsers = await getAllUsers();
    allUsers.map(user => {
      let fullName = user.first_name.trim().toLowerCase()  + user.last_name.trim().toLowerCase();
      if(user.title.toLowerCase().includes(requestedName)){
        if(!result.includes(user)) {
          result.push(user)
        }
      }
      if(fullName.toLowerCase().includes(requestedName)){
        if(!result.includes(user)) {
          result.push(user)
        }
      }
    });
    this.setState({users: result})
  }

  async handleDeleteUser(event, item) {
    let response = await deleteUser(item._id);
    if(response && (item.userId == this.state.currentUserId)) {
      this.setState({ redirectToLogin: true });
    } else {
      this.getUsers();
    }

  }

  render(){
    const { redirectToLogin } = this.state;
    if (redirectToLogin) {
        return <Redirect to='/login' />;
    }
    users = this.state.users;
    return(
      <div>
        <div className="feed">
          <Sidebar />
        </div>

        <div>
          <div className="settings">
            <div >
              <div >
                <Input onChange={(e) => this.handleChange(e)} id="users-search" placeholder="Enter a username..." />
              </div>
              <Card.Group id="network-card-group">
              {users.map((item, index) =>
                {
                  return(
                    <div key={index}>
                        <Card id="network-cards">
                          <Card.Content>
                          <Link to={`/profile/${item.username}`}>
                            {item.picture !== "https://gruppe1.testsites.info/uploads/posts/" ? <div><Image src={item.picture} size="tiny" floated="right" className="user-card-avatar friends-avatar"/></div> : <div><Image className="user-card-avatar friends-avatar" size="tiny" floated="right" src="/assets/images/user.png"></Image></div> }
                              <Card.Header>
                                <span id="network-card-header">{item.username}</span>
                              </Card.Header>
                              <Card.Meta>{item.first_name} {item.last_name}</Card.Meta>
                          </Link>
                          </Card.Content>
                          <Card.Content className="flex">
                            <div className="flex-item">
                            { this.state.currentUserIsAdmin ? <Button id="red-border-button" className=" button-styles delete-friend-button mobile-button-border" onClick={((e) => this.handleDeleteUser(e, item))}>Delete User</Button>: null}
                            </div>
                          </Card.Content>
                        </Card>

                    </div>
                  )
                }
              )}
                </Card.Group>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Users;

import React from 'react';
import { Image, List, Button, Input } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'
import { Link } from 'react-router-dom';

var users = [{username: "Jimmy", firstName: "James", lastName: "Carter", profile_picture_url: "/assets/images/user.png"}];

class Users extends React.Component{

  render(){
    return(
      <div>
        <div className="feed">
          <Sidebar />
        </div>

        <div>
          <div className="settings">
            <div >
              <div >
                <Input id="users-search" placeholder="Enter a username..." />
              </div>
              {users.map((item, index) =>
                {
                  return(
                    <div key={index}>
                      <List className="feed-list-item" divided relaxed verticalAlign='middle'>
                        <List.Item>
                          {item.profile_picture_url !== "http://localhost:8000/uploads/posts/" ? <div><Image src={item.profile_picture_url} size="tiny" className="user-card-avatar friends-avatar"/></div> : <div><Image className="user-card-avatar friends-avatar" size="tiny" src="/assets/images/user.png"></Image></div> }
                          <List.Content className="friends-content">
                            <List.Header>
                                <Link to={`/profile/${item.requester}`}>
                                    <span>{item.username} </span>
                                </Link>
                            </List.Header>
                            <List.Description>{item.firstName} {item.lastName}</List.Description>
                          </List.Content>
                          <List.Content className="flex">
                            <div className="flex-item">
                              <Button id="red-border-button" className=" button-styles delete-friend-button mobile-button-border" onClick={((e) => this.declineFriendRequest(e, item))}>Delete User</Button>
                            </div>
                          </List.Content>
                        </List.Item>
                      </List>
                    </div>
                  )
                }
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Users;

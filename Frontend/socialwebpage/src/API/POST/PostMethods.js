import $ from 'jquery';

var url = "http://localhost:8000";

//----------------------LOGIN----------------------//
export const checkUserDataAtLogin=(api, username, password) =>
{
    return new Promise((resolve, reject) => {
        $.ajax({
          url: url + api,
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({username: username, password: password}),
          success: function(res) {
              console.log("Response from server: ", res);
              resolve(res);
          }.bind(this),
          error: function(xhr, status, err){
              console.log(err);
              reject(err);
          }
        });
    });
}

//----------------------REGISTER----------------------//
export const registerUserToPlatform=(api, firstname, lastname, username, email, password, birthday, gender) =>
{
    return new Promise((resolve, reject) => {
        $.ajax({
          url: url + api,
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({firstname: firstname, lastname: lastname, username: username, email: email, password: password, birthday: birthday, gender: gender}),
          success: function(res) {
              console.log("Response from server: ", res);
              resolve(res);
          }.bind(this),
          error: function(xhr, status, err){
              console.log(err);
              reject(err);
          }
        });
    });
}

//----------------------xy----------------------//

import $ from 'jquery';

var url = "http://localhost:8000";

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

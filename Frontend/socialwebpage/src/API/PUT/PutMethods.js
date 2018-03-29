import $ from 'jquery';
import { read_cookie } from 'sfcookies';

var url = "http://localhost:8000";

export const updateUserData=(api, jsonUserData)=>{
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')
      console.log(api)
      $.ajax({
        url: url + api,
        contentType: "application/json",
        type: "PUT",
        data: jsonUserData,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data) {
          resolve(data);
        },
        error: function(xhr, status, err){
          reject(err);
        }
    });
  });
}

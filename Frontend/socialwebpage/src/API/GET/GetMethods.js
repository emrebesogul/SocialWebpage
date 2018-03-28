import $ from 'jquery';
import { read_cookie, delete_cookie } from 'sfcookies';

var url = "http://localhost:8000";

export const getCurrentUser=(api)=>{
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')

      $.ajax({
        url: url + api,
        dataType: 'json',
        cache: false,
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data) {
          resolve(data);
        }.bind(this),
        error: function(xhr, status, err){
          console.log(err);
          reject(err);
        }
    });
  });
}

export const checkSession=(api)=>{
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')

      $.ajax({
        url: url + api,
        dataType: 'json',
        cache: false,
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data) {
          console.log("checking session with response: ", data)
          resolve(data);
        }.bind(this),
        error: function(xhr, status, err){
          console.log(err);
          reject(err);
        }
    });
  });
}

export const deleteSession=(api)=>{
    $.ajax({
      url: url + api,
      dataType:'json',
      cache: false,
      type: "GET",
      success: function(data) {
        console.log("Session deleted")
        delete_cookie('token')
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
      });
}

//----------------------Get user story entries----------------------//
export const getStoryForUserId=(api)=>{
  return new Promise((resolve, reject) => {
    var token = read_cookie('token')
    $.ajax({
        url: url + api,
        dataType:'json',
        cache: false,
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(res) {
          resolve(res);
        }.bind(this),
        error: function(xhr, status, err){
          console.log(err);
        }
      });
  });
}

//----------------------Get images----------------------//
export const getImagesForUserId=(api)=>{
  return new Promise((resolve, reject) => {
    var token = read_cookie('token')
    $.ajax({
        url: url + api,
        dataType:'json',
        cache: false,
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(res) {
          resolve(res);
        }.bind(this),
        error: function(xhr, status, err){
          console.log(err);
        }
      });
  });
}

//----------------------Get Feed----------------------//
export const fetchFeedData=(api) =>
{
    return new Promise((resolve, reject) => {
        $.ajax({
          url: url + api,
          type: "GET",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify(),
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

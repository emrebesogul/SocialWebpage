import $ from 'jquery';
import { read_cookie, delete_cookie } from 'sfcookies';

var getUrl = window.location;
var url = getUrl.protocol + "//" + getUrl.hostname + ":8000/rest";

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
          console.log(data)
          resolve(data);
      },
        error: function(xhr, status, err){
          reject(err);
        }
    });
  });
}

export const getCurrentUserData=(api)=>{
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
        },
        error: function(xhr, status, err){
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
          resolve(data);
        },
        error: function(xhr, status, err){
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
        delete_cookie('token')
      },
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
        },
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
        },
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
      var token = read_cookie('token')
        $.ajax({
          url: url + api,
          type: "GET",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify(),
          headers: {
            'Authorization': 'Bearer ' + token
          },
          success: function(res) {
              resolve(res);
          },
          error: function(xhr, status, err){
              reject(err);
          }
        });
    });
}

//----------------------Get Feed----------------------//
export const getFriendRequests=(api) =>
{
    return new Promise((resolve, reject) => {
      var token = read_cookie('token')
        $.ajax({
          url: url + api,
          type: "GET",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify(),
          headers: {
            'Authorization': 'Bearer ' + token
          },
          success: function(res) {
              resolve(res);
          },
          error: function(xhr, status, err){
              reject(err);
          }
        });
    });
}

//----------------------Get guestbook entries----------------------//
export const getGuestbookEntriesForUserId=(api)=>{
  return new Promise((resolve, reject) => {
    var token = read_cookie('token')
    $.ajax({
      url: url + api,
      type: "GET",
      cache: false,
      contentType: 'application/json',
      data: 'json',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(res) {
          resolve(res);
      },
      error: function(xhr, status, err){
          reject(err);
      }
    });
  });
}

//----------------------Get friends----------------------//
export const getFriends=(api)=>{
    return new Promise((resolve, reject) => {
      var token = read_cookie('token')
      $.ajax({
        url: url + api,
        type: "GET",
        cache: false,
        contentType: 'application/json',
        data: 'json',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        success: function(res) {
            resolve(res);
        },
        error: function(xhr, status, err){
            reject(err);
        }
      });
    });
}

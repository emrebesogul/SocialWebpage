import $ from 'jquery';
import { read_cookie, delete_cookie } from 'sfcookies';

var getUrl = window.location;
var url = getUrl.protocol + "//" + getUrl.hostname + "/rest";

export const getUserData=(api) => {
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

export const getCurrentUserData=() => {
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')
      $.ajax({
        url: url + "/currentUserData",
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

export const checkAuthorization=() => {
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')

      $.ajax({
        url: url + "/checkAuthorization",
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

export const deleteSession=() => {
    $.ajax({
      url: url + "/deleteSession",
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

export const getStoryForUserId=(api) => {
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

export const getImagesForUserId=(api) => {
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

export const fetchFeedData=() => {
    return new Promise((resolve, reject) => {
      var token = read_cookie('token')
        $.ajax({
          url: url + "/feed",
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

export const getFriendRequests=() => {
    return new Promise((resolve, reject) => {
      var token = read_cookie('token')
        $.ajax({
          url: url + "/friends/getRequests",
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

export const getGuestbookEntriesForUserId=(api) => {
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

export const getFriends=() => {
    return new Promise((resolve, reject) => {
      var token = read_cookie('token')
      $.ajax({
        url: url + "/friends/getFriends",
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

export const getComments=() => {
  return new Promise((resolve, reject) => {
    var token = read_cookie('token')
    $.ajax({
      url: url + "/comment/list",
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

export const getAllUsers=() => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url + "/user/all",
      type: "GET",
      cache: false,
      contentType: 'application/json',
      data: 'json',
      success: function(res) {
          resolve(res);
      },
      error: function(xhr, status, err){
          reject(err);
      }
    });
  });
}

export const getNotifications=() => {
  return new Promise((resolve, reject) => {
    var token = read_cookie('token')
    $.ajax({
      url: url + "/notifications",
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

export const getNotificationData=(api) => {
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

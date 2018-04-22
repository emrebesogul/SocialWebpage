import $ from 'jquery';
import { read_cookie } from 'sfcookies';

var getUrl = window.location;
var url = getUrl.protocol + "//" + getUrl.hostname + ":8000/rest";

export const updateUserData=(jsonUserData) => {
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')
      $.ajax({
        url: url + "/user/edit",
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

export const updateStoryEntry=(storyId, storyTitle, storyContent) => {
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')
      $.ajax({
        url: url + "/story/edit",
        contentType: "application/json",
        type: "PUT",
        data: JSON.stringify({storyId: storyId, storyTitle: storyTitle, storyContent: storyContent}),
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

export const updateImage=(imageId, imageTitle, imageContent) => {
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')
      $.ajax({
        url: url + "/image/edit",
        contentType: "application/json",
        type: "PUT",
        data: JSON.stringify({imageId: imageId, imageTitle: imageTitle, imageContent: imageContent}),
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
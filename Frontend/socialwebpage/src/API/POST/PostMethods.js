import $ from 'jquery';
import { read_cookie } from 'sfcookies';

var getUrl = window.location;
var url = getUrl.protocol + "//" + getUrl.hostname + ":8000/rest";

export const checkUserDataAtLogin=(username, password) => {
    return new Promise((resolve, reject) => {
        $.ajax({
          url: url + "/user/loginUser",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({username: username, password: password}),
          success: function(res) {
              resolve(res);
          },
          error: function(xhr, status, err){
              reject(err);
          }
        });
    });
}

export const registerUserToPlatform=(firstname, lastname, username, email, password, birthday, gender) => {
    return new Promise((resolve, reject) => {
        $.ajax({
          url: url + "/user/create",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({firstname: firstname, lastname: lastname, username: username, email: email, password: password, birthday: birthday, gender: gender}),
          success: function(res) {
              resolve(res);
          },
          error: function(xhr, status, err){
              reject(err);
          }
        });
    });
}

export const uploadPictureToPlatform=(fd) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/image/create",
          type: "POST",
          cache: false,
          contentType: false,
          processData: false,
          data: fd,
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

export const uploadStoryToPlatform=(title, content, userId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/story/create",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({title: title, content: content}),
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

export const deleteStoryEntryById=(storyId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/story/delete",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({storyId: storyId}),
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

export const deleteImageById=(imageId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/image/delete",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({imageId: imageId}),
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

export const likeStoryEntryById=(storyId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/story/like",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({storyId: storyId}),
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

export const likeImageById=(imageId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/image/like",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({imageId: imageId}),
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

export const sendFriendshipRequest=(recipient) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/friends/sendFriendshipRequest",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({token: token, recipient: recipient}),
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

export const confirmFriendshipRequest=(requesterId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/friends/confirmFriendRequest",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({requesterId: requesterId}),
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

export const deleteFriendshipRequest=(requesterId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/friends/declineFriendRequest",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({requesterId: requesterId}),
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

export const deleteMyFriendshipRequest=(recipientId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/friends/cancelMyFriendRequest",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({recipientId: recipientId}),
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

export const createGuestbookentry=(title, content, ownerName) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/guestbook/create",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({title: title, content: content, ownerName: ownerName}),
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

export const deleteGuestbookEntryById=(guestbookEntryId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/guestbook/delete",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({guestbookEntryId: guestbookEntryId}),
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

export const likeGuestbookEntryById=(guestbookEntryId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/guestbook/like",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({guestbookEntryId: guestbookEntryId}),
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

export const uploadProfilePicture=(fd) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/user/image/create",
          type: "POST",
          cache: false,
          contentType: false,
          processData: false,
          data: fd,
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

export const deleteProfilePicture=() => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/user/delete/picture",
          type: "POST",
          cache: false,
          contentType: false,
          processData: false,
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

export const deleteFriend=(friendId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/friends/deleteFriend",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({userToDeleteId: friendId}),
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

export const getStoryEntryById=(storyId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/story/getEntry",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({storyId: storyId}),
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

export const getImageById=(imageId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/image/get",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({imageId: imageId}),
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

export const createComment=(commentData) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/comment/create",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({commentData: commentData}),
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

export const deleteCommentById=(commentId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/comment/delete",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({commentId: commentId}),
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

export const likeComment=(commentId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/comment/like",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({commentId: commentId}),
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

export const deleteUser=(userId) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/user/delete",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({userId: userId}),
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

export const activateAccountOfUser=(activationToken) => {
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')
        $.ajax({
          url: url + "/account/activate",
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({activationToken: activationToken}),
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

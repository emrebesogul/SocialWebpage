import $ from 'jquery';
import { read_cookie } from 'sfcookies';

var getUrl = window.location;
var url = getUrl.protocol + "//" + getUrl.hostname + ":8000/rest";

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
              resolve(res);
          },
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
              resolve(res);
          },
          error: function(xhr, status, err){
              console.log(err);
              reject(err);
          }
        });
    });
}

//----------------------Post Image----------------------//
export const uploadPictureToPlatform=(api, fd) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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
              console.log(err);
              reject(err);
          }
        });
    });
}

//----------------------Post Story----------------------//
export const uploadStoryToPlatform=(api, title, content, userId) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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
              console.log(err);
              reject(err);
          }
        });
    });
}

//----------------------Delete Story Entry----------------------//
export const deleteStoryEntryById=(api, storyId) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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

//----------------------Delete Image----------------------//
export const deleteImageById=(api, imageId) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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

//----------------------Like Story----------------------//
export const likeStoryEntryById=(api, storyId) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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

//----------------------Like Image----------------------//
export const likeImageById=(api, imageId) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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

//----------------------Add Friend----------------------//
export const sendFriendshipRequest=(api, recipient) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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

//----------------------Confirm Friendship----------------------//
export const confirmFriendshipRequest=(api, requester, recipient) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({requester: requester, recipient: recipient}),
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

//----------------------Delete Friendshiprequest----------------------//
export const deleteFriendshipRequest=(api, requester, recipient) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        console.log(api)

        $.ajax({
          url: url + api,
          type: "POST",
          cache: false,
          contentType: 'application/json',
          data: JSON.stringify({requester: requester, recipient: recipient}),
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

//----------------------Create Guestbook Entry----------------------//
export const createGuestbookentry=(api, title, content, ownerName) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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
              console.log(err);
              reject(err);
          }
        });
    });
}

//----------------------Delete Guestbook Entry----------------------//
export const deleteGuestbookEntryById=(api, guestbookEntryId) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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

//----------------------Like Guestbook Entry----------------------//
export const likeGuestbookEntryById=(api, guestbookEntryId) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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

//----------------------Upload Profile Picture----------------------//
export const uploadProfilePic=(api, fd) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
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
              console.log(err);
              reject(err);
          }
        });
    });
}

//----------------------Delete Profile Picture----------------------//
export const deleteProfilePic=(api, username) =>
{
    return new Promise((resolve, reject) => {
        var token = read_cookie('token')

        $.ajax({
          url: url + api,
          type: "POST",
          cache: false,
          contentType: false,
          processData: false,
          data: username,
          headers: {
              'Authorization': 'Bearer ' + token
          },
          success: function(res) {
              resolve(res);
          },
          error: function(xhr, status, err){
              console.log(err);
              reject(err);
          }
        });
    });
}

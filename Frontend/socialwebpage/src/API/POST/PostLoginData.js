import React, { Component } from 'react';
import $ from 'jquery';

class PostLoginData extends Component {
  constructor() {
    super();

    this.username = '';
    this.password = '';
    this.url = 'http://localhost:8080/checkLoginData';
  }

  getdata() {
    $.ajax({
      url: this.url,
      type: "POST",
      dataType:'json',
      cache: false,
      data: JSON.stringify(),
      success: function(res) {
          console.log(res);
          console.log("Added");
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  }

}

export default PostLoginData;

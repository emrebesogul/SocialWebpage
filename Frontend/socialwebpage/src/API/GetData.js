import React, { Component } from 'react';
import $ from 'jquery';

class GetData extends Component {
  constructor() {
    super();
    this.state = {
      userdata: [],
      printeddata: []
    }
    this.url = 'http://localhost:8080/get';
  }

  getdata() {
    $.ajax({
      url: this.url,
      dataType:'json',
      cache: false,
      type: "GET",
      success: function(data) {
        this.setState({userdata: data}, function(){
            console.log(this.state);
        });
        this.setState({
            printeddata: this.state.userdata[0].first_name
        });
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  }

  componentWillMount() {
    this.getdata();
  }

  render() {
    return (
      <div>
        <span>User Data from MongoDB: {this.state.printeddata}</span>
      </div>
    );
  }
}

export default GetData;

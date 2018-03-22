import $ from 'jquery';
var iso = require('isomorphic-fetch');
var es = require('es6-promise').polyfill();

var url = "http://localhost:8000";

export const getUser=(api)=>{
    $.ajax({
      url: url + api,
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


export const callFetch=(method, path, body)=> {
    let customPath = path;
    const config = {
      method,
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'same-origin', // wichtig für auth !!!
    };

    if (config.method !== 'GET') {
      config.body = JSON.stringify(body);
    } else if (body) {
      //customPath = `${path}?${queryString.stringify(body)}`;
    }

    try {
      const res =  fetch(`${url}${customPath}`, config);
      //const res =  fetch(`${url ? url : ''}/api${customPath}`, config);
      const data = res.json();
      return {
        data,
        response: res,
      };
    } catch (err) {
      console.log("err");
      return err;
    }
  }

export const checkSession=(api)=>{
    $.ajax({
      url: url + api,
      dataType:'json',
      cache: false,
      type: "GET",
      success: function(data) {
        console.log("session exists...", data)
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
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
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
      }
      });
}

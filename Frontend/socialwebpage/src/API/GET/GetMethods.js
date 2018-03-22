import $ from 'jquery';

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

export const checkSession=(api)=>{
    $.ajax({
      url: url + api,
      dataType:'json',
      cache: false,
      type: "GET",
      success: function(data) {
        console.log("session exists...")
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

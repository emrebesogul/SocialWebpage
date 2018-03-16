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

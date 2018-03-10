var express = require('express');
var app = express();
const proxy = require('express-http-proxy');
const cors = require('cors');

app.use(cors());

app.use('/get', proxy('localhost:8000/', {
    proxyReqPathResolver: function(req) {
        console.log(req.url);
        return req.url;
    }})
);


app.listen(8080, function() {
  console.log('listening on 8080')
})

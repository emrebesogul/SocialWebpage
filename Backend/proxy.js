var express = require('express');
var app = express();
var request = require('request');
const proxy = require('express-http-proxy');
const cors = require('cors');

//bodyparser

app.use(cors());

app.use('/get', proxy('localhost:8000/api/checkSession', {
    proxyReqPathResolver: function(req) {
        console.log(req.url);
        return req.url;
    }})
);

app.listen(8080, function() {
  console.log('listening on 8080')
})

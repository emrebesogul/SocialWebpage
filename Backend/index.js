var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const cors = require('cors');
var bodyParser = require('body-parser');

app.use(cors());

// create application/json parser
var jsonParser = bodyParser.json();

//Import functions
var database = require('./database');

var url = 'mongodb://127.0.0.1:27017/socialwebpage';

// Connect to Mongo on start
MongoClient.connect(url, function(err, client) {
  if (err) {
      console.log('Unable to connect to MongoDB');
      throw err;
  } else {
      console.log("Successfully connected to MongoDB");
      app.use(bodyParser.json());


      //----------------------LOGIN----------------------//
      app.post('/loginUser', (req, res) => {
          const userCredential = JSON.stringify(req.body);
          database.checkUserCredentials(client.db('socialwebpage'), res, userCredential, res, function(){
              db.close();
          });
      });

      //----------------------REGISTER----------------------//



      app.listen(8000, function() {
          console.log('Listening for API Requests on port 8000...')
      })
  }
})

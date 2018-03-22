var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session')

// create application/json parser
var jsonParser = bodyParser.json();

//Import functions
var database = require('./database');
var url = 'mongodb://127.0.0.1:27017/socialwebpage';

// 5aad6d046ad239693bcd29cd
/*
- Bilder posten (POST /image/create)
- Texte posten (POST /story/create)
- Bilder anzeigen im Feed (GET /story/list)
- Texte anzeigen im Feed (GET /image/list)
- Bilder anzeigen im Profil (GET /image/list?userid=$userid)
- Texte anzeigen im Profil (GET /story/list?userid=$userid)
*/

app.use(cors());

app.use(session({
    secret: 'bla blub',
    resave: false,
    saveUninitialized: false
 }));

// Connect to Mongo DB on start
MongoClient.connect(url, function(err, client) {
  if (err) {
      console.log('Unable to connect to MongoDB');
      throw err;
  } else {
      console.log("Successfully connected to MongoDB");
      app.use(bodyParser.json());

      //----------------------SESSION----------------------//
      app.get('/checkSession', (req, res) => {
          if(! req.session.userID){
            console.log("NOPE.. ", req.session.userID);

          } else {
              console.log("Is Session here...", req.session.userID);
          }
      });

      app.get('/deleteSession', (req, res) => {
          console.log("will delete: ", req.session.userID);
          req.session.destroy(function(err) {
              console.log("Deleted session...");
          })
      });

      //----------------------LOGIN----------------------//
      app.post('/user/loginUser', (req, res) => {
          const userCredential = JSON.stringify(req.body);
          database.checkUserCredentials(client.db('socialwebpage'), req, res, userCredential, function(){
              db.close();
          });
      });

      //----------------------REGISTER----------------------//
      app.post('/user/create', (req, res) => {
          const newUserData = JSON.stringify(req.body);
          database.registerUserToPlatform(client.db('socialwebpage'), res, newUserData, function(){
              db.close();
          });
      });

      //----------------------Feed----------------------//
      app.get('/feed', (req, res) => {
        database.getFeed(client.db('socialwebpage'), res, () => {
            db.close();
        });
      });

      //----------------------Profile----------------------//
      app.get('/image/create', (req, res) => {
        console.log("Bild posten");
        console.log(req.body);
        //database.getFeed(client.db('socialwebpage'), res, () => {
        //    db.close();
        //});
      });


      app.listen(8000, function() {
          console.log('Listening for API Requests on port 8000...')
      })
  }
})

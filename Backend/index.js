var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session')
var cookieParser = require('cookie-parser');

// create application/json parser
var jsonParser = bodyParser.json();

//Import functions
var database = require('./database');
var url = 'mongodb://127.0.0.1:27017/socialwebpage';

// 5aad6d046ad239693bcd29cd
/*
Emre:
- Bilder posten (POST /image/create)
- Bilder anzeigen im Feed (GET /story/list)
- Bilder anzeigen im Profil (GET /image/list?userid=$userid)
- Bild und Story zeitlich anzeigen

Konstantin:
- Texte posten (POST /story/create)
- Texte anzeigen im Feed (GET /image/list)
- Texte anzeigen im Profil (GET /story/list?userid=$userid)

*/


app.use(cors());
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{}
 }));

 function checkSession(a, b, c) {
     console.log("checkSession");
     console.log(c); //next();      nodemon und next.js
     c();
 }

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
          console.log("=================================");
          req.session.test = 123456
          req.session.test2 = 1010101

          console.log(req.sessionID);
          console.log(req.session.cookie);


          console.log(req.session)
          console.log(req.session.user)
          console.log(req.session.test)
          console.log(req.session.test2)

          res.send(JSON.stringify({
              hi: "hallo",
              lol: req.session.userID
          }));
          console.log("=================================");
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
          database.registerUserToPlatform(client.db('socialwebpage'), req, res, newUserData, function(){
              db.close();
          });
      });

      //----------------------Feed----------------------//
      app.get('/feed', (req, res) => {
          console.log(req.session.userID);
        database.getFeed(client.db('socialwebpage'), res, () => {
            db.close();
        });
        //nodemon
      });

      //----------------------Profile----------------------//
      app.get('/image/list', (req, res) => {
          //get: /?id=123
          // req.param('id')...
      });


      app.post('/image/create', (req, res) => {
        console.log("Bild posten");
        console.log(req.body);


        //database.getFeed(client.db('socialwebpage'), res, () => {
        //    db.close();
        //});
      });

      //----------------------Create Story----------------------//
      app.post('/story/create', (req, res) => {
        console.log("Add story to database:");
        console.log(req.body);
        const storyData = JSON.stringify(req.body);
          database.createStoryEntry(client.db('socialwebpage'), res, storyData, function(){
              db.close();
          });
      });


      app.listen(8000, function() {
          console.log('Listening for API Requests on port 8000...')
      })
  }
})

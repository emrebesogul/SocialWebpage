var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session')
var cookieParser = require('cookie-parser');
var multer = require('multer');

// create application/json parser
var jsonParser = bodyParser.json();

var database = require('./database');
var url = 'mongodb://127.0.0.1:27017/socialwebpage';

//Setup Multer:
var storage = multer.diskStorage({
  destination: 'uploads/posts/',
  filename: function (req, file, callback) {
      callback(null,file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage: storage});

app.use(express.static('./public'));



app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
  }
  next();
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{}
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
        console.log("User ID Feed: " + req.session.userID);
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

      //----------------------Upload Image to Server----------------------//


      app.post('/image/create', upload.single('avatar'), (req, res) => {
          console.log(req.body)

          if (!req.file) {
            console.log("No file received");
            res.send(JSON.stringify({
                success: false

            }));

          } else {
            console.log('file received');
            res.send(JSON.stringify({
                success: true
            }));

          }
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


      //----------------------xy----------------------//



      app.listen(8000, function() {
          console.log('Listening for API Requests on port 8000...')
      })
  }
})


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

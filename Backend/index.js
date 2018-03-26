const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uuid = require('uuid/v4');
var jwt = require('jsonwebtoken');


// create application/json parser
const jsonParser = bodyParser.json();

const database = require('./database');
const url = 'mongodb://127.0.0.1:27017/socialwebpage';

//Setup Multer:
const storage = multer.diskStorage({
  destination: 'uploads/posts/',
  filename: function (req, file, callback) {
      callback(null, uuid());
  }
});

const upload = multer({ storage: storage});

app.use(express.static('./public'));



//==================================================================================================//




//==================================================================================================//
//Enable CORS
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



//==================================================================================================//
// Connect to Mongo DB on start
MongoClient.connect(url, function(err, client) {
  if (err) {
      console.log('Unable to connect to MongoDB');
      throw err;
  } else {
      console.log("Successfully connected to MongoDB");
      app.use(bodyParser.json());



      //----------------------SESSION CHECK----------------------//
      app.get('/checkSession', verifyToken, (req, res) => {
          console.log("=================================");
          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  res.json({
                      message: "User is authorized"
                  });
              }
          });
          console.log("=================================");
      });

      //Verify Token
      function verifyToken(req, res, next) {
          console.log("verifying token...")
          console.log(req);
          console.log("Header: ",req.headers.authorization)
          //Get auth header value
          const bearerHeader = req.headers.authorization;
          if(typeof bearerHeader !== 'undefined') {
              //Split at the space
              const bearer = bearerHeader.split(' ');
              const bearerToken = bearer[1];
              //Set the Token
              req.token = bearerToken;
              //Next middleware
              next();
          } else {
              //Forbidden
              res.json({
                  message: "User is not authorized"
              });
          }
      }


      //----------------------SESSION DELETE----------------------//
      app.get('/deleteSession', (req, res) => {
          res.status(200).send({ auth: false, token: null });
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
        console.log("User ID Feed: " + "5aad6d046ad239693bcd29cd");
        database.getFeed(client.db('socialwebpage'), res, () => {
            db.close();
        });
      });


      //----------------------Profile----------------------//
      app.get('/image/list', (req, res) => {
          //get: /?id=123
          // req.param('id')...
      });

      //----------------------Upload Image to Server----------------------//
      app.post('/image/create', upload.single('theImage'), (req, res) => {
          if (!req.file) {
            console.log("No file received");
            res.send(JSON.stringify({
                message: "Image could not be uploaded"
            }));
          } else {
              console.log(req.file)
              console.log(req.body)

              const fileData = JSON.stringify(req.file);
              const fileDataInfo = JSON.stringify(req.body);

              const file = {fileData, fileDataInfo}
              console.log(file)

              database.uploadImageToPlatform(client.db('socialwebpage'), res, file, function(){
                  db.close();
              });
          }
      });


      //----------------------Create Story----------------------//
      //
      // Calls the method createStoryEntry that insert the information of a new story
      // to the database.
      // Post parameters: title, content and userId of the new story entry
      app.post('/story/create', (req, res) => {
        console.log("Add story to database:");
        console.log(req.body);
        const storyData = JSON.stringify(req.body);
          database.createStoryEntry(client.db('socialwebpage'), res, storyData, () => {
              db.close();
          });
      });

      //----------------------List Story Entries in a user profile----------------------//
      //
      // Calls the method listStoryEntriesForUserId that returns all story entries for
      // the user id in the query to the react application.
      // Get prameter: userId of the respective user
      app.get('/story/list', (req, res) => {
        let userId = req.query.userId;
        console.log("List story entries for user id:" + userId);
        const storyData = JSON.stringify(req.body);
            database.listStoryEntriesForUserId(client.db('socialwebpage'), res, userId, () => {
                db.close();
            });
      });


      //----------------------xy----------------------//



      app.listen(8000, function() {
          console.log('Listening for API Requests on port 8000...')
      })
  }
})



//==================================================================================================//

//Comments
// 5aad6d046ad239693bcd29cd
/*
Emre:
- Bilder anzeigen im Feed (GET /story/list)
- Bilder anzeigen im Profil (GET /image/list?userid=$userid)
- Bild und Story zeitlich anzeigen

Konstantin:
- Texte anzeigen im Feed (GET /image/list)
- Texte anzeigen im Profil (GET /story/list?userid=$userid)

*/

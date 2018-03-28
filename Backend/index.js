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
  destination: 'public/uploads/posts/',
  filename: function (req, file, callback) {
      switch (file.mimetype) {
          case 'image/jpeg': ext = '.jpeg'; break;
          case 'image/png': ext = '.png'; break;
          default: ext = '';
      }
     callback(null, uuid() + ext);
  }
});

const upload = multer({ storage: storage});

app.use(express.static('public'));



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
      app.get('/getUserInfo', verifyToken, (req, res) => {

          if(req.query.username) {
              let username = req.query.username;
              database.getOtherUserProfile(client.db('socialwebpage'), res, username, () => {
                  db.close();
              });
          } else {
              jwt.verify(req.token, 'secretkey', (err, authData) => {
                  if(err) {
                      res.json({
                          message: "User is not authorized"
                      });
                  } else {
                      const userid = authData.userid
                      database.getCurrentUserProfile(client.db('socialwebpage'), res, userid, () => {
                          db.close();
                      });
                  }
              });
          }

      });

      //----------------------SESSION CHECK----------------------//
      app.get('/checkSession', verifyToken, (req, res) => {
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
      });

      //Verify Token
      function verifyToken(req, res, next) {
          //console.log("verifying token...")
          //console.log(req);
          //console.log("Header: ",req.headers.authorization)
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
        database.getFeed(client.db('socialwebpage'), req, res, () => {
            db.close();
        });
      });


      //----------------------Profile----------------------//
      app.get('/image/list', (req, res) => {
          //get: /?id=123
          // req.param('id')...
      });

      //----------------------Upload Image to Server----------------------//
      app.post('/image/create', verifyToken, upload.single('theImage'), (req, res) => {
          if (!req.file) {
            res.send(JSON.stringify({
                message: "Image could not be uploaded"
            }));
          } else {
              jwt.verify(req.token, 'secretkey', (err, authData) => {
                  if(err) {
                      res.json({
                          message: "User is not authorized"
                      });
                  } else {
                      const fileData = JSON.stringify(req.file);
                      const fileDataInfo = JSON.stringify(req.body);
                      const userid = authData.userid
                      const file = {fileData, fileDataInfo, userid}
                      database.uploadImageToPlatform(client.db('socialwebpage'), res, file, function(){
                          db.close();
                      });

                  }
              });

          }
      });


      //----------------------Create Story----------------------//
      //
      // Calls the method createStoryEntry that insert the information of a new story
      // to the database.
      // Post parameters: title, content and userId of the new story entry
      app.post('/story/create', verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const userid = authData.userid
                const storyData = JSON.stringify(req.body);
                const file = {storyData, userid}

                database.createStoryEntry(client.db('socialwebpage'), res, file, () => {
                    db.close();
                });
            }
        });
      });

      //----------------------List Story Entries in a user profile----------------------//
      //
      // Calls the method listStoryEntriesForUserId that returns all story entries for
      // the user id in the query to the react application.
      // Get prameter: userId of the respective user
      app.get('/story/list', verifyToken, (req, res) => {

        if(req.query.username) {
            let username = req.query.username;
            database.getIdOfOtherUser(client.db('socialwebpage'), res, username, () => {
                db.close();
            });
        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({
                        message: "User is not authorized"
                    });
                } else {
                    const userid = authData.userid
                    database.listStoryEntriesForUserId(client.db('socialwebpage'), res, userid, () => {
                        db.close();
                    });
                }
            });
        }
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

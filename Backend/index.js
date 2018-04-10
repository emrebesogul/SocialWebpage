const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');

{/*
  //Create HTTP/HTTPS server
  var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
  var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

  var credentials = {key: privateKey, cert: certificate};

  var httpServer = http.createServer(app);
  var httpsServer = https.createServer(credentials, app);

  httpServer.listen(8080);
  httpsServer.listen(8443);
*/}




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




//==================================================================================================//
app.use(express.static('public'));

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

      //Verify Token Function
      function verifyToken(req, res, next) {
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

      //----------------------CHECK SESSION----------------------//
      app.get('/rest/getUserInfo', verifyToken, (req, res) => {

          if(req.query.username) {
              jwt.verify(req.token, 'secretkey', (err, authData) => {
                  if(err) {
                      res.json({
                          message: "User is not authorized"
                      });
                  } else {
                      const myUsername = authData.username
                      let username = req.query.username;
                      database.getOtherUserProfile(client.db('socialwebpage'), req, res, username, myUsername);
                  }
              });

          } else {
              jwt.verify(req.token, 'secretkey', (err, authData) => {
                  if(err) {
                      res.json({
                          message: "User is not authorized"
                      });
                  } else {
                      const userid = authData.userid
                      database.getCurrentUserProfile(client.db('socialwebpage'), req, res, userid);
                  }
              });
          }
      });

      //----------------------SESSION CHECK----------------------//
      app.get('/rest/checkSession', verifyToken, (req, res) => {
          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  res.json({
                      message: "User is authorized",
                      username: authData.username
                  });
              }
          });
      });

      //----------------------SESSION DELETE----------------------//
      app.get('/rest/deleteSession', (req, res) => {
          res.status(200).send({ auth: false, token: null });
      });

      //----------------------LOGIN----------------------//
      app.post('/rest/user/loginUser', (req, res) => {
          const userCredential = JSON.stringify(req.body);
          database.checkUserCredentials(client.db('socialwebpage'), req, res, userCredential, function(){
              db.close();
          });
      });

      //----------------------REGISTER----------------------//
      app.post('/rest/user/create', (req, res) => {
          const newUserData = JSON.stringify(req.body);
          database.registerUserToPlatform(client.db('socialwebpage'), req, res, newUserData, function(){
              db.close();
          });
      });

      //----------------------Show the Feed----------------------//
      //
      // Calls the method getFeed that fetchs all images and story entries from
      // the database.
      // Post parameters: title, content and userId of the new story entry
      app.get('/rest/feed', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                database.getFeed(client.db('socialwebpage'), req, res, authData.userid, () => {
                    db.close();
                });

            }
        });
      });

      //----------------------Upload Image----------------------//
      app.post('/rest/image/create', verifyToken, upload.single('theImage'), (req, res) => {
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

                      database.uploadImageToPlatform(client.db('socialwebpage'), res, file);
                  }
              });
          }
      });

      //----------------------Create Story----------------------//
      //
      // Calls the method createStoryEntry that insert the information of a new story
      // to the database.
      // Post parameters: title, content and userId of the new story entry
      app.post('/rest/story/create', verifyToken, (req, res) => {

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
      // Calls the method listStoryEntriesForUserId or listStoryEntriesForUsername that
      // returns all story entries for the user id in the query to the react application.
      // Get prameter: userId of the respective user
      app.get('/rest/story/list', verifyToken, (req, res) => {
        if(req.query.username) {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({
                        message: "User is not authorized"
                    });
                } else {
                    let username = req.query.username;
                    let currentUserId = authData.userid;
                    database.listStoryEntriesForUsername(client.db('socialwebpage'), res, username, currentUserId,  () => {
                        db.close();
                    });
                }
            });

        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({
                        message: "User is not authorized"
                    });
                } else {
                    const currentUserId = authData.userid;
                    database.listStoryEntriesForUserId(client.db('socialwebpage'), res, currentUserId, currentUserId, () => {
                        db.close();
                    });
                }
            });
        }
      });

      //----------------------List Images in a user profile----------------------//
      //
      // Calls the method listImagesForUserId or listImagesForUsername that returns all
      // images for the user id in the query to the react application.
      // Get prameter: userId of the respective user
      app.get('/rest/image/list', verifyToken, (req, res) => {

        if(req.query.username) {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({
                        message: "User is not authorized"
                    });
                } else {
                    let username = req.query.username;
                    let currentUserId = authData.userid;
                    database.listImagesForUsername(client.db('socialwebpage'), req, res, username, currentUserId, () => {
                        db.close();
                    });
                }
            });
        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({
                        message: "User is not authorized"
                    });
                } else {
                    const currentUserId = authData.userid;
                    database.listImagesForUserId(client.db('socialwebpage'), req, res, currentUserId, currentUserId, () => {
                        db.close();
                    });
                }
            });
        }
      });

      //----------------------Delete Story Entry----------------------//
      //
      // Calls the method deleteStoryEntry that deletes a story entry
      // from the database.
      app.post('/rest/story/delete', verifyToken, (req, res) => {

        // check if the current user is also the author of this story entry
        // if no, the user does not have the rights to delete this story

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const storyId = JSON.stringify(req.body);
                const userId = authData.userid;
                database.deleteStoryEntryById(client.db('socialwebpage'), res, storyId, userId, () => {
                    db.close();
                });
            }
        });
      });

      //----------------------Delete Image----------------------//
      //
      // Calls the method deleteImage that deletes an image from the database.
      app.post('/rest/image/delete', verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const imageId = JSON.stringify(req.body);
                const userId = authData.userid;
                database.deleteImageById(client.db('socialwebpage'), res, imageId, userId, () => {
                    db.close();
                });
            }
        });
      });

      //----------------------Update user----------------------//
      app.put('/rest/user/edit', verifyToken, (req, res) => {
          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  const userData = req.body;
                  const userid = authData.userid
                  const user = {userData, userid}
                  database.updateUserData(client.db('socialwebpage'), res, user);
              }
          });
      });

      //----------------------Like Story Entry----------------------//
      //
      // Calls the method likeStoryEntryById that add the user to the list of
      // likes
      app.post('/rest/story/like', verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const storyId = JSON.stringify(req.body);
                const userId = authData.userid;
                database.likeStoryEntryById(client.db('socialwebpage'), res, storyId, userId, () => {
                    db.close();
                });
            }
        });
      });

      //----------------------Like Image----------------------//
      //
      // Calls the method likeImageById that add the user to the list of
      // likes
      app.post('/rest/image/like', verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const imageId = JSON.stringify(req.body);
                const userId = authData.userid;
                database.likeImageById(client.db('socialwebpage'), res, imageId, userId, () => {
                    db.close();
                });
            }
        });
      });

      //----------------------Friendship relation between users----------------------//
      // User ONE sends User TWO a friendship request. User TWO can accept or reject
      // If accepted, add to friendship list, else do nothing...
      app.post('/rest/friends/sendFriendshipRequest', verifyToken, (req, res) => {

          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  const userId = authData.userid;
                  const requester = authData.username;
                  const recipient = req.body.recipient;

                  database.sendFriendshipRequest(client.db('socialwebpage'), res, userId, requester, recipient);
              }
          });
      });

      //----------------------Get friendRequests----------------------//
      // User ONE sends User TWO a friendship request. User TWO can accept or reject
      // If accepted, add to friendship list, else do nothing...
      app.get('/rest/friends/getFriendRequests', verifyToken, (req, res) => {
          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  const userId = authData.userid;
                  database.getFriendRequests(client.db('socialwebpage'), res, userId);
              }
          });

      });

      //----------------------Confirm friendRequests----------------------//
      app.post('/rest/friends/confirmFriendRequest', verifyToken, (req, res) => {
          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  database.confirmFriendshipRequest(client.db('socialwebpage'), req.body.requester, req.body.recipient, res);
              }
          });

      });

      //----------------------Decline friendRequests----------------------//
      app.post('/rest/friends/declineFriendRequest', verifyToken, (req, res) => {
          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  database.deleteFriendshipRequest(client.db('socialwebpage'), req.body.requester, req.body.recipient, res);
              }
          });

      });

      //----------------------Get friends----------------------//
      app.get('/rest/friends/getFriends', verifyToken, (req, res) => {
          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  const userId = authData.userid;
                  database.getFriends(client.db('socialwebpage'), res, userId);
              }
          });
      });

      //----------------------Delete friend----------------------//
      app.post('/rest/friends/deleteFriend', verifyToken, (req, res) => {
          jwt.verify(req.token, 'secretkey', (err, authData) => {
              if(err) {
                  res.json({
                      message: "User is not authorized"
                  });
              } else {
                  const userId = authData.userid;
                  const userToDelete = req.body.userToDelete;
                  database.deleteFriend(client.db('socialwebpage'), res, userId, userToDelete);
              }
          });
      });

      // ------------------------------------Guestbook--------------------------------------//

      //------------------------------Create Guestbook Entry--------------------------------//
      //
      // Calls the method createGuestbookEntry that insert the information of a new story
      // to the database.
      // Post parameters: title, content and owner name of the new guestbook entry
      app.post('/rest/guestbook/create', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const title = req.body.title;
                const content = req.body.content;
                const ownerName = req.body.ownerName;
                const authorId = authData.userid;
                database.createGuestbookEntry(client.db('socialwebpage'), res, title, content, ownerName, authorId, () => {
                    db.close();
                });
            }
        });
      });

      //----------------------List Guestbook Entries in a user profile----------------------//
      //
      // Calls the method listGuestbookEntriesForUserId or listGuestbookEntriesForUsername that
      // returns all guestbook entries for the user id in the query to the react application.
      app.get('/rest/guestbook/list', verifyToken, (req, res) => {
        if(req.query.username) {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({
                        message: "User is not authorized"
                    });
                } else {
                    const username = req.query.username;
                    const currentUserId = authData.userid;
                    database.listGuestbookEntriesForUsername(client.db('socialwebpage'), res, username, currentUserId,  () => {
                        db.close();
                    });
                }
            });

        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({
                        message: "User is not authorized"
                    });
                } else {
                    const currentUserId = authData.userid;
                    database.listGuestbookEntriesForUserId(client.db('socialwebpage'), res, currentUserId, currentUserId, () => {
                        db.close();
                    });
                }
            });
        }
      });

      //----------------------Like Guestbook Entry----------------------//
      //
      // Calls the method likeGuestbookEntryById that add the user to the list of
      // likes
      app.post('/rest/guestbook/like', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const guestbookData = req.body;
                const userId = authData.userid;
                database.likeGuestbookEntryById(client.db('socialwebpage'), res, guestbookData, userId, () => {
                    db.close();
                });
            }
        });
      });

      //----------------------Delete Guestbook Entry----------------------//
      //
      // Calls the method deleteGuestbookEntryById that deletes a story entry
      // from the database.
      app.post('/rest/guestbook/delete', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const guestbookData = req.body;
                const userId = authData.userid;
                database.deleteGuestbookEntryById(client.db('socialwebpage'), res, guestbookData, userId, () => {
                    db.close();
                });
            }
        });
      });

      //----------------------Upload Profile Picture----------------------//
      app.post('/rest/user/image/create', verifyToken, upload.single('image'), (req, res) => {
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
                      const fileData = req.file;
                      const userid = authData.userid
                      const file = {fileData, userid}

                      database.uploadProfilePic(client.db('socialwebpage'), res, file);
                  }
              });

          }
      });

      //----------------------Delete Profile Pic----------------------//
      //
      // Calls the method deleteImage that deletes an image from the database.
      app.post('/rest/user/delete/picture', verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const userId = authData.userid;
                database.deleteProfilePic(client.db('socialwebpage'), res, userId);
            }
        });
      });



      //----------------------xy----------------------//


      app.listen(8000, function() {
          console.log('Listening for API Requests on port 8000...')
      })
  }
})

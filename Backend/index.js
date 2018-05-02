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
const database = require('./database');
const mongoSanitize = require('express-mongo-sanitize');

// create application/json parser
const jsonParser = bodyParser.json();
const url = 'mongodb://127.0.0.1:27017/socialwebpage';

//Setup Multer for uploading files
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

app.use(mongoSanitize());

app.use(express.static('public'));
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

MongoClient.connect(url, function(err, client) {
  if (err) {
        console.log('Unable to connect to MongoDB');
        throw err;
  } else {
        console.log("Successfully connected to MongoDB");
        app.use(bodyParser.json());

        function verifyToken(req, res, next) {
            const bearerHeader = req.headers.authorization;
            if(typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                req.token = bearerToken;
                next();
            } else {
                res.json({
                    message: "User is not authorized"
                });
            }
        }

    //-----------------------------Get user data-----------------------------//
    app.get('/rest/getUserData', verifyToken, (req, res) => {
        if(req.query.username) {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({});
                } else {
                    const userid = authData.userid
                    const username = req.query.username;
                    database.getUserDataForUsername(client.db('socialwebpage'), res, username, userid);
                }
            });
        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json({});
                } else {
                    const userid = authData.userid
                    database.getUserDataForCurrentUser(client.db('socialwebpage'), res, userid);
                }
            });
        }
    });

    //--------------------------Check authorization--------------------------//
    app.get('/rest/checkAuthorization', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    });

    //-------------------Get user data of the current user-------------------//
    app.get('/rest/currentUserData', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({});
            } else {
                database.getUserDataForCurrentUser(client.db('socialwebpage'), res, authData.userid);
            }
        });
    });

    //---------------------------Delete the session--------------------------//
    app.get('/rest/deleteSession', (req, res) => {
        res.status(200).send({ auth: false, token: null });
    });

    //-------------------------------Login user------------------------------//
    app.post('/rest/user/loginUser', (req, res) => {
        const userCredential = req.body;
        database.checkUserCredentials(client.db('socialwebpage'), res, userCredential);
    });

    /*
    //-----------------------------Register user------------------------------//
    app.post('/rest/user/create', (req, res) => {
        const newUserData = req.body;
        database.registerUserToPlatform(client.db('socialwebpage'), res, newUserData);
    });*/

    //------------------------------Show the Feed-----------------------------//
    app.get('/rest/feed', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json([]);
            } else {
                database.getFeed(client.db('socialwebpage'), res, authData.userid);
            }
        });
    });

    //---------------------------Upload an image---------------------------//
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
                    const fileData = req.file;
                    const fileDataInfo = req.body;
                    const userId = authData.userid;
                    database.uploadImageToPlatform(client.db('socialwebpage'), res, fileData, fileDataInfo, userId);
                }
            });
        }
    });

    //-----------------------------Create Story----------------------------//
    //
    // Calls the method createStoryEntry that insert the information of a
    // new story to the database.
    // Post parameters: title, content and userId of the new story entry
    app.post('/rest/story/create', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const userId = authData.userid
                const storyData = req.body;
                database.createStoryEntry(client.db('socialwebpage'), res, storyData, userId);
            }
        });
    });

    //----------------List story entries in a user profile-----------------//
    //
    // Calls one of the methods listStoryEntriesForUserId or
    // listStoryEntriesForUsername that returns all story entries for the
    // user id in the query to the react application.
    // Get prameter: userId of the respective user
    app.get('/rest/story/list', verifyToken, (req, res) => {
        if(req.query.username) {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json([]);
                } else {
                    const username = req.query.username;
                    const currentUserId = authData.userid;
                    database.listStoryEntriesForUsername(client.db('socialwebpage'), res, username, currentUserId);
                }
            });
        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json([]);
                } else {
                    const currentUserId = authData.userid;
                    database.listStoryEntriesForUserId(client.db('socialwebpage'), res, currentUserId, currentUserId);
                }
            });
        }
    });

      //--------------------List images in a user profile--------------------//
      //
      // Calls the method listImagesForUserId or listImagesForUsername that
      // returns all images for the user id in the query to the react
      // application.
      // Get prameter: userId of the respective user
      app.get('/rest/image/list', verifyToken, (req, res) => {

        if(req.query.username) {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json([]);
                } else {
                    const username = req.query.username;
                    const currentUserId = authData.userid;
                    database.listImagesForUsername(client.db('socialwebpage'), res, username, currentUserId);
                }
            });
        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json([]);
                } else {
                    const currentUserId = authData.userid;
                    database.listImagesForUserId(client.db('socialwebpage'), res, currentUserId, currentUserId);
                }
            });
        }
      });

    //--------------------------Delete a story entry-------------------------//
    app.post('/rest/story/delete', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const storyId = req.body.storyId;
                const userId = authData.userid;
                database.deleteStoryEntryById(client.db('socialwebpage'), res, storyId, userId);
            }
        });
    });

    //----------------------------Delete an image----------------------------//
    //
    // Calls the method deleteImage that deletes an image from the database.
    app.post('/rest/image/delete', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const imageId = req.body.imageId;
                const userId = authData.userid;
                database.deleteImageById(client.db('socialwebpage'), res, imageId, userId);
            }
        });
    });

    //-----------------------------Update a user-----------------------------//
    app.put('/rest/user/edit', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "User is not authorized"
                });
            } else {
                const userData = req.body;
                const currentUserId = authData.userid;
                database.updateUserData(client.db('socialwebpage'), res, userData, currentUserId);
            }
        });
    });

    //-----------------------------Like a story----------------------------//
    //
    // Calls the method likeStoryEntryById that add the user to the list of
    // likes.
    app.post('/rest/story/like', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const storyId = req.body.storyId;
                const userId = authData.userid;
                database.likeStoryEntryById(client.db('socialwebpage'), res, storyId, userId);
            }
        });
    });

    //-----------------------------Like an image-----------------------------//
    //
    // Calls the method likeImageById that add the user to the list of
    // likes
    app.post('/rest/image/like', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const imageId = req.body.imageId;
                const userId = authData.userid;
                database.likeImageById(client.db('socialwebpage'), res, imageId, userId);
            }
        });
    });

    //-------------------Friendship relation between users-------------------//
    // User ONE sends User TWO a friendship request. User TWO can accept or reject
    // If accepted, add to friendship list, else do nothing...
    app.post('/rest/friends/sendFriendshipRequest', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({
                    message: "Error"
                });
            } else {
                const userId = authData.userid;
                const requester = authData.username;
                const recipient = req.body.recipient;
                database.sendFriendRequest(client.db('socialwebpage'), res, userId, requester, recipient);
            }
        });
    });

    //------------------------Get all friend requests------------------------//
    // User ONE sends User TWO a friendship request. User TWO can accept or
    // reject. If accepted, add to friendship list, else do nothing.
    app.get('/rest/friends/getRequests', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json([]);
            } else {
                const userId = authData.userid;
                database.getFriendRequests(client.db('socialwebpage'), res, userId);
            }
        });
    });

    //-----------------------Confirm a friend requests-----------------------//
    app.post('/rest/friends/confirmFriendRequest', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const recipientId = authData.userid;
                database.confirmFriendRequest(client.db('socialwebpage'), req.body.requesterId, recipientId, res);
            }
        });
    });

    //-----------------------Decline a friend requests-----------------------//
    app.post('/rest/friends/declineFriendRequest', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const recipientId = authData.userid;
                database.deleteFriendRequest(client.db('socialwebpage'), req.body.requesterId, recipientId, res);
            }
        });
    });

    //-----------------------cancelMyFriendRequest-----------------------//
    app.post('/rest/friends/cancelMyFriendRequest', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const requesterId = authData.userid;
                database.cancelMyFriendRequest(client.db('socialwebpage'), req.body.recipientId, requesterId, res);
            }
        });
    });

    //-----------------------Get all friends of a user-----------------------//
    app.get('/rest/friends/getFriends', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json([]);
            } else {
                const userId = authData.userid;
                database.getFriends(client.db('socialwebpage'), res, userId);
            }
        });
    });

    //----------------------------Delete a friend----------------------------//
    app.post('/rest/friends/deleteFriend', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const userId = authData.userid;
                const userToDeleteId = req.body.userToDeleteId;
                database.deleteFriend(client.db('socialwebpage'), res, userId, userToDeleteId);
            }
        });
    });

    //-----------------------Create a guestbook entry------------------------//
    app.post('/rest/guestbook/create', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const title = req.body.title;
                const content = req.body.content;
                const ownerName = req.body.ownerName;
                const authorId = authData.userid;
                database.createGuestbookEntry(client.db('socialwebpage'), res, title, content, ownerName, authorId);
            }
        });
    });

    //-------------List all guestbook entries in a user profile------------//
    app.get('/rest/guestbook/list', verifyToken, (req, res) => {
        if(req.query.username) {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json([]);
                } else {
                    const username = req.query.username;
                    const currentUserId = authData.userid;
                    database.listGuestbookEntriesForUsername(client.db('socialwebpage'), res, username, currentUserId);
                }
            });
        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.json([]);
                } else {
                    const currentUserId = authData.userid;
                    database.listGuestbookEntriesForUserId(client.db('socialwebpage'), res, currentUserId, currentUserId);
                }
            });
        }
    });

    //-------------------------Like a guestbook entry------------------------//
    //
    // Calls the method likeGuestbookEntryById that add the user to the list
    // of likes
    app.post('/rest/guestbook/like', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const guestbookData = req.body;
                const userId = authData.userid;
                database.likeGuestbookEntryById(client.db('socialwebpage'), res, guestbookData, userId);
            }
        });
    });

    //------------------------Delete a guestbook entry-----------------------//
    //
    // Calls the method deleteGuestbookEntryById that deletes a story entry
    // from the database.
    app.post('/rest/guestbook/delete', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const guestbookData = req.body;
                const userId = authData.userid;
                database.deleteGuestbookEntryById(client.db('socialwebpage'), res, guestbookData, userId);
            }
        });
    });

    //------------------------Upload a profile picture-----------------------//
    app.post('/rest/user/image/create', verifyToken, upload.single('image'), (req, res) => {
        if (!req.file) {
        res.send(false);
        } else {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.send(false);
                } else {
                    const fileData = req.file;
                    const userId = authData.userid
                    database.uploadProfilePicture(client.db('socialwebpage'), res, fileData, userId);
                }
            });
        }
    });

    //------------------------Delete a profile picture-----------------------//
    //
    // Calls the method deleteImage that deletes an image from the database.
    app.post('/rest/user/delete/picture', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const userId = authData.userid;
                database.deleteProfilePicture(client.db('socialwebpage'), res, userId);
            }
        });
    });

    //---------------------------Get a story by id---------------------------//
    //
    // Calls the method getStoryEntry that returns the information of the
    // desired story entry.
    app.post('/rest/story/getEntry', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({});
            } else {
                const storyId = req.body.storyId;
                const currentUserId = authData.userid;
                database.getStoryEntry(client.db('socialwebpage'), res, storyId, currentUserId);
            }
        });
    });

    //--------------------------Update Story Entry---------------------------//
    app.put('/rest/story/edit', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const storyId = req.body.storyId;
                const storyTitle = req.body.storyTitle;
                const storyContent = req.body.storyContent;
                const currentUserId = authData.userid;
                database.updateStoryEntry(client.db('socialwebpage'), res, storyId, storyTitle, storyContent, currentUserId);
            }
        });
    });

    //--------------------------Get an image by ID---------------------------//
    //
    // Calls the method getImage that returns the information of the
    // desired image.
    app.post('/rest/image/get', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({});
            } else {
                let imageId = req.body.imageId;
                let currentUserId = authData.userid;
                database.getImage(client.db('socialwebpage'), res, imageId, currentUserId);
            }
        });
    });

    //----------------------------Update an image----------------------------//
    app.put('/rest/image/edit', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                let imageId = req.body.imageId;
                let imageTitle = req.body.imageTitle;
                let imageContent = req.body.imageContent;
                let currentUserId = authData.userid;
                database.updateImage(client.db('socialwebpage'), res, imageId, imageTitle, imageContent, currentUserId);
            }
        });
    });

    //--------------------------Create a comment-----------------------------//
    app.post('/rest/comment/create', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const commentData = req.body.commentData;
                const currentUserId = authData.userid;
                database.createComment(client.db('socialwebpage'), res, commentData, currentUserId);
            }
        });
    });

    //----------------------------Get all comments----------------------------//
    app.get('/rest/comment/list', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                  res.json([]);
            } else {
                const currentUserId = authData.userid;
                database.getComments(client.db('socialwebpage'), res, currentUserId);
            }
        });
    });

    //-----------------------------Get all users-----------------------------//
    app.get('/rest/user/all', (req, res) => {
        database.getAllUsers(client.db('socialwebpage'), res);
    });

    //----------------------------Delete a comment---------------------------//
    app.post('/rest/comment/delete', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const commentId = req.body.commentId;
                const userId = authData.userid;
                database.deleteCommentById(client.db('socialwebpage'), res, commentId, userId);
            }
        });
    });

    //--------------------------Get all notifications------------------------//
    app.get('/rest/notifications', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json([]);
            } else {
                const userId = authData.userid;
                database.getNotifications(client.db('socialwebpage'), res, userId);
            }
        });
    });

    //----------------------Show a specific notification---------------------//
    app.get('/rest/notifications/data/:type/:typeCommented/:postId', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.json({});
            } else {
                const currentUserId = authData.userid;
                const type = req.params.type;
                const typeCommented = req.params.typeCommented;
                const postId = req.params.postId;

                if(req.params.type == "story") {
                    database.getStoryEntry(client.db('socialwebpage'), res, postId, currentUserId);
                }
                else if(req.params.type == "image") {
                    database.getImage(client.db('socialwebpage'), res, postId, currentUserId);
                }
                else if(req.params.type == "guestbook") {
                    database.getGuestBookEntry(client.db('socialwebpage'), res, postId, currentUserId);
                }
                else if(req.params.type == "comment") {
                    if(req.params.typeCommented == "story") {
                        database.getStoryEntry(client.db('socialwebpage'), res, postId, currentUserId);
                    }
                    else if(req.params.typeCommented == "image") {
                        database.getImage(client.db('socialwebpage'), res, postId, currentUserId);
                    }
                    else if(req.params.typeCommented == "guestbook") {
                        database.getGuestBookEntry(client.db('socialwebpage'), res, postId, currentUserId);
                    } else {
                        res.send(false);
                    }
                } else {
                    res.send(false);
                }
            }
        });
    });

    //-----------------------------Like a comment----------------------------//
    app.post('/rest/comment/like', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send(false);
            } else {
                const commentId = req.body.commentId;
                const userId = authData.userid;
                database.likeComment(client.db('socialwebpage'), res, commentId, userId);
            }
        });
    });

    //------------------------------Delete a user----------------------------//
    app.post('/rest/user/delete', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err) {
                res.send({userDelete: false });
            } else {
                const userId = req.body.userId;
                const currentUserId = authData.userid;
                database.deleteUser(client.db('socialwebpage'), res, userId, currentUserId);
            }
        });
    });

    app.listen(8000, function() {
        console.log('Listening for API Requests on port 8000...')
    });
  }
})

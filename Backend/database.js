var SHA256 = require("crypto-js/sha256");
var session = require('express-session')
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs');

var call = module.exports = {


  //----------------------LOGIN----------------------//
  checkUserCredentials: function (db, req, res, userCredential) {
      //Select table and parse form input fields
      const collection = db.collection('users');
      let username = (JSON.parse(userCredential).username).trim();
      let password = JSON.parse(userCredential).password;
      let passwordHashed = SHA256(password);

      if(!username || !password) {
          res.send(JSON.stringify({
              message: "The fields are required."
          }));
       } else {
           //Check username and password
           if (username != null && password != null) {
               collection.findOne({"username": username}, (err, docs) => {
                   if (err) {
                       console.log(username, " tried to login")
                       res.send(JSON.stringify({
                           message: "Sorry, your password is incorrect. Please check again."
                       }));
                       throw err;
                   }

                   if (docs) {
                       if(JSON.stringify(passwordHashed.words) === JSON.stringify(docs.password.words) ) {
                           jwt.sign({userid: docs._id, username: docs.username}, 'secretkey', (err, token) => {
                               console.log("Correct credentials! Login from user: ", docs.username)
                               res.send(JSON.stringify({
                                   message : "Correct credentials",
                                   token,
                               }));
                           });
                       } else {
                           console.log(username, " tried to login")
                           res.send(JSON.stringify({
                               message: "Sorry, your password is incorrect. Please check again."
                           }));
                       }
                   }
                   else {
                       console.log(username, " tried to login")
                       res.send(JSON.stringify({
                           message: "Sorry, your password is incorrect. Please check again."
                       }));
                   }
               })
           }
       }
  },

  //----------------------REGISTER----------------------//
  registerUserToPlatform: function (db, req, res, newUserData) {
      //Select table and parse form input fields
      const collection = db.collection('users');
      let firstname = JSON.parse(newUserData).username;
      let lastname = JSON.parse(newUserData).lastname;
      let username = JSON.parse(newUserData).username;
      let email = JSON.parse(newUserData).email;
      let password = JSON.parse(newUserData).password;
      let birthday = JSON.parse(newUserData).birthday;
      let gender = JSON.parse(newUserData).gender;
      let profilePicture = "";
      let friends = [];

      let passwordHashed = SHA256(password);

      //Check username and password
      if(username !== null && password !== null) {
          //Check valid email => we will fake it but normally there are npm that validate the email
          const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if(email !== null) {
              if(email.match(mailformat)) {
                  // Check valid date format
                  if(birthday.length !== 0) {
                      const dateformat = /(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d/;
                      //const dateformat = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
                      if(birthday.match(dateformat)) {
                          collection.findOne({"username": username}, (err, docs) => {
                              if (err) {
                                  throw err;
                              }

                              if(docs) {
                                  res.send(JSON.stringify({
                                      message: "This username is not available. Please try another one."
                                  }));
                              } else {
                                  collection.findOne({"email": email}, (err, docs) => {
                                      if (err) {
                                          throw err;
                                      }
                                      if(docs) {
                                          res.send(JSON.stringify({
                                              message: "This email is not available. Please try another one."
                                          }));
                                      } else {
                                          console.log("User created: ", username);

                                          collection.insert({
                                              "first_name": firstname,
                                              "last_name": lastname,
                                              "username": username,
                                              "email": email,
                                              "password": passwordHashed,
                                              "birthday": birthday,
                                              "gender": gender,
                                              "picture": profilePicture,
                                              "friends": friends
                                          })

                                          res.send(JSON.stringify({
                                              message: "User successfully created",
                                              messageDetails: "Your user registration was successful. You may now Login with the username you have chosen."
                                          }));
                                      }
                                  })
                              }

                          })
                      } else {
                          res.send(JSON.stringify({
                              message: "Please enter correct date format: dd/mm/yyyy."
                          }));
                      }
                  } else {
                      collection.findOne({"username": username}, (err, docs) => {
                          if (err) {
                              throw err;
                          }

                          if(docs) {
                              res.send(JSON.stringify({
                                  message: "This username is not available. Please try another one."
                              }));
                          } else {
                              collection.findOne({"email": email}, (err, docs) => {
                                  if (err) {
                                      throw err;
                                  }
                                  if(docs) {
                                      res.send(JSON.stringify({
                                          message: "This email is not available. Please try another one."
                                      }));
                                  } else {
                                      console.log("User created: ", username);
                                      res.send(JSON.stringify({
                                          message: "User successfully created",
                                          messageDetails: "Your user registration was successful. You may now Login with the username you have chosen."
                                      }));

                                      collection.insert({
                                          "first_name": firstname,
                                          "last_name": lastname,
                                          "username": username,
                                          "email": email,
                                          "password": passwordHashed,
                                          "birthday": birthday,
                                          "gender": gender,
                                          "picture": profilePicture,
                                          "friends": friends
                                      })
                                  }
                              })
                          }

                      })
                  }
              } else {
                  res.send(JSON.stringify({
                      message: "You have entered an invalid email address."
                  }));
              }
          } else {
              res.send(JSON.stringify({
                  message: "Username and Password is required."
              }));
          }
      }

  },

  //----------------------Get Feed----------------------//
  //
  // Sends all story entries and images sorted by date to the react application.
  getFeed: function (db, req, res, userId) {
    db.collection('images').aggregate([
        { $lookup:
           {
             from: "users",
             localField: "user_id",
             foreignField: "_id",
             as: "user"
           }
         },
         { $project :
            {
                "title" : 1,
                "content": 1,
                "src": 1,
                "filename": 1,
                "number_of_likes": 1,
                "liking_users": 1,
                "current_user_has_liked" : {
                    "$cond": { if: { "$in": [ userId , "$liking_users"] }, then: "1", else: "0" }
                },
                date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created", timezone: "Europe/Berlin"}},
                "user_id": 1,
                "username": {
                    "$cond": { if: { "$eq": [ "$user", [] ] }, then: "Anonym", else: "$user.username" }
                }
            }
         }
        ]).toArray((err_images, res_images) => {
            if (err_images) throw err_images;
            db.collection('stories').aggregate([
                { $lookup:
                    {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $project :
                    {
                        "title" : 1,
                        "content": 1,
                        "number_of_likes": 1,
                        "liking_users": 1,
                        "current_user_has_liked" : {
                            "$cond": { if: { "$in": [ userId , "$liking_users"] }, then: "1", else: "0" }
                        },
                        date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created",timezone: "Europe/Berlin"}},
                        "user_id": 1,
                        "username": {
                            "$cond": { if: { "$eq": [ "$user", [] ] }, then: "Anonym", else: "$user.username" }
                        }
                    }
                }
                ]).toArray((err_stories, res_stories) => {
                    if (err_stories) throw err_stories;

                    res_stories.map(item => {
                        item.number_of_likes = item.liking_users.length;
                    });
                    res_images.map(item => {
                        item.src = "https://" + req.hostname + "/uploads/posts/" + item.filename;
                        item.number_of_likes = item.liking_users.length;
                    });

                    let feed = res_images.concat(res_stories);
                    feed.sort((a, b) => {
                        return new Date(b.date_created) - new Date(a.date_created);
                    });
                    feed.map(item => {
                        item.date_created = getDate(item.date_created);
                    });
                    res.status(200).send(feed);
          });
      });
  },

  //----------------------Upload Image----------------------//
  //
  // Receives a file from the react application and stores it
  // to the database.
  uploadImageToPlatform: function (db, res, file) {
    const fileData = file.fileData;
    const fileDataInfo = file.fileDataInfo;
    const userid = file.userid;

    let title = JSON.parse(fileDataInfo).title;
    let content = JSON.parse(fileDataInfo).content;
    let src = JSON.parse(fileData).destination;
    let filename = JSON.parse(fileData).filename;
    let userId = userid;
    db.collection('images').insert({
        "title": title,
        "content": content,
        "filename": filename,
        "liking_users": [],
        "date_created": new Date(),
        "user_id": new ObjectId(userId)
    });
    console.log("Image was uploaded to server...")
    res.send(JSON.stringify({
        message: "Image uploaded"
    }));

    },

  //----------------------Create Story Entry----------------------//
  //
  // Receives the titel and the content of a story and inserts it to the database.
  // After that, a message with "true" is send to the react application.
  createStoryEntry: function (db, res, file) {
    let title = JSON.parse(file.storyData).title;
    let content = JSON.parse(file.storyData).content;
    let userId = file.userid;

    console.log("Story was uploaded to server...")
    db.collection('stories').insert({
        "title": title,
        "content": content,
        "liking_users": [],
        "date_created": new Date(),
        "user_id": new ObjectId(userId)
    });
    res.send(true);
  },

  //----------------------List Story Entries in Profile for a Username----------------------//
  //
  // Receives the name of a user, fetchs the corresponding user id from the database and
  // calls the method listStoryEntriesForUserId.
  listStoryEntriesForUsername: function(db, res, username, currentUserId) {
      const collection = db.collection('users');
      collection.findOne({"username": username}, (err, docs) => {
          if (err) {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
              throw err;
          }

          if (docs) {
              call.listStoryEntriesForUserId(db, res, docs._id, currentUserId)
          }
          else {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
          }
      })
  },

  //----------------------List Images in Profile for a Username----------------------//
  //
  // Receives the name of a user, fetchs the corresponding user id from the database and
  // calls the method listImagesForUserId.
  listImagesForUsername: function(db, req, res, username, currentUserId) {
    const collection = db.collection('users');
    collection.findOne({"username": username}, (err, docs) => {
        if (err) {
            res.send(JSON.stringify({
                message: "User not found"
            }));
            throw err;
        }

        if (docs) {
            call.listImagesForUserId(db, req, res, docs._id, currentUserId)
        }
        else {
            res.send(JSON.stringify({
                message: "User not found"
            }));
        }
    })
},

  //----------------------List Story Entries in Profile----------------------//
  //
  // Receives the userId of a user and sends all story entries of this user
  // to the react application. These story entries are sorted by date.
  listStoryEntriesForUserId: function (db, res, userId, currentUserId) {
    db.collection('stories').aggregate([
        { $match : { user_id : new ObjectId(userId) } },
        { $lookup:
           {
             from: "users",
             localField: "user_id",
             foreignField: "_id",
             as: "user"
           }
         },
         { $project : {
                "title" : 1,
                "content": 1,
                date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created", timezone: "Europe/Berlin"}},
                "number_of_likes": 1,
                "liking_users" : 1,
                "current_user_has_liked" : {
                    "$cond": { if: { "$in": [ currentUserId , "$liking_users"] }, then: "1", else: "0" }
                },
                "user_id": 1,
                "username": {
                    "$cond": { if: { "$eq": [ "$user", [] ] }, then: "Anonym", else: "$user.username" }
                }
            }
         },
         { $sort : { "date_created" : -1 } }
        ]).toArray((err_stories, result_stories) => {
        if (err_stories) throw err_stories;
            result_stories.map(item => {
                item.date_created = getDate(item.date_created);
                item.number_of_likes = item.liking_users.length;
            });
            res.status(200).send(result_stories);
    });
  },

  //----------------------List Images in Profile----------------------//
  //
  // Receives the userId of a user and sends all images of this user
  // to the react application. These images are sorted by date.
  listImagesForUserId: function (db, req, res, userId, currentUserId) {
    db.collection('images').aggregate([
        { $match : { user_id : new ObjectId(userId) } },
        { $lookup:
           {
             from: "users",
             localField: "user_id",
             foreignField: "_id",
             as: "user"
           }
         },
         { $project :
            {
                "title" : 1,
                "content": 1,
                "src": 1,
                "filename": 1,
                "number_of_likes": 1,
                "liking_users": 1,
                "current_user_has_liked" : {
                    "$cond": { if: { "$in": [ currentUserId , "$liking_users"] }, then: "1", else: "0" }
                },
                date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created", timezone: "Europe/Berlin"}},
                "user_id": 1,
                "username": {
                    "$cond": { if: { "$eq": [ "$user", [] ] }, then: "Anonym", else: "$user.username" }
                }
            }
         },
         { $sort : { "date_created" : -1 } }
        ]).toArray((err_images, result_images) => {
        if (err_images) throw err_images;
        result_images.map(item => {
            item.date_created = getDate(item.date_created);
            item.src = "https://" + req.hostname + "/uploads/posts/" + item.filename;
            item.number_of_likes = item.liking_users.length;
        });
            res.status(200).send(result_images);
    });
  },

  //----------------------Get Other User----------------------//
  getOtherUserProfile: function(db, req, res, username, myUsername) {
      const collection = db.collection('users');
      collection.findOne({"username": username}, (err, docs) => {
          if (err) {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
              throw err;
          }

          if (docs) {

              //Check if they are alredy friends or friend request is on its way
              db.collection('friendRequests').findOne({ $and : [
                      {$or: [ {"requester": myUsername, "recipient": username}, {"requester": username, "recipient": myUsername} ]},
                      {"status": "open"}
                  ]},
                  (err, docs2) => {
                  // If already sent, means request was send, dont send it
                  if(err) throw err;

                  var buttonState = "";

                  if ((docs.friends).includes(myUsername)) {
                      buttonState = "Delete Friend";
                  } else if (docs2) {
                      buttonState = "Cancel Request";
                  } else {
                      buttonState = "Add Friend";
                  }

                  res.send(JSON.stringify({
                      username: docs.username,
                      firstname: docs.first_name,
                      lastname: docs.last_name,
                      email: docs.email,
                      picture: "https://" + req.hostname + "/uploads/posts/" + docs.picture,
                      buttonState: buttonState
                  }));
              })

          }
          else {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
          }
      })

  },

  //----------------------Get Current User----------------------//
  getCurrentUserProfile: function(db, req, res, userid) {
      const collection = db.collection('users');
      collection.findOne({"_id": ObjectId(userid)},(err, docs) => {
          if (err) {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
              throw err;
          }

          if (docs) {
              res.send(JSON.stringify({
                  username: docs.username,
                  firstname: docs.first_name,
                  lastname: docs.last_name,
                  email: docs.email,
                  picture: "https://" + req.hostname + "/uploads/posts/" + docs.picture
              }));
          }
          else {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
          }
      })
  },

  //----------------------Delete Story Entry----------------------//
  //
  // Receives the id of a story entry and deletes it from the database.
  // After that, a message with "true" is send to the react application.
  deleteStoryEntryById: function (db, res, storyId, userId) {

    db.collection("stories").findOne({ _id : new ObjectId(JSON.parse(storyId).storyId) }, (err, docs) => {
        if (err) throw err;
        if (docs.user_id == userId) {
            db.collection("stories").remove({ _id : new ObjectId(JSON.parse(storyId).storyId) }, (err, docs) => {
                if (err) throw err;
                res.send(true);
            });
        }
        else {
            res.send(false);
        }
    });
  },

  //----------------------Delete Image---------------------//
  //
  // Receives the id of an image and deletes it from the database.
  // After that, a message with "true" is send to the react application.
  deleteImageById: function (db, res, imageId, userId) {

    db.collection("images").findOne({ _id : new ObjectId(JSON.parse(imageId).imageId) }, (err_find_images, res_find_images) => {
        if (err_find_images) throw err_find_images;
        if (res_find_images !== null && res_find_images.user_id == userId) {
            let path = "./public/uploads/posts/" + res_find_images.filename;
            fs.unlinkSync(path);
            db.collection("images").remove({ _id : new ObjectId(JSON.parse(imageId).imageId) }, (err_remove_image, res_remove_image) => {
                if (err_remove_image) throw err_remove_image;
                res.send(true);
            });
        }
        else {
            res.send(false);
        }
    });
  },

  //----------------------Like Story Entry----------------------//
  //
  // Receives the id of a story entry and of a user, fetchs the array with likes from
  // the database and add or remove the current user from this array.
  // After that, a message with "true" is send to the react application.
  likeStoryEntryById: function (db, res, storyId, userId) {

    db.collection("stories").findOne(
        {
            _id : new ObjectId(JSON.parse(storyId).storyId)
        },
        (err_find_stories, res_find_stories) => {

        if (err_find_stories) throw err_find_stories;
        if (res_find_stories.liking_users.includes(userId)) {
            let index = res_find_stories.liking_users.indexOf(userId);
            if (index > -1) {
                res_find_stories.liking_users.splice(index, 1);
            }
            else {
                throw err_find_stories;
            }
        }
        else {
            res_find_stories.liking_users.push(userId);
        }

        db.collection("stories").update(
            {
                _id : new ObjectId(JSON.parse(storyId).storyId)
            },
            {
                $set: { liking_users: res_find_stories.liking_users }
            },
            (err_update_stories, res_update_stories) => {

            if (err_update_stories) throw err_update_stories;
        });
        res.send(true);
    });
  },

  //----------------------Like Image----------------------//
  //
  // Receives the id of an image and of a user, fetchs the array with likes from
  // the database and add or remove the current user from this array.
  // After that, a message with "true" is send to the react application.
  likeImageById: function (db, res, imageId, userId) {

    db.collection("images").findOne(
        {
            _id : new ObjectId(JSON.parse(imageId).imageId)
        },
        (err_find_images, res_find_images) => {

        if (err_find_images) {
            res.send(JSON.stringify({
                message: "Error while liking the image with id: " + imageId
            }));
            throw err_find_images;
        }
        if(res_find_images.liking_users.includes(userId)) {
            let index = res_find_images.liking_users.indexOf(userId);
            if (index > -1) {
                res_find_images.liking_users.splice(index, 1);
            }
            else {
                res.send(JSON.stringify({
                    message: "Error while liking the image with id: " + userId
                }));
                throw err_find_images;
            }
        }
        else {
            res_find_images.liking_users.push(userId);
        }

        db.collection("images").update(
            {
                _id : new ObjectId(JSON.parse(imageId).imageId)
            },
            {
                $set: { liking_users: res_find_images.liking_users }
            },
            (err_update_images, res_update_images) => {

            if (err_update_images) {
                res.send(JSON.stringify({
                    message: "Error while updating the image with id: " + imageId
                }));
                throw err_update_images;
            }
        });
        res.send(true);
    });
  },

  //----------------------Update User Data at Settings----------------------//
updateUserData: function(db, res, data) {
    const collectionUsers = db.collection('users');

    const userid = data.userid;
    const userData = data.userData
    const hashedPassword = SHA256(userData.password)
    let username = (userData.username).trim();
    var checkUsername = false;
    var checkEmail = false;

    collectionUsers.findOne({"username": username}, (err, docs) => {
        if (err) {
            throw err;
        }

        if(docs) {
            if(docs._id == userid) {
                // Username is same => no update => check for email
                collectionUsers.findOne({"email": userData.email}, (err, docs) => {
                    if (err) {
                        throw err;
                    }

                    if(docs) {
                        if(docs._id == userid) {
                            // Email is same => no update => update fields
                            console.log(username, " changed successfully its user data")
                            if(userData.password !== '') {
                                collectionUsers.update(
                                    {_id: ObjectId(userid)},
                                    {
                                        $set: {
                                            "first_name": userData.first_name,
                                            "last_name": userData.last_name,
                                            "username": username,
                                            "email": userData.email,
                                            "password": hashedPassword
                                        }
                                    }
                                );
                            } else {
                                collectionUsers.update(
                                    {_id: ObjectId(userid)},
                                    {
                                        $set: {
                                            "first_name": userData.first_name,
                                            "last_name": userData.last_name,
                                            "username": username,
                                            "email": userData.email
                                        }
                                    }
                                );
                            }
                            res.send(JSON.stringify({
                                message: "User data successfully updated."
                            }));
                          }
                    } else {
                        // Email is already given
                        res.send(JSON.stringify({
                            message: "This email is not available. Please try another one."
                        }));
                    }
                })
            } else {
                // Username is already given
                res.send(JSON.stringify({
                    message: "This username is not available. Please try another one."
                }));
            }
        } else {
            //Check email
            collectionUsers.findOne({"email": userData.email}, (err, docs) => {
                if (err) {
                    throw err;
                }

                if(docs) {
                    if(docs._id == userid) {
                        // Email is same => no update => update fields
                        console.log(userData.username, " changed successfully its user data")
                        if(userData.password !== '') {
                            collectionUsers.update(
                                {_id: ObjectId(userid)},
                                {
                                    $set: {
                                        "first_name": userData.first_name,
                                        "last_name": userData.last_name,
                                        "username": username,
                                        "email": userData.email,
                                        "password": hashedPassword
                                    }
                                }
                            );
                        } else {
                            collectionUsers.update(
                                {_id: ObjectId(userid)},
                                {
                                    $set: {
                                        "first_name": userData.first_name,
                                        "last_name": userData.last_name,
                                        "username": username,
                                        "email": userData.email
                                    }
                                }
                            );
                        }
                        res.send(JSON.stringify({
                            message: "User data successfully updated."
                        }));
                      }
                } else {
                    // Email is already given
                    res.send(JSON.stringify({
                        message: "This email is not available. Please try another one."
                    }));
                }
            })
        }
    })

},

  //----------------------Friend----------------------//
  sendFriendshipRequest: function(db, res, userId, requester, recipient) {
      const collectionUsers = db.collection('users');

      collectionUsers.findOne({"username": recipient}, (err, docs) => {
          if (err) {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
              throw err;
          }

          if (docs) {
              const recipientId = docs._id;
              const recipient = docs.username;

              //Check if request is already sent... (open status) A to B and B to A
              //If not, send request... (put in db)

              db.collection('friendRequests').findOne({"requester": requester, "recipient": recipient}, (err, docs) => {
                  // If already sent, means request was send, dont send it
                  if(err) throw err;
                  if (docs) {
                      res.send(JSON.stringify({
                          buttonState: "Undo Friend"
                      }));
                  } else {
                      console.log("Request sent to add new friend...")

                      res.send(JSON.stringify({
                          buttonState: "Request sent"
                      }));

                      db.collection('friendRequests').insert({
                          "requester": requester,
                          "requesterId": ObjectId(userId),
                          "recipient": recipient,
                          "recipientId": recipientId,
                          "time": Date(),
                          "status": "open"
                      });
                  }
              })
          }
          else {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
          }
      })
  },

  //----------------------xy----------------------//
  //getFriendRequests => where recipient is userid and status open
  // if decline: status = rejected
  // if status = accepted
  getFriendRequests: function(db, res, userId) {
      const collectionfriendRequests = db.collection('friendRequests');
      const collectionUsers = db.collection('users');

      collectionfriendRequests.find({"status": "open", "recipientId": ObjectId(userId)}).toArray((err, docs) => {
          if (err) throw err;
          if (docs) {
              res.status(200).send(docs);
          }
      })

    },

    //----------------------xy----------------------//
    confirmFriendshipRequest: function(db, requester, recipient , res) {
        const collectionfriendRequests = db.collection('friendRequests');
        const collectionUsers = db.collection('users');

        // Set status to accepted
        //Delete from database
        collectionfriendRequests.update({"requester": requester, "recipient": recipient},
            {
                $set: {
                    "status": "accepted"
                }
            }
        );

        // Add to friendlist of both array.push()
        collectionUsers.findOne({"username": requester}, (err, docs) => {
            if(err) throw err;
            if(docs) {
                var friendlist = docs.friends;
                friendlist.push(recipient);
                collectionUsers.update({"username": requester},
                    {
                        $set: {
                            "friends": friendlist
                        }
                    }
                );
            }
        });

        collectionUsers.findOne({"username": recipient}, (err, docs) => {
            if(err) throw err;
            if(docs) {
                var friendlist = docs.friends;
                friendlist.push(requester);
                collectionUsers.update({"username": recipient},
                    {
                        $set: {
                            "friends": friendlist
                        }
                    }
                );
            }
        });
        res.send(true);
    },

    //----------------------xy----------------------//
    deleteFriendshipRequest: function(db, requester, recipient , res) {
        const collectionfriendRequests = db.collection('friendRequests');

        collectionfriendRequests.remove({"requester": requester, "recipient": recipient}, (err, res_stories) => {
            if (err) throw err;
            res.send(true);
        });
    },

    getFriends: function(db, res, userId) {
        const collectionUsers = db.collection('users');
        collectionUsers.findOne({_id : ObjectId(userId)}, (err, docs) => {
            if(err) throw err;
            if (docs) {
                res.send(docs.friends.sort())
            }
        })
    },

    deleteFriend: function(db, res, userId, userToDelete) {
        const collectionUsers = db.collection('users');

        //Delete friend from first user
        collectionUsers.findOne({_id : ObjectId(userId)}, (err, docs) => {
            if(err) throw err;
            if (docs) {
                // Find and remove item from an array
                var i = (docs.friends).indexOf(userToDelete);
                if(i != -1) {
                	(docs.friends).splice(i, 1);
                }
                collectionUsers.update({_id : ObjectId(userId)},
                    {
                        $set: {
                            "friends": docs.friends
                        }
                    }
                );

                //Delete friend from second user
                collectionUsers.findOne({username : userToDelete}, (err, docs2) => {
                    if(err) throw err;
                    if (docs2) {
                        // Find and remove item from an array
                        var j = (docs2.friends).indexOf(docs.username);
                        if(j != -1) {
                            (docs2.friends).splice(j, 1);
                        }
                        collectionUsers.update({username: userToDelete},
                            {
                                $set: {
                                    "friends": docs2.friends
                                }
                            }
                        );
                        res.send(true);
                    }
                });
            }
        });
    },


  // ----------------------------------------Guestbook------------------------------------------//

  //-----------------------------------Create Guestbook Entry-----------------------------------//
  //
  // Receives the titel and the content of a guestbook and inserts it to the database.
  // After that, a message with "true" is send to the react application.
  createGuestbookEntry: function (db, res, title, content, ownerName, authorId) {
    if(ownerName) {
        db.collection('users').findOne({"username": ownerName}, (err_user, res_user) => {
            if (err_user) throw err_user;

            if (res_user && (res_user._id != authorId)) {
                db.collection('guestbookEntries').insert({
                    "title": title,
                    "content": content,
                    "liking_users": [],
                    "date_created": new Date(),
                    "owner_id": new ObjectId(res_user._id),
                    "author_id": new ObjectId(authorId),
                });
                res.send(true);
            }
            else {
                console.log("It is not possible to post a guestbook entry on the own profile!");
                res.send(false);
            }
        })
    } else {
        console.log("It is not possible to post a guestbook entry on the own profile!");
        res.send(false);
    }
  },

  //----------------------List Guestbook Entries in Profile for a Username----------------------//
  //
  // Receives the name of a user, fetchs the corresponding user id from the database and
  // calls the method listGuestbookEntriesForUserId.
  listGuestbookEntriesForUsername: function(db, res, username, currentUserId) {
    db.collection('users').findOne({"username": username}, (err, docs) => {
        if (err) {
            res.send(JSON.stringify({
                message: "User not found"
            }));
            throw err;
        }

        if (docs) {
            call.listGuestbookEntriesForUserId(db, res, docs._id, currentUserId)
        }
        else {
            res.send(JSON.stringify({
                message: "User not found"
            }));
        }
    })
},

//----------------------List Guestbook Entries in Profile----------------------//
//
// Receives the userId of a user and sends all guestbook entries of this user
// to the react application. These story entries are sorted by date.
listGuestbookEntriesForUserId: function (db, res, userId, currentUserId) {
  db.collection('guestbookEntries').aggregate([
      { $match : { owner_id : new ObjectId(userId) } },
      { $lookup:
         {
           from: "users",
           localField: "author_id",
           foreignField: "_id",
           as: "author"
         }
       },
       { $project : {
              "title" : 1,
              "content": 1,
              date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created", timezone: "Europe/Berlin"}},
              "number_of_likes": 1,
              "liking_users" : 1,
              "current_user_has_liked" : {
                  "$cond": { if: { "$in": [ currentUserId , "$liking_users"] }, then: "1", else: "0" }
              },
              "user_id": 1,
              "username": {
                  "$cond": { if: { "$eq": [ "$author", [] ] }, then: "Anonym", else: "$author.username" }
              }
          }
       },
       { $sort : { "date_created" : -1 } }
      ]).toArray((err_guestbook_entries, res_guestbook_entries) => {
      if (err_guestbook_entries) throw err_guestbook_entries;
        res_guestbook_entries.map(item => {
              item.date_created = getDate(item.date_created);
              item.number_of_likes = item.liking_users.length;
          });
          res.status(200).send(res_guestbook_entries);
  });
},

  //----------------------Like Guestbook Entry----------------------//
  //
  // Receives the id of a guestbook entry and of a user, fetchs the array with likes from
  // the database and add or remove the current user from this array.
  // After that, a message with "true" is send to the react application.
  likeGuestbookEntryById: function (db, res, guestbookData, userId) {
    db.collection("guestbookEntries").findOne(
        {
            _id : new ObjectId(guestbookData.guestbookEntryId)
        },
        (err_find_guestbook_entries, res_find_guestbook_entries) => {

        if (err_find_guestbook_entries) throw err_find_guestbook_entries;
        if (res_find_guestbook_entries.liking_users.includes(userId)) {
            let index = res_find_guestbook_entries.liking_users.indexOf(userId);
            if (index > -1) {
                res_find_guestbook_entries.liking_users.splice(index, 1);
            }
            else {
                throw err_find_guestbook_entries;
            }
        }
        else {
            res_find_guestbook_entries.liking_users.push(userId);
        }
        db.collection("guestbookEntries").update(
            {
                _id : new ObjectId(guestbookData.guestbookEntryId)
            },
            {
                $set: { liking_users: res_find_guestbook_entries.liking_users }
            },
            (err_update_guestbook_entries, res_update_guestbook_entries) => {

            if (err_update_guestbook_entries) throw err_update_guestbook_entries;
        });
        res.send(true);
    });
  },

  //----------------------Delete Guestbook Entry----------------------//
  //
  // Receives the id of a guestbook entry and deletes it from the database.
  // After that, a message with "true" is send to the react application.
  deleteGuestbookEntryById: function (db, res, guestbookData, userId) {
    db.collection("guestbookEntries").findOne({ _id : new ObjectId(guestbookData.guestbookEntryId) }, (err_find_guestbook_entries, res_find_guestbook_entries) => {
        if (err_find_guestbook_entries) throw err_find_guestbook_entries;
        if (res_find_guestbook_entries.owner_id == userId) {
            db.collection("guestbookEntries").remove({ _id : new ObjectId(guestbookData.guestbookEntryId) }, (err_remove_guestbook_entries, res_remove_guestbook_entries) => {
                if (err_remove_guestbook_entries) throw err_remove_guestbook_entries;
                res.send(true);
            });
        }
        else {
            res.send(false);
        }
    });
  },

  //----------------------Upload Profile Picture----------------------//
  uploadProfilePic: function (db, res, file) {
    const collectionUsers = db.collection('users');
    const fileData = file.fileData;
    const userid = file.userid;

    let filename = fileData.filename;
    let userId = userid;

    collectionUsers.update({_id: ObjectId(userid)},
        {
            $set: {
                "picture": filename
            }
        }
    )

    console.log("Profile Pic was uploaded to server...")
    res.send(JSON.stringify({
        message: "Image uploaded"
    }));

  },

    //----------------------Delete Profile Pic---------------------//
    deleteProfilePic: function (db, res, userId) {

        const collectionUsers = db.collection('users');

        collectionUsers.findOne({ _id : new ObjectId(userId)}, (err, docs) => {
            if (err) {
                res.send(JSON.stringify({
                    message: "User not found"
                }));
                throw err;
            }
            if (docs) {
                //Delete image from Server
                let path = "./public/uploads/posts/" + docs.picture;
                fs.unlinkSync(path);

                //Delete from database
                collectionUsers.update({ _id : new ObjectId(userId) },
                    {
                        $set: {
                            "picture": ""
                        }
                    }
                );

                console.log(docs.username, " deleted his Profile Picture")
                res.send(JSON.stringify({
                    message: "Profile Pic deleted"
                }));
            }
        })
    },

    // --------------------------Update Story Entries----------------------------//

    //------------------------------Get Story Entry------------------------------//
    //
    // Recieves the id of a story and the id of the current user and returns the
    // information of the story if the current user is the author of this story.
    getStoryEntry: function (db, res, storyId, currentUserId) {
        db.collection("stories").findOne({ _id : new ObjectId(storyId) }, (err_find_story_entries, res_find_story_entries) => {
            if (err_find_story_entries) throw err_find_story_entries;
            if (res_find_story_entries) {
                if (res_find_story_entries.user_id == currentUserId) {
                    res.status(200).send(res_find_story_entries);
                } else {
                    res.status(401).send(JSON.stringify({
                        message: "User is not authorized to update this story entry"
                    }));
                }
            } else {
                res.status(404).send(JSON.stringify({
                    message: "Can't find a story with id: " + storyId
                }));
            }
        });
    },

    //----------------------------Update Story Entry-----------------------------//
    //
    // Recieves the id of a story, the id of the current user and the new data of
    // this story entry that should be updated.
    // Returns true if the update was successful and false otherwise.
    updateStoryEntry: function (db, res, storyId, storyTitle, storyContent, currentUserId) {
        db.collection("stories").findOne({ _id : new ObjectId(storyId) }, (err_find_story_entries, res_find_story_entries) => {
            if (err_find_story_entries) throw err_find_story_entries;
            if (res_find_story_entries && res_find_story_entries.user_id == currentUserId) {
                db.collection("stories").update(
                    {_id: ObjectId(storyId)},
                    {
                        $set: {
                            "title": storyTitle,
                            "content": storyContent
                        }
                    }, (err_update_guestbook_entries, res_update_guestbook_entries) => {
                        if (err_update_guestbook_entries) throw err_update_guestbook_entries;
                        res.status(200).send(true);
                    }
                );
            } else {
                res.status(404).send(false);
            }
        });
    },


}

function getMonthName (month) {
    const monthNames = [
      "Jan.",
      "Feb.",
      "Mar.",
      "Apr.",
      "May",
      "Jun.",
      "Jul.",
      "Aug.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dec."
    ];

    return monthNames[month];
  }

  function getDate (date) {
      date = new Date(date);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let days = date.getDate();
      let months = getMonthName(date.getMonth());
      let year = date.getFullYear();
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      return  days + ". " + months + " " + year + ", " + hours + ":" + minutes;
    }

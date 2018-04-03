var md5 = require('js-md5');
var session = require('express-session')
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs');

var call = module.exports = {


  //----------------------LOGIN----------------------//
  checkUserCredentials: function (db, req, res, userCredential, fn) {
      //Select table and parse form input fields
      const collection = db.collection('users');
      let username = JSON.parse(userCredential).username;
      let password = JSON.parse(userCredential).password;
      let passwordHashed = md5(password);

      if(!username || !password) {
          res.send(JSON.stringify({
              message: "Felder ausfüllen..."
          }));
       } else {
           //Check username and password
           if (username != null && password != null) {
               collection.findOne({"username": username}, (err, docs) => {
                   if (err) {
                       res.send(JSON.stringify({
                           message: "User not found"
                       }));
                       throw err;
                   }

                   if (docs) {
                       if(passwordHashed == docs.password) {
                           console.log("Correct credentials");
                           jwt.sign({userid: docs._id, username: docs.username}, 'secretkey', (err, token) => {
                               res.send(JSON.stringify({
                                   message : "Correct credentials",
                                   token,
                               }));
                           });
                       } else {
                           console.log("Password wrong");
                           res.send(JSON.stringify({
                               message: "Password wrong"
                           }));
                       }
                   }
                   else {
                       res.send(JSON.stringify({
                           message: "User not found"
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

      let passwordHashed = md5(password);

      //Check username and password
      if (username != null && password != null) {
          collection.findOne({"username": username}, (err, docs) => {
              if (err) {
                  throw err;
              }

              if(docs) {
                  res.send(JSON.stringify({
                      message: "Username already taken"
                  }));
              } else {
                  collection.findOne({"email": email}, (err, docs) => {
                      if (err) {
                          throw err;
                      }
                      if(docs) {
                          res.send(JSON.stringify({
                              message: "E-Mail already given"
                          }));
                      } else {
                          console.log("User created!");

                          res.send(JSON.stringify({
                              message: "User successfully created"
                          }));

                          collection.insert({
                              "first_name": firstname,
                              "last_name": lastname,
                              "username": username,
                              "email": email,
                              "password": passwordHashed,
                              "birthday": birthday,
                              "gender": gender,
                          })
                      }
                  })
              }

          })
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
                        item.src = "http://" + req.hostname + ":8000/uploads/posts/" + item.filename;
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
            item.src = "http://" + req.hostname + ":8000/uploads/posts/" + item.filename;
            item.number_of_likes = item.liking_users.length;
        });
            res.status(200).send(result_images);
    });
  },

  //----------------------Get Other User----------------------//
  getOtherUserProfile: function(db, res, username) {
      const collection = db.collection('users');
      collection.findOne({"username": username}, (err, docs) => {
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
                  email: docs.email
              }));
          }
          else {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
          }
      })

  },

  //----------------------Get Current User----------------------//
  getCurrentUserProfile: function(db, res, userid) {
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
                  email: docs.email
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
    const hashedPassword = md5(userData.password)

    if(userData.password !== '') {
        collectionUsers.update(
            {_id: ObjectId(userid)},
            {
                $set: {
                    "first_name": userData.first_name,
                    "last_name": userData.last_name,
                    "username": userData.username,
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
                    "username": userData.username,
                    "email": userData.email
                }
            }
        );
    }
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

              db.collection('friendRequests').insert({
                  "requester": requester,
                  "requesterId": ObjectId(userId),
                  "recipient": recipient,
                  "recipientId": recipientId,
                  "time": Date(),
                  "status": "open"
              });

               console.log("Request sent to add new friend...")

               res.send(JSON.stringify({
                   buttonState: "Request sent"
               }));
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
              console.log(docs)
              res.status(200).send(docs);
          }
      })

    }
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

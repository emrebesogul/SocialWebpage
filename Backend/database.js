var md5 = require('js-md5');
var session = require('express-session')
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;

var test = module.exports = {


  //----------------------LOGIN----------------------//
  checkUserCredentials: function (db, req, res, userCredential,fn) {
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
               collection.findOne({"username": username}, function(err, docs) {
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

                           console.log("JWT created");

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
          collection.findOne({"username": username}, function(err, docs) {
              if (err) {
                  throw err;
              }

              if(docs) {
                  res.send(JSON.stringify({
                      message: "Username already taken"
                  }));
              } else {
                  collection.findOne({"email": email}, function(err, docs) {
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
  getFeed: function (db, req, res) {
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
                date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created", timezone: "Europe/Berlin"}},
                "user_id": 1,
                "username": {
                    "$cond": { if: { "$eq": [ "$user", [] ] }, then: "Anonym", else: "$user.username" }
                }
            }
         }
        ]).toArray(function(err_images, res_images) {
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
                        date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created",timezone: "Europe/Berlin"}},
                        "number_of_likes": 1,
                        "user_id": 1,
                        "username": {
                            "$cond": { if: { "$eq": [ "$user", [] ] }, then: "Anonym", else: "$user.username" }
                        }
                    }
                }
                ]).toArray(function(err_stories, res_stories) {
                    if (err_stories) throw err_stories;

                    res_stories.map(item => {
                        item.date_created = getDate(item.date_created);
                    });
                    res_images.map(item => {
                        item.date_created = getDate(item.date_created);
                        item.src = "http://" + req.hostname + ":8000/uploads/posts/" + item.filename
                    });

                    let feed = res_images.concat(res_stories);
                    feed.sort(function(a, b) {
                        return new Date(b.date_created) - new Date(a.date_created);
                    });
                    res.status(200).send(feed);
          });
      });
  },


  //----------------------Upload Image----------------------//
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
        "number_of_likes": 0,
        "date_created": new Date(),
        "user_id": new ObjectId(userId)
    });

    res.send(JSON.stringify({
        message: "Image uploaded"
    }));

    },


  //----------------------Create Story Entry----------------------//
  //
  // Receives the titel and the content of a story and inserts it
  // to the database. After that, a message with "true" is send to
  // the react application.
  createStoryEntry: function (db, res, file) {
    console.log(file)
    let title = JSON.parse(file.storyData).title;
    let content = JSON.parse(file.storyData).content;
    let userId = file.userid;

    db.collection('stories').insert({
        "title": title,
        "content": content,
        "number_of_likes": 0,
        "date_created": new Date(),
        "user_id": new ObjectId(userId)
    });
    res.send(true);
  },

  //----------------------List Story Entries in Profile----------------------//
  //
  // Receives the userId of a user and sends all story entries of this user
  // to the react application. These story entries are sorted by date.
  getIdOfOtherUser: function(db, res, username) {
      const collection = db.collection('users');
      collection.findOne({"username": username}, function(err, docs) {
          if (err) {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
              throw err;
          }

          if (docs) {
              test.listStoryEntriesForUserId(db, res, docs._id)
          }
          else {
              res.send(JSON.stringify({
                  message: "User not found"
              }));
          }
      })

  },

  listStoryEntriesForUserId: function (db, res, userId) {
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
                date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created"}},
                "number_of_likes": 1,
                "user_id": 1,
                "username": {
                    "$cond": { if: { "$eq": [ "$user", [] ] }, then: "Anonym", else: "$user.username" }
                }
            }
         },
         { $sort : { "date_created" : -1 } }
        ]).toArray(function(err_stories, result_stories) {
        if (err_stories) throw err_stories;
            result_stories.map(item => {
                item.date_created = getDate(item.date_created);
            });
            res.status(200).send(result_stories);
    });
  },

  //----------------------List Story Entries in Profile For other people...----------------------//
  //
  // Receives the userId of a user and sends all story entries of this user
  // to the react application. These story entries are sorted by date.
  listStoryEntriesForUsername: function (db, res, userId) {
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
                date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created"}},
                "number_of_likes": 1,
                "user_id": 1,
                "username": {
                    "$cond": { if: { "$eq": [ "$user", [] ] }, then: "Anonym", else: "$user.username" }
                }
            }
         },
         { $sort : { "date_created" : -1 } }
        ]).toArray(function(err_stories, result_stories) {
        if (err_stories) throw err_stories;
            result_stories.map(item => {
                item.date_created = getDate(item.date_created);
            });
            res.status(200).send(result_stories);
    });
  },

  //----------------------xy----------------------//

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

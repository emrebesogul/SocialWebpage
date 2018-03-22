var md5 = require('js-md5');
var session = require('express-session')

module.exports = {


  //----------------------LOGIN----------------------//
  checkUserCredentials: function (db, req, res, userCredential) {
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
                           res.send(JSON.stringify({
                               message : "Correct credentials"
                           }));

                           //Save user id in session
                           req.session.userID = docs._id;
                           console.log("Saved User ID in Session: ", req.session.userID);

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
  registerUserToPlatform: function (db, res, newUserData) {
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


  //----------------------Feed----------------------//
  getFeed: function (db, res) {
      db.collection('images').find({}).toArray(function(err_images, res_images) {
          if (err_images) throw err_images;
          db.collection('stories').find({}).toArray(function(err_stories, result_stories) {
              if (err_stories) throw err_stories;
              var feed = res_images.concat(result_stories);
              feed.sort((a, b) => b.date_created - a.date_created);
              res.status(200).send(feed);
          });
      });
  }


  //----------------------xy----------------------//



}

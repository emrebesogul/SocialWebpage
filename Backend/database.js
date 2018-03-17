var md5 = require('js-md5');
var uuid = require('uuid');

module.exports = {

  //----------------------LOGIN----------------------//
  checkUserCredentials: function (db, res, userCredential) {
      //Select table and parse form input fields
      const collection = db.collection('users');
      let username = JSON.parse(userCredential).username;
      let password = JSON.parse(userCredential).password;
      let passwordHashed = md5(password);

      let sessionToken = uuid.v4();

      //Check username and password
      if (username != null && password != null) {
          collection.findOne({"username": username}, function(err, docs) {
              if (err) {
                  res.status(200).send(JSON.stringify({
                      message: "User not found"
                  }));
                  throw err;
              }

              console.log("Docs", docs);

              if (docs) {
                  //if(passwordHashed == docs[0].password) {
                  if (password == docs.password) {
                      console.log("Correct credentials");
                      res.status(200).send(JSON.stringify({
                          message : "Correct credentials", sessionToken: sessionToken, userID: docs._id,
                      }));
                  } else {
                      console.log("Password wrong");
                      res.status(200).send(JSON.stringify({
                          message: "Password wrong"
                      }));
                  }
              }
              else {
                  res.status(200).send(JSON.stringify({
                      message: "User not found"
                  }));
              }
          })
      }
  }

  //----------------------REGISTER----------------------//



}

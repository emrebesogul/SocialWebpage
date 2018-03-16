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
          collection.find({"username": username}).toArray(function(err, docs){
              if (err) {
                  throw err;
              }

              //if(passwordHashed == docs[0].password) {
              if(password == docs[0].password) {
                  res.status(200).send(JSON.stringify({
                      message: "Correct credentials", sessionToken: sessionToken, username: username
                  }));
              }
              else {
                  res.status(401).send({
                      error: "Password wrong"
                  });
              }
          })
      }
  }

  //----------------------REGISTER----------------------//



}

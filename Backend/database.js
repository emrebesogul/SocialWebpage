module.exports = {
  getAllUserData: function (db, res, callback) {
      let collection = db.collection('users');
      collection.find().toArray(function(err, docs){
          if (err) {
              throw err;
          }
          res.send(docs)
          console.log(docs);
      })
  },
  checkUserCredentials: function (db, res, userCredential) {
      let collection = db.collection('users');

      let user = JSON.parse(userCredential).username;
      let password = JSON.parse(userCredential).password;

      //Anmeldung mit Email weg, zu komliziert...!
      if(user != null && password != null) {
          collection.find({"username": user}).toArray(function(err, docs){
              if (err) {
                  throw err;
              }
              //console.log("Successfully fetched user data: ");
              //console.log(docs[0]);
              //console.log(docs[0].password);

              if(password == docs[0].password) {
                  console.log("Successfully fetched user data: " );
                  console.log(docs[0]);
                  res.send(docs);
              }
              else {
                  console.log("False credentials!");
                  res.send("false credentials");
              }
          })
      }
  }
}

//unct getAllUse


//module.export{asd,asda}

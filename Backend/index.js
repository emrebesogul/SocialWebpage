const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uuid = require('uuid/v4');

// create application/json parser
const jsonParser = bodyParser.json();

const database = require('./database');
const url = 'mongodb://127.0.0.1:27017/socialwebpage';

//Setup Multer:
const storage = multer.diskStorage({
  destination: 'uploads/posts/',
  filename: function (req, file, callback) {
      callback(null, uuid());
  }
});

const upload = multer({ storage: storage});

app.use(express.static('./public'));



//==================================================================================================//




//==================================================================================================//
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

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{}
 }));



//==================================================================================================//
// Connect to Mongo DB on start
MongoClient.connect(url, function(err, client) {
  if (err) {
      console.log('Unable to connect to MongoDB');
      throw err;
  } else {
      console.log("Successfully connected to MongoDB");
      app.use(bodyParser.json());

      //----------------------SESSION----------------------//
      app.get('/checkSession', (req, res) => {
          console.log("=================================");
          req.session.test = 123456
          req.session.test2 = 1010101

          console.log(req.sessionID);
          console.log(req.session.cookie);

          console.log(req.session)
          console.log(req.session.user)
          console.log(req.session.test)
          console.log(req.session.test2)

          res.send(JSON.stringify({
              hi: "hallo",
              lol: req.session.userID
          }));
          console.log("=================================");
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
          console.log(req.session.userID);
        database.getFeed(client.db('socialwebpage'), res, () => {
            db.close();
        });
        //nodemon
      });


      //----------------------Profile----------------------//
      app.get('/image/list', (req, res) => {
          //get: /?id=123
          // req.param('id')...
      });

      //----------------------Upload Image to Server----------------------//
      app.post('/image/create', upload.single('theImage'), (req, res) => {
          if (!req.file) {
            console.log("No file received");
            res.send(JSON.stringify({
                message: "Image could not be uploaded"
            }));
          } else {
              console.log(req.file)
              console.log(req.body)

              const fileData = JSON.stringify(req.file);
              const fileDataInfo = JSON.stringify(req.body);

              const file = {fileData, fileDataInfo}
              console.log(file)

              database.uploadImageToPlatform(client.db('socialwebpage'), res, file, function(){
                  db.close();
              });
          }
      });


      //----------------------Create Story----------------------//
      app.post('/story/create', (req, res) => {
        console.log("Add story to database:");
        console.log(req.body);
        const storyData = JSON.stringify(req.body);
          database.createStoryEntry(client.db('socialwebpage'), res, storyData, function(){
              db.close();
          });
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
/*
Emre:
- Bilder anzeigen im Feed (GET /story/list)
- Bilder anzeigen im Profil (GET /image/list?userid=$userid)
- Bild und Story zeitlich anzeigen

Konstantin:
- Texte anzeigen im Feed (GET /image/list)
- Texte anzeigen im Profil (GET /story/list?userid=$userid)

*/

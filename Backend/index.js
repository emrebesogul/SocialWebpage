var express = require('express');
var app = express();
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
//var objectId = require('mongodb').ObjectID;
var assert = require('assert');


var url = 'mongodb://localhost:27017/socialwebpage';

app.get('/', function(req, res) {
    var findDocuments = function(db, callback) {
        var collection = db.collection('users');
        collection.find().toArray(function(err,docs){
            if (err) throw err;
            res.send(docs);
            //callback;
        })
    }
    MongoClient.connect(url, function(err, client){
        if (err) throw err;
        console.log("it is working");
        // db.close();
        findDocuments(client.db('socialwebpage'), function(){
            db.close();
        });
    })
});



app.listen(8000, function() {
  console.log('listening on 8000')
})

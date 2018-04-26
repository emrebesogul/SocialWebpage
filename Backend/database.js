var SHA256 = require("crypto-js/sha256");
var session = require('express-session')
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs');

var call = module.exports = {

    //----------------------LOGIN----------------------//
    checkUserCredentials: function (db, res, userCredential) {
        let username = (userCredential.username).trim();
        let password = userCredential.password;
        let passwordHashed = SHA256(password);

        if (!username || !password) {
            res.send(JSON.stringify({
                message: "The fields are required."
            }));
        } else {
            if (username != null && password != null) {
                db.collection('users').findOne({"username": username}, (err, docs) => {
                    if (err) {
                        console.log(username + " failed to login.");
                        res.send(JSON.stringify({
                            message: "Sorry, your password is incorrect. Please check again."
                        }));
                        throw err;
                    }
                    if (docs) {
                        if (JSON.stringify(passwordHashed.words) === JSON.stringify(docs.password)) {
                            jwt.sign({userid: docs._id, username: docs.username}, 'secretkey', (err, token) => {
                                console.log(docs.username + " has logged in successfully.");
                                res.send(JSON.stringify({
                                    message : "Correct credentials",
                                    token,
                                }));
                            });
                        } else {
                            console.log(username + " failed to login.")
                            res.send(JSON.stringify({
                                message: "Sorry, your password is incorrect. Please check again."
                            }));
                        }
                    }
                    else {
                        console.log(username + " failed to login.");
                        res.send(JSON.stringify({
                            message: "Sorry, your password is incorrect. Please check again."
                        }));
                    }
                })
            }
        }
    },

    //----------------------REGISTER----------------------//
    registerUserToPlatform: function (db, res, newUserData) {
        let firstname = newUserData.firstname;
        let lastname = newUserData.lastname;
        let username = newUserData.username;
        let email = newUserData.email;
        let password = newUserData.password;
        let birthday = newUserData.birthday;
        let gender = newUserData.gender;
        let profilePicture = "";
        let friends = [];
        let passwordHashed = SHA256(password);

        if (username !== null && password !== null) {
            let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (email !== null) {
                if (email.match(mailformat)) {
                    if (birthday.length !== 0) {
                        let dateformat = /(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d/;
                        if (birthday.match(dateformat)) {
                            db.collection('users').findOne({"username": username}, (err, docs) => {
                                if (err) throw err;
                                if (docs) {
                                    res.send(JSON.stringify({
                                        message: "This username is not available. Please try another one."
                                    }));
                                } else {
                                    db.collection('users').findOne({"email": email}, (err, docs) => {
                                        if (err) throw err;
                                        if (docs) {
                                            res.send(JSON.stringify({
                                                message: "This email is not available. Please try another one."
                                            }));
                                        } else {
                                            db.collection('users').insert({
                                                "first_name": firstname,
                                                "last_name": lastname,
                                                "username": username,
                                                "email": email,
                                                "password": passwordHashed.words,
                                                "birthday": birthday,
                                                "gender": gender,
                                                "picture": profilePicture,
                                                "friends": friends,
                                                "is_admin" : false
                                            });
                                            console.log("User created: " + username);
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
                        db.collection('users').findOne({"username": username}, (err, docs) => {
                            if (err) throw err;
                            if (docs) {
                                res.send(JSON.stringify({
                                    message: "This username is not available. Please try another one."
                                }));
                            } else {
                                db.collection('users').findOne({"email": email}, (err, docs) => {
                                    if (err) throw err;
                                    if (docs) {
                                        res.send(JSON.stringify({
                                            message: "This email is not available. Please try another one."
                                        }));
                                    } else {
                                        console.log("User created: ", username);
                                        res.send(JSON.stringify({
                                            message: "User successfully created",
                                            messageDetails: "Your user registration was successful. You may now Login with the username you have chosen."
                                        }));
                                        db.collection('users').insert({
                                            "first_name": firstname,
                                            "last_name": lastname,
                                            "username": username,
                                            "email": email,
                                            "password": passwordHashed.words,
                                            "birthday": birthday,
                                            "gender": gender,
                                            "picture": profilePicture,
                                            "friends": friends,
                                            "is_admin" : false
                                        });
                                        console.log("User created: " + username);
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
    getFeed: function (db, res, userId) {
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
                    "_id" : 1,
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
                    },
                    "updated" : 1,
                    "profile_picture_filename": "$user.picture",
                    "profile_picture_url": 1,
                    "type": 1
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
                        "_id" : 1,
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
                        },
                        "updated" : 1,
                        "profile_picture_filename": "$user.picture",
                        "profile_picture_url": 1,
                        "type": 1
                    }
                }
            ]).toArray((err_stories, res_stories) => {
                if (err_stories) throw err_stories;

                res_stories.map(item => {
                    item.number_of_likes = item.liking_users.length;
                    item.profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + item.profile_picture_filename;
                });
                res_images.map(item => {
                    item.src = "https://gruppe1.testsites.info/uploads/posts/" + item.filename;
                    item.number_of_likes = item.liking_users.length;
                    item.profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + item.profile_picture_filename;
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
    uploadImageToPlatform: function (db, res, fileData, fileDataInfo, userId) {
        let title = fileDataInfo.title;
        let content = fileDataInfo.content;
        let src = fileData.destination;
        let filename = fileData.filename;
        db.collection('images').insert({
            "title": title,
            "content": content,
            "filename": filename,
            "liking_users": [],
            "date_created": new Date(),
            "user_id": new ObjectId(userId),
            "updated" : false,
            "type": "image"
        });
        res.send(JSON.stringify({
            message: "Image uploaded"
        }));

    },

    //----------------------Create Story Entry----------------------//
    //
    // Receives the titel and the content of a story and inserts it to the database.
    // After that, a message with "true" is send to the react application.
    createStoryEntry: function (db, res, storyData, userId) {
        let title = storyData.title;
        let content = storyData.content;
        db.collection('stories').insert({
            "title": title,
            "content": content,
            "liking_users": [],
            "date_created": new Date(),
            "user_id": new ObjectId(userId),
            "updated" : false,
            "type": "story"
        });
        res.send(true);
    },

    //----------------------List Story Entries in Profile for a Username----------------------//
    //
    // Receives the name of a user, fetchs the corresponding user id from the database and
    // calls the method listStoryEntriesForUserId.
    listStoryEntriesForUsername: function(db, res, username, currentUserId) {
        const collection = db.collection('users');
        collection.findOne({"username": username}, (err, res_find_user) => {
            if (err) throw err;
            if (res_find_user) {
                call.listStoryEntriesForUserId(db, res, res_find_user._id, currentUserId)
            }
            else {
                res.send(JSON.stringify({
                    message: "User not found"
                }));
            }
        });
    },

    //----------------------List Images in Profile for a Username----------------------//
    //
    // Receives the name of a user, fetchs the corresponding user id from the database and
    // calls the method listImagesForUserId.
    listImagesForUsername: function(db, res, username, currentUserId) {
        const collection = db.collection('users');
        collection.findOne({"username": username}, (err, res_find_user) => {
            if (err) throw err;
            if (res_find_user) {
                call.listImagesForUserId(db, res, res_find_user._id, currentUserId)
            }
            else {
                res.send(JSON.stringify({
                    message: "User not found"
                }));
            }
        });
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
                    },
                    "updated": 1,
                    "type": 1
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
    listImagesForUserId: function (db, res, userId, currentUserId) {
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
                    },
                    "updated" : 1,
                    "type": 1
                }
            },
            { $sort : { "date_created" : -1 } }
        ]).toArray((err_images, result_images) => {
            if (err_images) throw err_images;
            result_images.map(item => {
                item.date_created = getDate(item.date_created);
                item.src = "https://gruppe1.testsites.info/uploads/posts/" + item.filename;
                item.number_of_likes = item.liking_users.length;
            });
            res.status(200).send(result_images);
        });
    },


    //----------------------Get Userdata for username----------------------//
    getUserDataForUsername: function(db, res, username, userid) {
        db.collection('users').findOne({"username": username}, (err, res_find_user) => {
            if (err) {
                res.send(JSON.stringify({
                    message: "User not found"
                }));
                throw err;
            }
            if (res_find_user) {
                db.collection('friend_requests').findOne({ $and : [
                        {$or: [ {"requesterId": ObjectId(userid), "recipientId": ObjectId(res_find_user._id)}, {"requesterId": ObjectId(res_find_user._id), "recipientId": ObjectId(userid)} ]},
                        {"status": "open"}
                ]},
                (err, res_find_friend_request) => {
                    if(err) throw err;

                    var buttonState = "";

                    if ((res_find_user.friends.toString()).includes(userid)) {
                        buttonState = "Delete Friend";
                    } else if (res_find_friend_request) {
                        if (res_find_friend_request.requesterId == userid) {
                            buttonState = "Your request was sent";
                        } else {
                            buttonState = "Request pending";
                        }
                    } else {
                        buttonState = "Add Friend";
                    }
                    res.send(JSON.stringify({
                        userId: res_find_user._id,
                        username: res_find_user.username,
                        firstname: res_find_user.first_name,
                        lastname: res_find_user.last_name,
                        email: res_find_user.email,
                        picture: res_find_user.picture,
                        pictureURL: "https://gruppe1.testsites.info/uploads/posts/" + res_find_user.picture,
                        buttonState: buttonState,
                        is_admin: res_find_user.is_admin
                    }));
                });
            }
            else {
                res.send(JSON.stringify({
                    message: "User not found"
                }));
            }
        })
    },

    //----------------------Get Current User----------------------//
    getUserDataForCurrentUser: function(db, res, userid) {
        db.collection('users').findOne({"_id": ObjectId(userid)},(err, res_find_user) => {
            if (err) {
                res.send(JSON.stringify({
                    message: "User not found"
                }));
                throw err;
            }
            if (res_find_user) {
                res.send(JSON.stringify({
                    userId: res_find_user._id,
                    username: res_find_user.username,
                    firstname: res_find_user.first_name,
                    lastname: res_find_user.last_name,
                    email: res_find_user.email,
                    picture: res_find_user.picture,
                    pictureURL: "https://gruppe1.testsites.info/uploads/posts/" + res_find_user.picture,
                    is_admin: res_find_user.is_admin
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
        db.collection('users').findOne({"_id": ObjectId(userId)},(err_find_user, res_find_user) => {
            if (err_find_user) throw err_find_user;
            if (res_find_user) {
                db.collection("stories").findOne({ _id : new ObjectId(storyId) }, (err, docs) => {
                    if (err) throw err;
                    if (docs.user_id == userId || res_find_user.is_admin) {
                        db.collection("comments").remove({ post_id : new ObjectId(storyId) }, (err_remove_comments, res_remove_comments) => {
                            if (err_remove_comments) throw err_remove_comments;
                            db.collection("stories").remove({ _id : new ObjectId(storyId) }, (err, docs) => {
                                if (err) throw err;
                                db.collection('notifications').remove({"story_id": ObjectId(storyId)}, (err, res_stories) => {
                                    if (err) throw err;
                                });
                                res.send(true);
                            });
                        });
                    }
                    else {
                        res.send(false);
                    }
                });

            }
        });

    },

    //----------------------Delete Image---------------------//
    //
    // Receives the id of an image and deletes it from the database.
    // After that, a message with "true" is send to the react application.
    deleteImageById: function (db, res, imageId, userId) {
        db.collection('users').findOne({"_id": ObjectId(userId)},(err_find_user, res_find_user) => {
            if (err_find_user) throw err_find_user;
            if (res_find_user) {
                db.collection("images").findOne({ _id : new ObjectId(imageId) }, (err_find_images, res_find_images) => {
                    if (err_find_images) throw err_find_images;
                    if (res_find_images.user_id == userId || res_find_user.is_admin) {
                        db.collection("comments").remove({ post_id : new ObjectId(imageId) }, (err_remove_comments, res_remove_comments) => {
                            if (err_remove_comments) throw err_remove_comments;
                            let path = "./public/uploads/posts/" + res_find_images.filename;
                            fs.unlinkSync(path);
                            db.collection("images").remove({ _id : new ObjectId(imageId) }, (err_remove_image, res_remove_image) => {
                                if (err_remove_image) throw err_remove_image;
                                db.collection('notifications').remove({"image_id": ObjectId(imageId)}, (err, res_stories) => {
                                    if (err) throw err;
                                });
                                res.send(true);
                            });
                        });
                    }
                    else {
                        res.send(false);
                    }
                });
            }
        });
    },

    //----------------------Like Story Entry----------------------//
    //
    // Receives the id of a story entry and of a user, fetchs the array with likes from
    // the database and add or remove the current user from this array.
    // After that, a message with "true" is send to the react application.
    likeStoryEntryById: function (db, res, storyId, userId) {
        db.collection("stories").findOne({_id : new ObjectId(storyId)},(err_find_stories, res_find_stories) => {
            if (err_find_stories) throw err_find_stories;
            if (res_find_stories.liking_users.includes(userId)) {
                let index = res_find_stories.liking_users.indexOf(userId);
                if (index > -1) {
                    res_find_stories.liking_users.splice(index, 1);
                    db.collection("stories").findOne({"_id" : ObjectId(storyId)}, (err, docs) => {
                        if(err) throw err;
                        if(docs) {
                            db.collection('notifications').remove({"recipient": ObjectId(docs.user_id), "creator": ObjectId(userId), "action": "liked your story", "story_id": ObjectId(storyId)}, (err, res_stories) => {
                                if (err) throw err;
                            });
                        }
                    });
                }
                else {
                    throw err_find_stories;
                }
            }
            else {
                res_find_stories.liking_users.push(userId);
                db.collection("stories").findOne({"_id" : ObjectId(storyId)}, (err, docs) => {
                    if (err) throw err;
                    if (docs) {
                        db.collection('notifications').insert({
                            "recipient": ObjectId(docs.user_id),
                            "creator": ObjectId(userId),
                            "action": "liked your story",
                            "date_created": new Date(),
                            "story_id": ObjectId(storyId)
                        });
                    }
                });
            }
            db.collection("stories").update(
                {
                    _id : new ObjectId(storyId)
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
        db.collection("images").findOne({ _id : new ObjectId(imageId)},(err_find_images, res_find_images) => {
            if (err_find_images) throw err_find_images;
            if (res_find_images.liking_users.includes(userId)) {
                let index = res_find_images.liking_users.indexOf(userId);
                if (index > -1) {
                    res_find_images.liking_users.splice(index, 1);

                    db.collection("images").findOne({"_id" : ObjectId(imageId)}, (err, docs) => {
                        if (err) throw err;
                        if (docs) {
                            db.collection('notifications').remove({"recipient": ObjectId(docs.user_id), "creator": ObjectId(userId), "action": "liked your image", "image_id": ObjectId(imageId)}, (err, res_stories) => {
                                if (err) throw err;
                            });
                        }
                    });
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
                db.collection("images").findOne({"_id" : ObjectId(imageId)}, (err, docs) => {
                    if (err) throw err;
                    if (docs) {
                        db.collection('notifications').insert({
                            "recipient": ObjectId(docs.user_id),
                            "creator": ObjectId(userId),
                            "action": "liked your photo",
                            "date_created": new Date(),
                            "image_id": ObjectId(imageId)
                        });
                    }
                });
            }

            db.collection("images").update(
                {
                    _id : new ObjectId(imageId)
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

    //----------------------Update User----------------------//
    updateUserData: function(db, res, userData, currentUserId) {
        let newUsername = (userData.username).trim();
        let newEmail = (userData.email).trim();
        let newHashedPassword = SHA256(userData.password)
        let permitUpdate = 1;
        let responseMessage = "User data successfully updated.";
        if(newEmail != null && newEmail != "" && newUsername != null && newUsername != "") {
            db.collection('users').find( { $or: [ {"username": newUsername}, {"email": newEmail} ]}).toArray((err, res_find_user) => {
                res_find_user.map(user => {
                    if (user._id != currentUserId) {
                        if (user.username == newUsername) {
                            permitUpdate = 0;
                            responseMessage = "This username already exists.";
                        }
                        if (user.email == newEmail) {
                            permitUpdate = 0;
                            responseMessage = "This email address already exists.";
                        }
                    }
                });
                if (permitUpdate) {
                    if(userData.password == "" || userData.password == null) {
                        db.collection('users').update(
                            { _id: ObjectId(currentUserId) },
                            {
                                $set: {
                                "first_name": userData.first_name,
                                "last_name": userData.last_name,
                                "username": newUsername,
                                "email": newEmail,
                                }
                            }
                        );
                    } else {
                        db.collection('users').update(
                            { _id: ObjectId(currentUserId) },
                            {
                                $set: {
                                "first_name": userData.first_name,
                                "last_name": userData.last_name,
                                "username": newUsername,
                                "email": newEmail,
                                "password": newHashedPassword.words
                                }
                            }
                        );
                    }
                }
                res.send(JSON.stringify({message: responseMessage}));
            });
        } else {
            res.send(JSON.stringify({message: "Username and email must not be empty!"}));
        }
    },

    //----------------------Send Friend requests----------------------//
    sendFriendRequest: function(db, res, userId, requester, recipient) {
        db.collection('users').findOne({"username": recipient}, (err, res_find_user) => {
            if (err) throw err;
            if (res_find_user) {
                db.collection('friend_requests').findOne({"requester": requester, "recipient": res_find_user.username}, (err, res_find_request) => {
                    if(err) throw err;
                    if (res_find_request) {
                        res.send(JSON.stringify({
                            buttonState: "Undo Friend"
                        }));
                    } else {
                        res.send(JSON.stringify({
                            buttonState: "Request sent"
                        }));
                        db.collection('friend_requests').insert({
                            "requester": requester,
                            "requesterId": ObjectId(userId),
                            "recipient": res_find_user.username,
                            "recipientId": res_find_user._id,
                            "time": new Date(),
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

    //----------------------get Friendship requests----------------------//
    getFriendRequests: function(db, res, userId) {
        db.collection('friend_requests').aggregate([
            { $match : {"status": "open", "recipientId": ObjectId(userId)} },
            { $lookup:
                {
                from: "users",
                localField: "requesterId",
                foreignField: "_id",
                as: "user"
                }
            },
            {
                $project :
                {
                    "requester": "$user.username",
                    "requesterId": "$user._id",
                    "recipient": 1,
                    "time": 1,
                    "profile_picture_filename": "$user.picture",
                    "profile_picture_url": 1
                }
            }
        ]).toArray((err, result) => {
        if (err) throw err;
            result.map(item => {
                item.requester = item.requester;
                item.requesterId = item.requesterId;
                item.date_created = getDate(item.time);
                item.profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + item.profile_picture_filename;
            });
            res.status(200).send(result);
        });
    },


    //----------------------Confirm Friend Request----------------------//
    confirmFriendRequest: function(db, requesterId, recipientId, res) {
        db.collection('friend_requests').remove({"requesterId": ObjectId(requesterId), "recipientId": ObjectId(recipientId)}, (err, res_stories) => {
            if (err) throw err;
        });
        db.collection('users').findOne({"_id": ObjectId(requesterId)}, (err, docs) => {
            if (err) throw err;
            if (docs) {
                docs.friends.push(ObjectId(recipientId));
                db.collection('users').update({"_id": ObjectId(requesterId)},
                    {
                        $set: {
                            "friends": docs.friends
                        }
                    }
                );
            }
        });
        db.collection('users').findOne({"_id": ObjectId(recipientId)}, (err, docs) => {
            if (err) throw err;
            if (docs) {
                docs.friends.push(ObjectId(requesterId));
                db.collection('users').update({"_id": ObjectId(recipientId)},
                    {
                        $set: {
                            "friends": docs.friends
                        }
                    }
                );
            }
        });
        db.collection('notifications').insert({
            "recipient": ObjectId(requesterId),
            "creator": ObjectId(recipientId),
            "action": "added you as friend",
            "date_created": new Date()
        });
        res.send(true);
    },

    //----------------------Decline Friend request----------------------//
    deleteFriendRequest: function(db, requesterId, recipientId, res) {
        db.collection('friend_requests').remove({"requesterId": ObjectId(requesterId), "recipientId": ObjectId(recipientId)}, (err, res_stories) => {
            if (err) throw err;
            res.send(true);
        });
    },

    //----------------------Get all Friends----------------------//
    getFriends: function(db, res, userId) {
        db.collection('users').findOne({_id : ObjectId(userId)}, (err_find_user, res_find_user) => {
            if (err_find_user) throw err_find_user;
            if (res_find_user) {
                let friendlist = [];
                let friendlistLength = res_find_user.friends.length;
                let friends = [];
                let i = 0;

                res_find_user.friends.map(item => {
                    db.collection('users').findOne({"_id": ObjectId(item)}, (err_friends, res_friends) => {
                        if (err_friends) throw err_friends;
                        friendlist.push(res_friends);
                        i++;

                        result = {};
                        result ["name"] = res_friends.username;
                        result ["firstName"] = res_friends.first_name;
                        result ["lastName"] = res_friends.last_name;
                        result ["friendId"] = res_friends._id;
                        result ["picture"] = "https://gruppe1.testsites.info/uploads/posts/" + res_friends.picture;
                        friends.push(result);

                        if (i == friendlistLength) {
                            let friendsByName = friends.slice(0);
                            friendsByName.sort(function(a,b) {
                                let x = a.name.toLowerCase();
                                let y = b.name.toLowerCase();
                                return x < y ? -1 : x > y ? 1 : 0;
                            });
                            res.status(200).send(friendsByName);
                        }
                    });
                });
            }
        });
    },

    //----------------------Delete a Friend----------------------//
    deleteFriend: function(db, res, userId, userToDeleteId) {
        db.collection('users').update({"_id" : ObjectId(userId)}, {'$pull': {"friends": ObjectId(userToDeleteId)}});
        db.collection('users').update({"_id" : ObjectId(userToDeleteId)}, {'$pull': {"friends": ObjectId(userId)}});
        res.send(true);
    },

    //-----------------------------------Create a Guestbook Entry-----------------------------------//
    createGuestbookEntry: function (db, res, title, content, ownerName, authorId) {
        if(ownerName) {
            db.collection('users').findOne({"username": ownerName}, (err_user, res_user) => {
                if (err_user) throw err_user;

                if (res_user && (res_user._id != authorId)) {
                    let date_created = new Date();
                    db.collection('guestbookEntries').insert({
                        "title": title,
                        "content": content,
                        "liking_users": [],
                        "date_created": date_created,
                        "owner_id": new ObjectId(res_user._id),
                        "author_id": new ObjectId(authorId),
                        "type": "guestbook"
                    }, (err_insert_enty, res_insert_entry) => {
                        db.collection('notifications').insert({
                            "recipient": ObjectId(res_user._id),
                            "creator": ObjectId(authorId),
                            "action": "posted a new entry in your guestbook",
                            "date_created": date_created,
                            "guestbook_id": ObjectId(res_insert_entry.ops[0]._id)
                        });
                    });
                    res.send(true);
                }
                else {
                    res.send(false);
                }
            })
        } else {
            res.send(false);
        }
    },

    //----------------------List Guestbook Entries in Profile for a Username----------------------//
    //
    // Receives the name of a user, fetchs the corresponding user id from the database and
    // calls the method listGuestbookEntriesForUserId.
    listGuestbookEntriesForUsername: function(db, res, username, currentUserId) {
        db.collection('users').findOne({"username": username}, (err, docs) => {
            if (err) throw err;

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
                    },
                    "profile_picture_filename": "$author.picture",
                    "profile_picture_url": 1,
                    "type": 1
                }
            },
            { $sort : { "date_created" : -1 } }
        ]).toArray((err_guestbook_entries, res_guestbook_entries) => {
            if (err_guestbook_entries) throw err_guestbook_entries;
                res_guestbook_entries.map(item => {
                    item.date_created = getDate(item.date_created);
                    item.number_of_likes = item.liking_users.length;
                    item.profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + item.profile_picture_filename;
                    item.profile_picture_filename = item.profile_picture_filename;
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

                res_find_guestbook_entries.liking_users.splice(index, 1);

                db.collection('notifications').remove({
                    "recipient": new ObjectId(res_find_guestbook_entries.owner_id),
                    "creator": new ObjectId(userId),
                    "action": "liked your guestbook post",
                    "guestbook_id": new ObjectId(guestbookData.guestbookEntryId)
                }, (err, res_guestbookData) => {
                    if (err) throw err;
                });
            }
            else {
                res_find_guestbook_entries.liking_users.push(userId);
                db.collection('notifications').insert({
                    "recipient": new ObjectId(res_find_guestbook_entries.owner_id),
                    "creator": new ObjectId(userId),
                    "action": "liked your guestbook post",
                    "date_created": new Date(),
                    "guestbook_id": new ObjectId(guestbookData.guestbookEntryId)
                });
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
        db.collection('users').findOne({"_id": ObjectId(userId)},(err_find_user, res_find_user) => {
            if (err_find_user) throw err_find_user;
            if (res_find_user) {
                db.collection("guestbookEntries").findOne({ _id : new ObjectId(guestbookData.guestbookEntryId) }, (err_find_guestbook_entries, res_find_guestbook_entries) => {
                    if (err_find_guestbook_entries) throw err_find_guestbook_entries;
                    if (res_find_guestbook_entries.owner_id == userId || res_find_user.is_admin) {
                        db.collection("comments").remove({ post_id : new ObjectId(guestbookData.guestbookEntryId) }, (err_remove_comments, res_remove_comments) => {
                            if (err_remove_comments) throw err_remove_comments;
                            db.collection("guestbookEntries").remove({ _id : new ObjectId(guestbookData.guestbookEntryId) }, (err_remove_guestbook_entries, res_remove_guestbook_entries) => {
                                if (err_remove_guestbook_entries) throw err_remove_guestbook_entries;
                                db.collection('notifications').remove({"guestbook_id": ObjectId(guestbookData.guestbookEntryId)}, (err_guestbook_delete, res_guestbook_delete) => {
                                    if (err_guestbook_delete) throw err_guestbook_delete;
                                });
                                res.send(true);
                            });
                        });
                    }
                    else {
                        res.send(false);
                    }
                });
            }
        });
    },

    //----------------------Get Guestbook Entry----------------------//
    getGuestBookEntry: function(db, res, guestbookEntyId, currentUserId) {
        db.collection('guestbookEntries').aggregate([
            { $match : { owner_id: ObjectId(currentUserId), "_id": ObjectId(guestbookEntyId) } },
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
                    },
                    "profile_picture_filename": "$author.picture",
                    "profile_picture_url": 1,
                    "type": 1
                }
             },
             { $sort : { "date_created" : -1 } }
            ]).toArray((err_guestbook_entries, res_guestbook_entries) => {
            if (err_guestbook_entries) throw err_guestbook_entries;
            res_guestbook_entries[0].date_created = getDate(res_guestbook_entries[0].date_created);
            res_guestbook_entries[0].number_of_likes = res_guestbook_entries[0].liking_users.length;
            res_guestbook_entries[0].profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + res_guestbook_entries[0].profile_picture_filename;
            res_guestbook_entries[0].profile_picture_filename = res_guestbook_entries[0].profile_picture_filename;
            res.status(200).send(res_guestbook_entries[0]);
        });
    },

    //----------------------Upload Profile Picture----------------------//
    uploadProfilePicture: function (db, res, fileData, userId) {
        let filename = fileData.filename;
        db.collection('users').findOne({ _id : new ObjectId(userId)}, (err, docs) => {
            if (err) throw err;
            if (docs) {
                //Delete old image from Server
                if(docs.picture !== "") {
                    let path = "./public/uploads/posts/" + docs.picture;
                    fs.unlinkSync(path);
                }
                db.collection('users').update({_id: ObjectId(userId)},
                    {
                        $set: {
                            "picture": filename
                        }
                    }
                );
                res.send(true);
            } else {
                res.send(false);
            }
        });
    },

    //----------------------Delete Profile Picture---------------------//
    deleteProfilePicture: function (db, res, userId) {
        db.collection('users').findOne({ _id : new ObjectId(userId)}, (err, docs) => {
            if (err) throw err;
            if (docs) {
                // Delete image from Server
                let path = "./public/uploads/posts/" + docs.picture;
                fs.unlinkSync(path);

                // Delete from database
                db.collection('users').update({ _id : new ObjectId(userId) },
                    {
                        $set: {
                            "picture": ""
                        }
                    }
                );
                res.send(true);
            }
        })
    },

    //------------------------------Get Story Entry------------------------------//
    //
    // Recieves the id of a story and the id of the current user and returns the
    // information of the story if the current user is the author of this story.
    getStoryEntry: function(db, res, storyId, currentUserId) {
        db.collection('stories').aggregate([
            { $match : { user_id: ObjectId(currentUserId), "_id": ObjectId(storyId) } },
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
                    },
                    "updated": 1,
                    "profile_picture_filename": "$user.picture",
                    "profile_picture_url": 1,
                    "type": 1
                }
             }
            ]).toArray((err_stories, result_stories) => {
            if (err_stories) throw err_stories;
            result_stories[0].date_created = getDate(result_stories[0].date_created);
            result_stories[0].number_of_likes = result_stories[0].liking_users.length;
            result_stories[0].profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + result_stories[0].profile_picture_filename;
            res.status(200).send(result_stories[0]);
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
                            "content": storyContent,
                            "updated" : true
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

    //------------------------------Get Image------------------------------//
    //
    // Recieves the id of an image and the id of the current user and returns the
    // information of the image if the current user is the author of this image.
    getImage: function(db, res, imageId, currentUserId) {
        db.collection('images').aggregate([
            { $match : { user_id:  ObjectId(currentUserId), "_id": ObjectId(imageId) } },
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
                    },
                    "updated" : 1,
                    "profile_picture_filename": "$user.picture",
                    "profile_picture_url": 1,
                    "type": 1
                }
             },
             { $sort : { "date_created" : -1 } }
            ]).toArray((err_images, result_images) => {
            if (err_images) throw err_images;
            result_images[0].date_created = getDate(result_images[0].date_created);
            result_images[0].src = "https://gruppe1.testsites.info/uploads/posts/" + result_images[0].filename;
            result_images[0].number_of_likes = result_images[0].liking_users.length;
            result_images[0].profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + result_images[0].profile_picture_filename;
            res.status(200).send(result_images[0]);
        });
    },

    //----------------------------Update Image-----------------------------//
    //
    // Recieves the id of an image, the id of the current user and the new data of
    // this image that should be updated.
    // Returns true if the update was successful and false otherwise.
    updateImage: function (db, res, imageId, imageTitle, imageContent, currentUserId) {
        db.collection("images").findOne({ _id : new ObjectId(imageId) }, (err_find_images, res_find_images) => {
            if (err_find_images) throw err_find_images;
            if (res_find_images && res_find_images.user_id == currentUserId) {
                db.collection("images").update(
                    {_id: ObjectId(imageId)},
                    {
                        $set: {
                            "title": imageTitle,
                            "content": imageContent,
                            "updated" : true
                        }
                    }, (err_update_images, res_update_images) => {
                        if (err_update_images) throw err_update_images;

                        res.status(200).send(true);
                    }
                );
            } else {
                res.status(404).send(false);
            }
        });
    },

    //----------------------------Create Comment-----------------------------//
    createComment: function (db, res, commentData, currentUserId) {
        var date_created = new Date();
        db.collection('comments').insert({
            "content": commentData.content,
            "date_created": date_created,
            "liking_users": [],
            "post_id": new ObjectId(commentData.postId),
            "author_id": new ObjectId(currentUserId),
            "type": "comment"
        }, (err_insert_entry, res_insert_entry) => {
            if (err_insert_entry) throw err_insert_entry;
            if (commentData.postType == "story") {
                db.collection("stories").findOne({"_id": ObjectId(commentData.postId)}, (err_find_stories, res_find_stories) => {
                    if (err_find_stories) throw err_find_stories;
                    if (res_find_stories) {
                        if (res_find_stories.user_id !== currentUserId) {
                            db.collection('notifications').insert({
                                "recipient": new ObjectId(res_find_stories.user_id),
                                "creator": new ObjectId(currentUserId),
                                "action": "commented on your story",
                                "type": res_find_stories.type,
                                "date_created": date_created,
                                "story_id": new ObjectId(commentData.postId)
                            });
                        }
                    }
                });
            }
            if (commentData.postType == "image") {
                db.collection("images").findOne({"_id": ObjectId(commentData.postId)}, (err_find_image, res_find_image) => {
                    if (err_find_image) throw err_find_image;
                    if (res_find_image) {
                        if (res_find_image.user_id !== currentUserId) {
                            db.collection('notifications').insert({
                                "recipient": ObjectId(res_find_image.user_id),
                                "creator": ObjectId(currentUserId),
                                "action": "commented on your image",
                                "type": res_find_image.type,
                                "date_created": date_created,
                                "image_id": new ObjectId(commentData.postId)
                            });
                        }
                    }
                });
            }
            if (commentData.postType == "guestbook") {
                db.collection("guestbookEntries").findOne({"_id": ObjectId(commentData.postId)}, (err_find_guestbook_entry, res_find_guestbook_entry) => {
                    if (err_find_guestbook_entry) throw err_find_guestbook_entry;
                    if (res_find_guestbook_entry) {
                        if (res_find_guestbook_entry.owner_id !== currentUserId) {
                            db.collection('notifications').insert({
                                "recipient": ObjectId(res_find_guestbook_entry.owner_id),
                                "creator": ObjectId(currentUserId),
                                "action": "commented on your guestbook entry",
                                "type": res_find_guestbook_entry.type,
                                "date_created": date_created,
                                "guestbook_id": new ObjectId(commentData.postId)
                            });
                        }
                    }
                });
            }
        });
        res.send(true);
    },

    //----------------------------List Comments-----------------------------//
    getComments: function (db, res, currentUserId) {
        db.collection("comments").aggregate([
        { $lookup:
            {
            from: "users",
            localField: "author_id",
            foreignField: "_id",
            as: "author"
            }
        },
        { $project : {
                "content": 1,
                date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created", timezone: "Europe/Berlin"}},
                "authorName": {
                    "$cond": { if: { "$eq": [ "$author", [] ] }, then: "Anonym", else: "$author.username" }
                },
                "author_id": 1,
                "post_id": 1,
                "profile_picture_filename": "$author.picture",
                "profile_picture_url": 1,
                "number_of_likes": 1,
                "liking_users": 1,
                "current_user_has_liked" : {
                    "$cond": { if: { "$in": [ currentUserId , "$liking_users"] }, then: "1", else: "0" }
                },
            }
        },
        { $sort : { "date_created" : 1 } }
        ]).toArray( (err_find_comments, res_find_comments) => {
            if (err_find_comments) throw err_find_comments;
            res_find_comments.map(item => {
                item.number_of_likes = item.liking_users.length;
                item.date_created = getDate(item.date_created);
                item.profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + item.profile_picture_filename;
            });
            res.status(200).send(res_find_comments);
        });
    },

    //----------------------------List all users-----------------------------//
    getAllUsers: function(db, res) {
        db.collection('users').find({}).toArray(function (err, docs) {
            if (err) throw err;
            if (docs) {
                let userLength = (docs).length;
                let result_users = [];
                docs.map(item => {
                    let user = {};
                    user ["title"] = item.username;
                    user ["description"] = item.first_name + " " + item.last_name;
                    if(item.picture !== "") {
                        user ["image"] = "https://gruppe1.testsites.info/uploads/posts/" + item.picture;
                    } else {
                        user ["image"] = "/assets/images/user.png";
                    }
                    result_users.push(user);
                });
                result_users = result_users.slice(0);
                result_users.sort(function(a,b) {
                    let x = a.title.toLowerCase();
                    let y = b.title.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
            res.status(200).send(result_users);
            }
        });
    },

    //----------------------Delete Comment----------------------//
    deleteCommentById: function (db, res, commentId, userId) {
        db.collection('users').findOne({"_id": ObjectId(userId)},(err_find_user, res_find_user) => {
            if (err_find_user) throw err_find_user;
            if (res_find_user) {
                db.collection("comments").findOne({ _id : new ObjectId(commentId) }, (err_find_comments, res_find_comments) => {
                    if (err_find_comments) throw err_find_comments;
                    if (res_find_comments.author_id == userId || res_find_user.is_admin) {
                        db.collection("comments").remove({ _id : new ObjectId(commentId) }, (err_remove_comments, res_remove_comments) => {
                            if (err_remove_comments) throw err_remove_comments;
                            db.collection('notifications').remove({"comment_id": ObjectId(commentId)}, (err_notification, res_notification) => {
                                if (err_notification) throw err_notification;
                            });
                            res.send(true);
                        });
                    }
                    else {
                        res.send(false);
                    }
                });
            }
        });
    },

    //----------------------------List all notifications of a user-----------------------------//
    getNotifications: function(db, res, userId) {
        db.collection('notifications').aggregate([
            { $match: {"recipient": ObjectId(userId), "creator": {"$ne": ObjectId(userId)} }},
            { $lookup:
                {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project :
                {
                    "username": "$user.username",
                    "action": 1,
                     date_created: {$dateToString: {format: "%G-%m-%d %H:%M:%S",date: "$date_created", timezone: "Europe/Berlin"}},
                    "profile_picture_filename": "$user.picture",
                    "profile_picture_url": 1,
                    "story_id": 1,
                    "image_id": 1,
                    "guestbook_id": 1,
                    "comment_id": 1,
                    "typeCommented": 1,
                    "type": 1
                }
            }
        ]).toArray((err, result) => {
            if (err) throw err;
            result.map(item => {
                item.date_created = getDate(item.date_created);
                if (item.action == "added you as a friend!") {
                    item.redirect = false;
                }
                if (item.story_id) {
                    item.redirect = true;
                    item.type = "story";
                    item.typeCommented = item.type;
                    item.linkToPost = item.story_id;
                }
                if (item.image_id) {
                    item.redirect = true;
                    item.type = "image";
                    item.typeCommented = item.type;
                    item.linkToPost = item.image_id;
                }
                if (item.guestbook_id) {
                    item.redirect = true;
                    item.type = "guestbook";
                    item.typeCommented = item.type;
                    item.linkToPost = item.guestbook_id;
                }
                if (item.guestbook_id) {
                    item.redirect = true;
                    item.typeCommented = item.type;
                    item.type = "guestbook";
                    item.linkToPost = item.guestbook_id;
                }
                item.profile_picture_url = "https://gruppe1.testsites.info/uploads/posts/" + item.profile_picture_filename;
            });
            result.sort((a, b) => {
                return new Date(b.date_created) - new Date(a.date_created);
            });
            res.status(200).send(result);
        });
    },

    //----------------------Like Comment----------------------//
    likeComment: function (db, res, commentId, userId) {
        db.collection("comments").findOne({_id : new ObjectId(commentId)},(err_find_comments, res_find_comments) => {
            if (err_find_comments) throw err_find_comments;
            if (res_find_comments.liking_users.includes(userId)) {
                let index = res_find_comments.liking_users.indexOf(userId);
                if (index > -1) {
                    res_find_comments.liking_users.splice(index, 1);
                }
                else {
                    throw err_find_comments;
                }
            }
            else {
                res_find_comments.liking_users.push(userId);
            }
            db.collection("comments").update(
                {
                    _id : new ObjectId(commentId)
                },
                {
                    $set: { liking_users: res_find_comments.liking_users }
                },
                (err_update_comments, res_update_comments) => {
                if (err_update_comments) throw err_update_comments;
            });
            res.send(true);
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

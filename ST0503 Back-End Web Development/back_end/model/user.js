const db = require('./db_config.js');

//import config and jwt for user login function
const config = require('../config.js'); 
const jwt = require('jsonwebtoken');

module.exports = {
    createNew: (details, callback) => { //for endpoint 1: add new user into user table
        var conn = db.getConnection(); 

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else { //If one of the request body values is an empty string do not accept
                const {username, email, contact, password, type, profile_pic_url} = details;
                if (username == "" || email == "" || contact == "" || password == "" || type == "") {
                    return callback(null, null);
                }
                console.log("Connected to MySQL from user.js, executing user.createNew");
                var sqlQuery = "INSERT INTO user(username, email, contact, password, type, profile_pic_url) VALUES(?, ?, ?, ?, ?, ?);";
                
                conn.query(sqlQuery, [username, email, contact, password, type, profile_pic_url], function(err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    showAll: (callback) => { //for endpoint 2: get all user info from user table
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected to MySQL from user.js, executing user.showAll");
                var sqlQuery = "SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM user;";
                
                conn.query(sqlQuery, function(err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    showByID: (userid, callback) => { //for endpoint 3: get specific user info by id
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected to MySQL from user.js, executing user.showByID");
                var sqlQuery = "SELECT userid, username, email, contact, type, profile_pic_url, created_at FROM user WHERE userid = ?;";

                conn.query(sqlQuery, [userid], function(err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
    
    update: (userid, details, callback) => { //for endpoint 4: update user info by user id
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                //first query to retrieve default values of the userid
                console.log("Retrieving default values of user");
                var retrieveQuery = "SELECT username, email, contact, password, profile_pic_url FROM user WHERE userid = ?;";
                conn.query(retrieveQuery, [userid], function(err, defaultValue) {
                    if (err) {
                        return callback(err, null);
                    }
                    else if (defaultValue == "") {
                        return callback(null, defaultValue);
                    }
                    else { //if value in postman is empty replace with default user values
                        var {username, email, contact, password, profile_pic_url} = details;
                        if (username == "") username = defaultValue[0]["username"];
                        if (email == "") email = defaultValue[0]["email"];
                        if (contact == "") contact = defaultValue[0]["contact"];
                        if (password == "") password = defaultValue[0]["password"];
                        if (profile_pic_url == "") profile_pic_url = defaultValue[0]["profile_pic_url"];

                        //second query to update user information
                        console.log("Connected to MySQL from user.js, executing user.update");
                        var sqlQuery = "UPDATE user SET username = ?, email = ?, contact = ?, password = ?, profile_pic_url = ? WHERE userid = ?;";
                        conn.query(sqlQuery, [username, email, contact, password, profile_pic_url, userid], function(err, result) {
                            conn.end();
                            if (err) {
                                return callback(err, null);
                            }
                            else {
                                return callback(null, result);
                            }
                        });
                    }
                })
            }
        });
    },

    loginUser: function (email, password, callback) { //assignment2 endpoint: user login function to issue json web token
        var conn = db.getConnection();
        
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            }
            else {
                console.log("Connected to MySQL user.js, executing user.loginUser");
                var sql = 'SELECT userid, type FROM user WHERE email=? AND password=?;';

                conn.query(sql, [email, password], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);            
                    }
                    else if (result.length !== 1) { //result.length != 1 means that user does not exist in user table
                        return callback(null, null);
                    }
                    else { //create json web token if user successfully logins             
                        var token = "";
                        const payload = {userid:result[0].userid, type:result[0].type}
                        token = jwt.sign(payload, config.key, {
                            expiresIn: 86400 //valid for 24 hours
                        })
                        return callback(null, token, result);
                    }
                });
            }
        });
    }
}



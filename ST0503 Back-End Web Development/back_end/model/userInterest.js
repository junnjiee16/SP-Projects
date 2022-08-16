const db = require('./db_config.js');

module.exports = {
    inputInterests: (userid, categoryID, callback) => { //for endpoint 12: create rows in interest table for every category user is interested in
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Retrieving interested categories of user if any")
                var retrieveInterestsQuery = `SELECT categoryid FROM userinterest WHERE userid=?`;
                conn.query(retrieveInterestsQuery, [userid], function(err, result) {
                    if (err) {
                        return callback(err, null);

                    } else {
                        //print original json data
                        console.log("original json");
                        console.log(categoryID);
                        //split categoryids by comma, array is returned
                        var catIdArray = categoryID["ids"].split(",");
                        //print out existing categoryids for that user
                        console.log(`existing categoryids:`);
                        console.log(result);
                        //print out selected categories
                        console.log(`categories that user selected:`)
                        console.log(catIdArray)

                        if (result.length != 0) { //run this check loop if existing ids is not empty
                            for (i = 0; i < result.length; i++) { //loop the existing categoryids
                                for (k = 0; k < catIdArray.length; k++) { //loop the categoryids user wants to push in
                                    if (result[i]['categoryid'] == catIdArray[k]) { //check if its identical
                                        catIdArray.splice(k, 1); //removes the id if it already exists
                                    }
                                }
                            }
                        }
                        console.log("After check loop:")
                        console.log(catIdArray)

                        //create a array to store the data to push into MySQL 
                        var userAndCatIDs = [];
                        //loop interests to store in array of array
                        for (i = 0; i < catIdArray.length; i++) {
                            userAndCatIDs.push([userid, catIdArray[i]])
                        }
                        console.log("Array to push into database");
                        console.log(userAndCatIDs)

                        if (userAndCatIDs.length == 0) {
                            return callback(null, null);

                        } else {
                            //input interests into database
                            console.log("Connected to MySQL from userInterest.js, executing userInterest.inputInterests");
                            var sqlQuery = "INSERT INTO userinterest(userid, categoryid) VALUES ?;";

                            conn.query(sqlQuery, [userAndCatIDs], function(err, result) {
                                conn.end();
                                if (err) {
                                    return callback(err, null);
                                } else {
                                    return callback(null, result);
                                }
                            });
                        }
                    }
                })
            }
        });
    },

    showInterests: (userid, callback) => { //for assignment 2 endpoint: show all interests of user by userid
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to MySQL from userInterest.js, executing userInterest.showInterests");
                var sqlQuery =
                    "select c.category, c.categoryid from category as c, userinterest as u where u.categoryid = c.categoryid and u.userid = ?;"

                conn.query(sqlQuery, [userid], function(err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    }
}
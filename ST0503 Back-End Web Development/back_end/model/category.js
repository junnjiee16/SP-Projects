const db = require('./db_config.js');

module.exports = {
    createNew: (details, callback) => { //for endpoint 5: add new category into category table
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var { category, description } = details;

                if (category == "" || description == "") {
                    return callback(null, null);
                }

                console.log("Connected to MySQL from category.js, executing category.createNew");
                var sqlQuery = "INSERT INTO category(category, description) VALUES(?, ?);";

                conn.query(sqlQuery, [category, description], function(err, result) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    showAll: (callback) => { //for endpoint 6: get all rows in category table
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to MySQL from category.js, executing category.showAll");
                var sqlQuery = "SELECT * FROM category ORDER BY categoryid ASC;";

                conn.query(sqlQuery, function(err, result) {
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
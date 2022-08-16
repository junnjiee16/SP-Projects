const db = require('./db_config.js');

module.exports = {
    createReview: (details, productid, callback) => { //for endpoint 10: add new review to review table
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var { userid, rating, review } = details;
                if (userid == "" || rating == "" || review == "") {
                    return callback(null, null);
                }

                if (parseInt(rating) < 0 || parseInt(rating) > 5) {
                    return callback(null, 0);
                }

                console.log("Connected to MySQL from review.js, executing review.createReview");
                var sqlQuery = "INSERT INTO reviews(productid, userid, rating, review) VALUES(?, ?, ?, ?);";

                conn.query(sqlQuery, [productid, userid, rating, review], function(err, result) {
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

    showReviews: (productid, callback) => { //for endpoint 3: get reviews of product by id
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to MySQL from review.js, executing review.showReviews");
                var sqlQuery = "SELECT r.productid, r.userid, u.username, r.rating, r.review, r.created_at FROM reviews as r, user as u WHERE r.productid = ? AND u.userid = r.userid ORDER BY r.created_at DESC;";

                conn.query(sqlQuery, [productid], function(err, result) {
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
const db = require('./db_config.js');

module.exports = {
    newPromotion: (details, productid, callback) => { //for additional endpoint: create new promotion period for product
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                const {promostart, promoend, discount} = details;
                if (promostart == "" || promoend == "" || discount == "") {
                    return callback(null, null);
                }

                console.log("Connected to MySQL from promotion.js, executing promotion.newPromotion");
                var newPromoQuery = "INSERT INTO promotion(promostart, promoend, productid, discount) VALUES (?, ?, ?, ?);";

                conn.query(newPromoQuery, [promostart, promoend, productid, discount], function(err, result) {
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

    showAll: (callback) => { //for additional endpoint: show all promotion periods of all products
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected to MySQL from promotion.js, executing promotion.showAll");
                var showAllPromoQuery = "SELECT p.promoid, p.productid, pro.name, p.discount, p.promostart, p.promoend FROM promotion as p, product as pro WHERE p.productid = pro.productid;";

                conn.query(showAllPromoQuery, function(err, result) {
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

    showByID: (productid, callback) => { //for additional endpoint: show all promotion periods of a product by productid
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected to MySQL from promotion.js, executing promotion.showByID");
                var sqlQuery = "SELECT p.promoid, p.productid, pro.name, p.discount, p.promostart, p.promoend FROM promotion as p, product as pro WHERE p.productid = pro.productid AND p.productid = ?;";

                conn.query(sqlQuery, [productid], function(err, result) {
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

    deletePromo: (promoid, callback) => { //for additional endpoint: delete promotion period by promoid
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected to MySQL from promotion.js, executing promotion.deletePromo");
                var deletePromoQuery = "DELETE FROM promotion WHERE promoid = ?";

                conn.query(deletePromoQuery, [promoid], function(err, result) {
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
    }
}
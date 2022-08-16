const { query } = require('express');
const db = require('./db_config.js');

module.exports = {
    createNew: (details, callback) => { //for endpoint 7: add new product to product table
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var { name, description, categoryid, brand, price } = details;
                if (name == "" || categoryid == "" || brand == "" || price == "" || description == "") {
                    return callback(null, null);
                } else if (description == "") {
                    description = null;
                }
                console.log("Connected to MySQL from product.js, executing product.createNew");
                var sqlQuery = "INSERT INTO product(name, description, categoryid, brand, price) VALUES(?, ?, ?, ?, ?);";

                conn.query(sqlQuery, [name, description, categoryid, brand, price], function(err, result, productName) {
                    conn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        var productName = name
                        return callback(null, result, productName);
                    }
                });
            }
        });
    },

    showByID: (productid, callback) => { //for endpoint 8: get row from product table by primary key (productid)
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to MySQL from product.js, executing product.showByID");
                var sqlQuery =
                    "SELECT p.name, p.description, p.categoryid, c.category as categoryname, p.brand, p.price, p.image FROM product as p, category as c WHERE p.categoryid = c.categoryid and p.productid = ?;"

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
    },

    deleteProduct: (productid, callback) => { //for endpoint 9: delete row from product table by productid
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Getting image link of product to delete");
                var getImageLinkQuery = "SELECT image FROM product WHERE productid = ?;";

                conn.query(getImageLinkQuery, [productid], function(err, imgLink) {
                    if (err) {
                        return callback(err, null);

                    } else {
                        console.log("Connected to MySQL from product.js, executing product.deleteProduct");
                        var deleteProductQuery = "DELETE FROM product WHERE productid = ?;";

                        conn.query(deleteProductQuery, [productid], function(err, result) {
                            conn.end();
                            if (err) {
                                return callback(err, null);
                            } else {
                                return callback(null, result, imgLink);
                            }
                        });
                    }
                })
            }
        });
    },

    insertImageLink: (productid, imagelink, callback) => { //(not in use) for additional endpoint: store relative path of image in table
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to MySQL from product.js, executing product.insertImageLink");
                var sqlQuery = "UPDATE product SET image = ? WHERE productid = ?;";

                conn.query(sqlQuery, [imagelink, productid], function(err, result) {
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

    showAll: (callback) => { //for assignment 2 endpoint: show all products in one page
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to MySQL from product.js, executing product.showAll");
                var sqlQuery =
                    "SELECT p.productid, p.name, p.description, c.category as categoryname, p.brand, p.price, p.image, p.created_at FROM product as p, category as c WHERE p.categoryid = c.categoryid ORDER BY p.created_at DESC;"

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
    },

    search: (searchData, callback) => { //for assignment 2 endpoint: search product by name, category, and/or brand
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                nameKeyword = searchData.nameKeyword;
                brand = searchData.brand;
                categoryid = searchData.categoryid;
                console.log(searchData);

                console.log("Connected to MySQL from product.js, executing product.searchByName");
                var sqlQuery =
                    `SELECT * 
                    FROM product
                    WHERE name LIKE ?
                    AND brand LIKE ?
                    AND categoryid LIKE ?;`;

                conn.query(sqlQuery, [`%${nameKeyword}%`, `%${brand}%`, `%${categoryid}%`], function(err, result) {
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

    updateImageLink: (productid, imagelink, callback) => { //for assignment 2 endpoint: update product image by product id
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null, null);

            } else { //take original image link if any
                console.log("retrieving original image link");
                var sqlQuery = "SELECT image FROM product where productid = ?;";

                conn.query(sqlQuery, [productid], function(err, currentImgLink) {
                    console.log(currentImgLink);
                    if (err) {
                        return callback(err, null, null);

                    } else {
                        if (currentImgLink[0].image == null) { //no existing image
                            console.log("new entry no image")
                            console.log("Connected to MySQL from product.js, executing product.updateImageLink (existing img = null)");
                            var sqlQuery = "UPDATE product SET image = ? WHERE productid = ?;";

                            conn.query(sqlQuery, [imagelink, productid], function(err, result) {
                                conn.end();
                                if (err) {
                                    return callback(err, null, null);
                                } else {
                                    return callback(null, result, null);
                                }
                            });

                        } else { //delete existing image from image folder
                            console.log("existing image, return current image link")
                            console.log("Connected to MySQL from product.js, executing product.updateImageLink (existing img = not null)");
                            var sqlQuery = "UPDATE product SET image = ? WHERE productid = ?;";

                            conn.query(sqlQuery, [imagelink, productid], function(err, result) {
                                conn.end();
                                if (err) {
                                    return callback(err, null, null);
                                } else {
                                    return callback(null, result, currentImgLink);
                                }
                            });
                        }
                    }
                });
            }
        });
    },

    updateProduct: (productid, details, callback) => { // for assignment 2 endpoint: update product details by productid
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                //first query to retrieve default values of the productid
                console.log("Retrieving default values of the product");
                var retrieveQuery = "SELECT name, description, categoryid, brand, price FROM product WHERE productid = ?;";
                conn.query(retrieveQuery, [productid], function(err, defaultValue) {
                    if (err) {
                        return callback(err, null);

                    } else if (defaultValue == "") {
                        return callback(null, defaultValue);

                    } else { //if value is empty replace with default user values
                        var { name, description, categoryid, brand, price } = details;
                        if (name.trim() == "") name = defaultValue[0]["name"];
                        if (description.trim() == "") description = defaultValue[0]["description"];
                        if (categoryid.trim() == "") categoryid = defaultValue[0]["categoryid"];
                        if (brand.trim() == "") brand = defaultValue[0]["brand"];
                        if (price.trim() == "") price = defaultValue[0]["price"];

                        //second query to update user information
                        console.log("Connected to MySQL from product.js, executing product.updateProduct");
                        var sqlQuery = "UPDATE product SET name = ?, description = ?, categoryid = ?, brand = ?, price = ? WHERE productid = ?;";
                        conn.query(sqlQuery, [name, description, categoryid, brand, price, productid], function(err, result) {
                            conn.end();
                            if (err) {
                                return callback(err, null);
                            } else {
                                return callback(null, result);
                            }
                        });
                    }
                })
            }
        });
    },

    newestProducts: (callback) => { //for assignemnt 2 endpoint: show 12 newest products by created_at date
        var conn = db.getConnection();

        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to MySQL from product.js, executing product.showAll");
                var sqlQuery =
                    "SELECT p.productid, p.name, p.description, c.category as categoryname, p.brand, p.price, p.image, p.created_at FROM product as p, category as c WHERE p.categoryid = c.categoryid ORDER BY p.created_at DESC LIMIT 12;"

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
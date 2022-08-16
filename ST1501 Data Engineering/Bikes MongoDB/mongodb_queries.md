# Submission Queries (DENG CA2 Individual)
<br>


## Query 1 - Implement a query to find out those bike names which are less than $2000 and belonging to Road Bikes and have zero stock (3 rows)
```
db.ZeroStock.find(
	{"category_name": "Road Bikes", "list_price": {$lt: 2000}}, 
	{_id:0}
).sort({"list_price": -1}).pretty()
```
<br>


## Query 2 - Implement a query to find out the unduplicated category names and unduplicated brand names separately for these unsold products
```
db.UnSold.aggregate([
    {"$group": 
        {_id: null, "category": {"$addToSet":"$category_name"}, "brand": {"$addToSet":"$brand_name"}}
    }
]).pretty()
```
<br>


## Query 3 - Implement a query to find the unduplicated sets of category names and brand names in combination (6 rows)
```
db.UnSold.aggregate([
	{$group: 
		{_id: {"brand":"$brand_name", "category":"$category_name"}}
	},
	{$sort: {_id: 1}}
])
```
<br>


## Query 4 - Implement a query to find the information of those products which are unsold and have stock (8 rows)
```
db.UnSold.aggregate([
	{$lookup: {from:"Stock", localField:"product_id", foreignField:"product_id", as:"product"} },
    {$match: {"product":{$ne:[]}} },
    {$project: {_id:0, "product": 0}}
]).pretty()
```
<br>


## Query 5 – Making use of the product_id from Query 4, implement a query to find their total stock available arranged in descending order (8 rows)
```
db.UnSold.aggregate([
	{$lookup: {from:"Stock", localField:"product_id", foreignField:"product_id", as:"product"} },
    {$match: {"product":{$ne:[]}} },
    {$unwind:"$product"},
    {$group:
        {_id:"$product_id", stock:{$sum:"$product.quantity"}, product_name:{$first:"$product_name"}}
    },
    {$sort: {stock:-1}}
]).pretty()
```
<br>


## Query 6 – Modify Query 4 and implement a query to find the information of those products which are sold but do not have stock (2 rows)
```
db.ZeroStock.aggregate([
	{$lookup: {from:"UnSold", localField:"product_id", foreignField:"product_id", as:"unsold_product"} },
    {$match: {"unsold_product": {$eq:[]} }},
    {$project: {_id:0, "unsold_product": 0}}
]).pretty()
```


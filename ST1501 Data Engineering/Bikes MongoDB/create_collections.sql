USE BikeSalesMinions
GO

-- UnSold collection query: products which have never been sold (14 rows)
SELECT p.product_id, p.product_name, b.brand_name, c.category_name, p.model_year, p.list_price FROM Production.products p
INNER JOIN Production.brands b ON p.brand_id = b.brand_id -- get brand name
INNER JOIN Production.categories c ON p.category_id = c.category_id -- get category name
WHERE p.product_id NOT IN ( -- Get product only if it has never been ordered before
	SELECT oi.product_id FROM Sales.order_items oi
	INNER JOIN sales.orders o ON oi.order_id = o.order_id
)
	FOR JSON PATH,
	INCLUDE_NULL_VALUES
GO


-- ZeroStock collection query: products which have zero stock (8 rows)
SELECT p.product_id, p.product_name, b.brand_name, c.category_name, p.model_year, p.list_price FROM Production.products p
INNER JOIN Production.brands b ON p.brand_id = b.brand_id -- get brand name
INNER JOIN Production.categories c ON p.category_id = c.category_id -- get category name
WHERE product_id  NOT IN ( -- if product ID is not listed at all in stocks table means it has 0 stock
	SELECT product_id FROM Production.stocks
)
OR product_id IN ( -- for instances where product is listed in stocks table but all 3 stores run out of stock
	SELECT product_id FROM production.stocks
	GROUP BY product_id
	HAVING SUM(quantity) = 0
)
	FOR JSON PATH,
	INCLUDE_NULL_VALUES
GO


-- Stock collection query: products which have stock (939 rows)
select product_id, store_id, quantity from Production.stocks
where product_id in ( -- get product only if it has a total quantity of greater than 0
	select product_id from Production.stocks 
	group by product_id 
	having sum(quantity) > 0
)
	FOR JSON PATH,
	INCLUDE_NULL_VALUES
GO


/*
For UnSold and ZeroStock collections, the documents must have the fields 
product_id, product_name, brand_name, category_name, model_year and 
list_price

For the Stock collection, the documents must have fields product_id, store_id 
and quantity

Find the count of documents in each collection
*/

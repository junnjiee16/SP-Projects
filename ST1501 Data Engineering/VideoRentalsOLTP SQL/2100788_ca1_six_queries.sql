/*
Query 1: View total number of outgoing movies per store and per month
*/
SELECT COUNT(i.unit_id) 'Number of Outgoing Movies', t.store_id 'Store', MONTH(t.date_start) 'Month'
FROM transaction_relation t
INNER JOIN rent_reserve_relation r ON t.transaction_id = r.transaction_id
INNER JOIN inventory_relation i ON r.unit_id = i.unit_id
INNER JOIN catalog_relation c ON i.item_id = c.item_id
WHERE 
	t.transaction_type = 'Rental' AND -- outgoing movies means rented movies
	c.category_id = 'C3' -- category C3 is movies
GROUP BY t.store_id, MONTH(t.date_start)
ORDER BY MONTH(t.date_start), t.store_id


/*
Query 2i: View the average number of rental days per customer
*/
SELECT c.customer_id 'Customer ID', c.first_name + ' ' + c.last_name 'Customer Name', avg_rentals.[Avg Rental Days] FROM customer_relation c
INNER JOIN ( -- join by customer_id to customer_relation so customer name can be retrieved
	SELECT c.customer_id, AVG(CAST(DATEDIFF(DAY, t.date_start, t.date_end) AS DECIMAL(10,2))) 'Avg Rental Days'
	FROM transaction_relation t
	INNER JOIN customer_relation c ON t.customer_id = c.customer_id
	WHERE
		t.transaction_type = 'Rental' -- select rental transaction type only
	GROUP BY c.customer_id
)
AS avg_rentals
ON c.customer_id = avg_rentals.customer_id
ORDER BY [Avg Rental Days] DESC


/*
Query 2ii: View the average number of rental days per title
Note:
	1. Grouped by display name as same movie can be different device (vhs/dvd). Group by item_id instead if vhs and dvd
	of same movie are to be treated as two different items
*/
SELECT c.display_name 'Item Name', AVG(CAST(DATEDIFF(DAY, t.date_start, t.date_end) AS DECIMAL(10,2))) 'Avg Rental Days'
FROM transaction_relation t
INNER JOIN rent_reserve_relation r ON t.transaction_id = r.transaction_id
INNER JOIN inventory_relation i ON r.unit_id = i.unit_id
INNER JOIN catalog_relation c ON i.item_id = c.item_id
WHERE 
	t.transaction_type = 'Rental'
GROUP BY c.display_name
ORDER BY [Avg Rental Days] DESC


/*
Query 3: View 10 most frequently reserved titles for last year. The query must be able to retrieve records 
         from any one year past from date of query
*/
DECLARE @date DATE
SET @date = '2021-05-30' --change date to any desired date
SELECT TOP 10
	c.display_name 'Item Name', SUM(DATEDIFF(DAY, t.date_start, t.date_end)) 'Total Reserved Days'
FROM transaction_relation t
INNER JOIN rent_reserve_relation r ON t.transaction_id = r.transaction_id
INNER JOIN inventory_relation i ON r.unit_id = i.unit_id
INNER JOIN catalog_relation c ON i.item_id = c.item_id
WHERE 
	t.transaction_type = 'Reserve' AND
	t.date_start BETWEEN DATEADD(YEAR,-1, @date) AND @date --choose all dates that are between -1 year of the desired date
GROUP BY 
	c.display_name
ORDER BY [Total Reserved Days] DESC


/*
Query 4: View 100 best customers in terms of money paid to the company
*/
SELECT c.customer_id, c.first_name + ' ' + c.last_name 'Customer Name', ttl_spent.[Total Money Spent]
FROM customer_relation c
INNER JOIN (
	SELECT t.customer_id, SUM(p.rental_fee + ISNULL(p.penalty_fee,0)) 'Total Money Spent'
	FROM transaction_relation t
	INNER JOIN payment_relation p ON t.transaction_id = p.transaction_id
	GROUP BY t.customer_id
)
AS ttl_spent
ON c.customer_id = ttl_spent.customer_id
ORDER BY [Total Money Spent] DESC


/*
Query 5: View monthly revenue of the company for the 12 months. The query must be flexible to retrieve
any previous 12 months from any date of query and exclude penalty charges
*/
SELECT 
	SUM(rental_fee + penalty_fee) 'Revenue',
	MONTH(payment_date) 'Month'
FROM 
	payment_relation
WHERE 
	payment_date BETWEEN DATEADD(MONTH,-12, '2021-12-30') AND '2021-12-30'
GROUP BY MONTH(payment_date)
ORDER BY [Month]


/*
Query 6: View the total amount of penalty incurred by each customer for movies and equipment respectively
*/
SELECT 
	t.customer_id,
	SUM(CASE WHEN c.category_id = 'C3' THEN DATEDIFF(DAY, t.date_end, p.payment_date) * 0.5 ELSE 0 END) 'Penalty for Movie ($)',
	SUM(CASE WHEN c.category_id != 'C3' THEN DATEDIFF(DAY, t.date_end, p.payment_date) * 1.5 ELSE 0 END) 'Penalty for Equipment ($)'
FROM payment_relation p
INNER JOIN transaction_relation t ON p.transaction_id = t.transaction_id
INNER JOIN rent_reserve_relation r ON t.transaction_id = r.transaction_id
INNER JOIN inventory_relation i ON r.unit_id = i.unit_id
INNER JOIN catalog_relation c ON i.item_id = c.item_id
WHERE
	DATEDIFF(DAY, t.date_end, p.payment_date) > 0
GROUP BY t.customer_id


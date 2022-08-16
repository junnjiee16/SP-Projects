-- Create database
CREATE DATABASE DENG_CA1_DB;
GO

USE DENG_CA1_DB;
GO

-- 1) store_relation
-- Purpose: record all stores and their location/address
CREATE TABLE store_relation (
	store_id VARCHAR(7) NOT NULL, -- PK
	store_location VARCHAR(100) NOT NULL,
	country VARCHAR(100) NOT NULL,
	store_state VARCHAR(100) NOT NULL,
	city VARCHAR(100) NOT NULL,
	street VARCHAR(100) NOT NULL,
	zip_code VARCHAR(5) NOT NULL,

	PRIMARY KEY (store_id)
);
GO

-- 2) category_relation
-- Purpose: assign unique identifier for each category of products in catalog (movies, vcr, vidcam, etc.)
CREATE TABLE category_relation (
	category_id VARCHAR(7) NOT NULL, -- PK
	category_name VARCHAR(100) NOT NULL,

	PRIMARY KEY (category_id)
);
GO

-- 3) catalog_relation
-- Purpose: assign unique identifier for each UNIQUE ITEM the company has as well as the charge ($) per day
CREATE TABLE catalog_relation (
	item_id VARCHAR(7) NOT NULL, -- PK
	category_id VARCHAR(7) NOT NULL, -- FK: category_relation
	display_name VARCHAR(100) NOT NULL,
    charge DECIMAL(7,2) NOT NULL,
	image_url VARCHAR(300) NOT NULL,

	PRIMARY KEY (item_id),
	FOREIGN KEY (category_id) REFERENCES category_relation(category_id)
);
GO

-- 4) vcr_relation
-- Purpose: records all VCR equipment the company has
CREATE TABLE vcr_relation (
	item_id VARCHAR(7) NOT NULL, -- PK FK: catalog_relation
	vcr_type VARCHAR(100) NOT NULL,
	vcr_brand VARCHAR(100) NOT NULL,
	made_by VARCHAR(100) NOT NULL,
	purchase_date DATE NOT NULL,

	PRIMARY KEY (item_id),
	FOREIGN KEY (item_id) REFERENCES catalog_relation(item_id)
);
GO

-- 5) vidcam_relation
-- Purpose: records all video camera equipment the company has
CREATE TABLE vidcam_relation (
	item_id VARCHAR(7) NOT NULL, -- PK FK: catalog_relation
	vidcam_brand VARCHAR(100) NOT NULL,
	made_by VARCHAR(100) NOT NULL,
	purchase_date DATE NOT NULL,

	PRIMARY KEY (item_id),
	FOREIGN KEY (item_id) REFERENCES catalog_relation(item_id)
);
GO

-- 6) movie_relation
-- Purpose: records all movie items the company has
CREATE TABLE movie_relation (
	item_id VARCHAR(7) NOT NULL, -- PK FK: catalog_relation
	director VARCHAR(100) NOT NULL,
	producer VARCHAR(100) NOT NULL,
	actor VARCHAR(100) NOT NULL,
	actor_2 VARCHAR(100) NOT NULL,
	genre VARCHAR(50) NOT NULL,
	movie_medium VARCHAR(50) NOT NULL,

	PRIMARY KEY (item_id),
	FOREIGN KEY (item_id) REFERENCES catalog_relation(item_id)
);
GO

-- 7) item_count_relation
-- Purpose: record assigned count of each item to each store
CREATE TABLE item_count_relation (
	item_id VARCHAR(7) NOT NULL, -- Composite PK FK: catalog_relation
    store_id VARCHAR(7) NOT NULL, --Composite PK FK: store_relation
	assigned_count INTEGER NOT NULL,

	PRIMARY KEY (item_id, store_id),
	FOREIGN KEY (item_id) REFERENCES catalog_relation(item_id),
    FOREIGN KEY (store_id) REFERENCES store_relation(store_id)
);
GO

-- 8) inventory_relation
-- Purpose: record and assign unique identifier for every UNIQUE UNIT (COPIES of the same ITEM) the company has
--          as well as show status (available/not available) of each item
CREATE TABLE inventory_relation (
	unit_id VARCHAR(7) NOT NULL, -- PK
    unit_status VARCHAR(13) NOT NULL,
	item_id VARCHAR(7) NOT NULL, -- FK: catalog_relation
    store_id VARCHAR(7) NOT NULL, -- FK: store_relation

	PRIMARY KEY (unit_id),
	FOREIGN KEY (item_id) REFERENCES catalog_relation(item_id),
    FOREIGN KEY (store_id) REFERENCES store_relation(store_id)
);
GO

-- 9) customer_relation
-- Purpose: record all customer info in a table
CREATE TABLE customer_relation (
	customer_id VARCHAR(7) NOT NULL, -- PK
    first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100) NOT NULL,
	minit VARCHAR(5) NOT NULL,
	country VARCHAR(100) NOT NULL,
	cust_state VARCHAR(100) NOT NULL,
	city VARCHAR(100) NOT NULL,
	street VARCHAR(100) NOT NULL,
	zip_code VARCHAR(5) NOT NULL,
    cust_password VARCHAR(100) NOT NULL,
	phone VARCHAR(15) NOT NULL,
	driver_license VARCHAR(30) NOT NULL,
	card_number VARCHAR(30) NOT NULL,
	card_type VARCHAR(100) NOT NULL,

	PRIMARY KEY (customer_id)
);
GO

-- 10) employee_relation
-- Purpose: record all employee info in a table
CREATE TABLE employee_relation (
	employee_id VARCHAR(7) NOT NULL, -- PK
    first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100) NOT NULL,
	minit VARCHAR(5) NOT NULL,
	country VARCHAR(100) NOT NULL,
	emp_state VARCHAR(100) NOT NULL,
	city VARCHAR(100) NOT NULL,
	street VARCHAR(100) NOT NULL,
	zip_code VARCHAR(5) NOT NULL,
	title VARCHAR(50) NOT NULL,
	pay_type VARCHAR(16) NOT NULL,
	pay_rate DEC(5, 2) NOT NULL,
	store_id VARCHAR(7) NOT NULL, -- FK: store_relation

	PRIMARY KEY (employee_id),
	FOREIGN KEY (store_id) REFERENCES store_relation(store_id)
);
GO

-- 11) transaction_relation
-- Purpose: record all transactions made by customers at different stores in a table
CREATE TABLE transaction_relation (
	transaction_id VARCHAR(7) NOT NULL, -- PK
	transaction_type VARCHAR(50) NOT NULL,
    customer_id VARCHAR(7) NOT NULL, -- FK: customer_relation
	store_id VARCHAR(7) NOT NULL, -- FK: store_relation
	date_start DATE NOT NULL,
	date_end DATE NOT NULL,

	PRIMARY KEY (transaction_id),
	FOREIGN KEY (customer_id) REFERENCES customer_relation(customer_id),
	FOREIGN KEY (store_id) REFERENCES store_relation(store_id)
);
GO

-- 12) rent_reserve_relation
-- Purpose: record all rented/reserved units (*unit is a copy of an item*) under a single transaction
CREATE TABLE rent_reserve_relation (
	transaction_id VARCHAR(7) NOT NULL, -- Composite PK FK: transaction_relation
	unit_id VARCHAR(7) NOT NULL, -- Composite PK FK: inventory_relation

	PRIMARY KEY (transaction_id, unit_id),
	FOREIGN KEY (transaction_id) REFERENCES transaction_relation(transaction_id),
	FOREIGN KEY (unit_id) REFERENCES inventory_relation(unit_id)
);
GO

-- 13) payment_relation
-- Purpose: record returned rental transactions and rental/penalty fee paid for each transaction
CREATE TABLE payment_relation (
	transaction_id VARCHAR(7) NOT NULL,
	rental_fee DEC(9, 2) NOT NULL,
	penalty_fee DEC(9, 2) NOT NULL,
	payment_date DATE NOT NULL,

	PRIMARY KEY (transaction_id),
	FOREIGN KEY (transaction_id) REFERENCES transaction_relation(transaction_id)
);
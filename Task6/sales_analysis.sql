use sales_data;

CREATE TABLE orders (
    order_id VARCHAR(10) PRIMARY KEY,
    order_date DATE,
    quantity INT,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2)
);


INSERT INTO orders (order_id, order_date, quantity, unit_price, total_price)
VALUES
('AC001', '2004-08-12', 5, 200, 1000),
('AC002', '2004-09-13', 10, 200, 2000),
('AC003', '2004-10-14', 12, 200, 2400),
('AC004', '2004-11-15', 13, 200, 2600),
('AC005', '2004-12-16', 34, 200, 6800),
('AC006', '2005-01-01', 6, 300, 1800),
('AC007', '2005-02-02', 7, 300, 2100),
('AC008', '2005-03-03', 8, 300, 2400),
('AC009', '2005-04-04', 9, 300, 2700),
('AC010', '2005-05-05', 10, 300, 3000),
('AC011', '2005-06-06', 50, 300, 15000),
('AC012', '2005-07-07', 100, 300, 30000),
('AC013', '2005-08-08', 25, 300, 7500),
('AC014', '2005-09-09', 40, 300, 12000),
('AC015', '2005-10-10', 22, 300, 6600),
('AC016', '2005-11-11', 20, 300, 6000);

select * from orders;

#Extracting the month_no. from the date column.
select total_price,extract(month from order_date) as Month_no from orders where total_price > 2500;

#finding out the total sales by month ussing groupby clause
select sum(total_price) as total_sales_by_month,extract(month from order_date) as month_no from orders group by extract(month from order_date);

# finding out the total revenue of the seller
select sum(total_price) as revenue from orders;

#extracting out the unique orders_id
select distinct(order_id) as unique_id from orders;

#using order by for sorting
select * from orders order by total_price desc;

#using limit for the results of specific time period lets say i want the data of top 5 sales by total_price
select * from orders order by total_price desc limit 5;

#using limit for the results of specific time period lets say i want the data of top 5 sales by total_price starting from 5th row
select * from orders order by total_price desc limit 5 offset 5;


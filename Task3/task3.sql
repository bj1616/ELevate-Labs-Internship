CREATE DATABASE OnlineShopping1;

Use OnlineShopping1;

CREATE TABLE Customer
(
	CustomerID int AUTO_INCREMENT PRIMARY KEY,
	FirstName varchar(255) NOT NULL,
	LastName varchar(255) NOT NULL,
	DOB date NOT NULL,
	Email varchar(255) NOT NULL,
	Password varchar(255) NOT NULL,
	Contact varchar(255) NOT NULL
);

CREATE TABLE Country
(
	CountryID int AUTO_INCREMENT  PRIMARY KEY,
	CountryName varchar(255) NOT NULL
);


CREATE TABLE Category
(
	CategoryID int AUTO_INCREMENT  PRIMARY KEY,
	CategoryName varchar(255) NOT NULL
);


CREATE TABLE Product
(
	ProductID int AUTO_INCREMENT  PRIMARY KEY,
	ProductName varchar(255) NOT NULL,
	CategoryID int NOT NULL,
    FOREIGN KEY(CategoryID) REFERENCES Category(CategoryID)
);


CREATE TABLE Orders
(
	OrderID int AUTO_INCREMENT  PRIMARY KEY,
	CustomerID int  NOT NULL,
    FOREIGN KEY(CustomerID) REFERENCES Customer(CustomerID),
	OrderDate date NOT NULL,
	TrackingID varchar(255) NOT NULL
);



CREATE TABLE Cart
(
	CartID int AUTO_INCREMENT  PRIMARY KEY,
	DateCreated date NOT NULL,
	CustomerID int   NOT NULL,
    FOREIGN KEY(CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE CartProduct
(
	CartProductID int AUTO_INCREMENT  PRIMARY KEY,
	VendorProductID int  NOT NULL,
	FOREIGN KEY(VendorProductID) REFERENCES VendorProduct(VendorProductID),
	Quantity int NOT NULL,
	CartID int   NOT NULL,
    FOREIGN KEY(CartID) REFERENCES Cart(CartID)
);

show tables;

# Inserting data into the Category Table
insert into Category values('01','Android Smart TV Box/Air Mouse');
insert into category values('02','Attendance Machine');
insert into category values('03','Barcode Scanner/Thermal Receipt Printer');
insert into category values('04','Bluetooth Handsfree');
insert into category values('05','Bluetooth Headphone');
insert into category values('06','Bluetooth Speakers');
insert into category values('07','Power Bank');
insert into category values('08','Security Cameras and Gadgets');
insert into category values('09','Smart Watch');

select * from Category;

# Inserting data into the Customer Table
Insert Into Customer Values('01','Aamir','Abbasi','1998-03-29','Aamir@Whatmobile.Com.Pk','92Eac13CiJz','03008564501');
Insert Into Customer Values
('02','Aamir','Raees','1994-07-23','aamir.rais150@gmail.com','yEN[J(78','03007365250');
Insert Into Customer Values
('03','Abbas','Raza','1991-06-07','Abbas_raza94@Hotmail.Com','hLL77dq1_*','03235536781');
Insert Into Customer Values
('04','Abdul','Majid','1996-05-03','Kamranwahid2032@Ymail.Com','(2R_N,yzx+g|','03212800124');
Insert Into Customer Values
('05','Abdul','Saboor','1998-05-06','ubaidaslam1988@gmail.com','|0.6rgsO&c','03366840140');
Insert Into Customer Values
('06','Abdul','Moiz','1990-12-03','Abdulmoizmohsin@Gmail.Com','.VsH43r*E)','03005901176');
Insert Into Customer Values
('07','Dua','Abbas','1995-08-18','DuaAbbas@gmail.com','JZR-Fe1PG','03346953222');
Insert Into Customer Values
('08','Duncan','Majeed','1990-05-18','DuncanMajeed@gmail.com','Sd1G2qHmk','03452633929');
Insert Into Customer Values
('09','Ehtsham','Raheem','1998-04-18','EhtshamRaheem@gmail.com','Zw`f<(yo8','03455562622');
Insert Into Customer Values
('10','Ejaz','Haq','1993-09-17','EjazHaq@gmail.com','8+Sl`F),N','03454544444');
Insert Into Customer Values
('11','Faaz','Rehman','1997-11-28','FaazRehman@gmail.com','K<RcGG2pH','03522225252');
Insert Into Customer Values
('12','Fahad','Samad','1996-02-16','FahadSamad@gmail.com','t2Mfrt|VM(','03355040790');
Insert Into Customer Values
('13','fahd','Aziz','1992-11-24','fahdAziz@gmail.com','by5WmXBn><jK','03355453606');
Insert Into Customer Values
('14','Faheem','Waqar','1995-08-30','FaheemWaqar@gmail.com',':.iLPqKR','03404023447');
Insert Into Customer Values
('15','Faisal','RAZZIQUE','1996-07-27','FaisalRAZZIQUE@gmail.com','cWc@kTnt','03352445993');

select * from Customer;
 
# Inserting data into the Orders Table
Insert Into Orders Values('01','1','2011-01-27','77425889862');
Insert Into Orders Values('02','2','2013-07-26','77425886223');
Insert Into Orders Values('03','3','2014-02-21','77425885208');
Insert Into Orders Values('04','4','2013-04-29','77425885238');
Insert Into Orders Values('05','5','2013-06-05','77425886334');
Insert Into Orders Values('06','6','2015-03-14','77425882206');
Insert Into Orders Values('07','7','2010-09-21','77425885130');
Insert Into Orders Values('08','8','2012-07-22','77425885227');
Insert Into Orders Values('09','10','2016-08-05','77425883684');
Insert Into Orders Values('10','12','2015-12-25','77425888585');
Insert Into Orders Values('11','14','2017-09-16','77425882890');
Insert Into Orders Values('12','15','2012-11-05','77425887131');

# retrieving the data from orders table
select * from Orders;  

 # Where condition
select * from Orders where OrderDate = "2010-09-21"; 

 # orderby descending order
select * from Orders order by OrderDate Desc;  

# Using inner join
select C.FirstName,C.LastName,C.DOB,o.orderDate from Customer as C inner join Orders o on c.CustomerID=o.CustomerID;

# Using Left join
select C.FirstName,C.LastName,C.DOB,o.orderDate from Customer as C left join Orders o on c.CustomerID=o.CustomerID;

# Using Right join
select C.FirstName,C.LastName,C.DOB,o.orderDate from Customer as C right join Orders o on c.CustomerID=o.CustomerID;

#Used aggregate function such as sum
select sum(CustomerID) as total_customers from Customer;

# Creating view
create view Orders_After_2015 as
select * from Orders where OrderDate >= "2015-03-14";
select * from Orders_After_2015;

# Subquery
select * from orders where OrderDate not in (select OrderDate from Orders where OrderDate > "2015-03-14" and OrderDate < "2017-09-16");

#optimising query using Index
create INDEX category_idx on Category(CategoryName);
select * from Category where CategoryName="Power Bank";

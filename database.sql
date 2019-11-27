DROP DATABASE bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) DEFAULT 'undefined',
    department_name VARCHAR(100) DEFAULT 'undefined',
    price DOUBLE DEFAULT 0.00,
    stock_quantity INT DEFAULT 0
);

INSERT INTO products (product_name, department_name, price,  stock_quantity) VALUES ("A Minute to Midnight", 'Books', 17.71, 33), 
("Apple TV 4K (32GB, Latest Model)", "Computers", 157.52, 10), 
("UGG Men's Tasman Slipper", "Men's Fashion", 99.95, 24),
("JanSport Superbreak Backpack", "Luggage", 15.99, 6),
("Wilson NFL Super Grip Football", "Sports and Outdoors", 11.20, 23),
("Catit LED Flower Water Fountain, Blue", "Pet Supplies", 18.99, 1),
("Lumies Dazzle Gogo", "Toys and Games", 11.27,10),
("The Guardians", "Books", 10.56, 2),
("FurGoPet Deshedding Tool for Cats", "Pet Supplies", 16.48, 12),
("Blippi Plush Doll - 13 inch.", "Toys and Games", 16.99, 5);
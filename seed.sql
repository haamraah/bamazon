INSERT INTO departments
    (department_name,over_head_costs)
VALUES
    ("electronics", 10000 ),
    ("books", 10000),
    ("sporting good", 10000 ),
    ("movies", 10000 );


INSERT INTO products
    (product_name,department_id,price,stock_quantity)
VALUES
    ("laptop", 1, 600, 40),
    ("tablet", 1, 400, 80),
    ("flash memory", 1, 20, 35),
    ("js for dummys", 2, 100, 35),
    ("fitness gear", 3, 210, 15),
    ("basketball", 3, 7, 40),
    ("avatar", 4, 10.99, 40),
    ("joker", 4, 19.99, 40),
    ("el camino", 4, 12.99, 40);
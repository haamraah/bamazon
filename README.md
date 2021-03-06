
# BAMazon
CRUD Node application to keep track of inventory.
The goal was to create an Amazon-like store front using Node.js and MySQL.

## Getting Started

### Prerequisites

```
- Node.js - Download the latest version of Node https://nodejs.org/en/
- Create a MYSQL database called 'Bamazon', reference schema.sql and seed.sql
```

- Clone repo.
- Run command in Terminal or Gitbash 'npm install'
- Run command depending which mode you would like to be on:
    * Customer - 'npm run customer'
    * Manager - 'npm run manager'
    * Supervisor - 'npm run supervisor'

### What Each JavaScript Does

1. `bamazonClient.js`

    * Prints the products in the store.

    * Prompts customer which product they would like to purchase by ID number.

    * Asks for the quantity.

      * If there is a sufficient amount of the product in stock, it will return the total for that purchase.
      * However, if there is not enough of the product in stock, it will tell the user that there isn't enough of the product.
      * If the purchase goes through, it updates the stock quantity to reflect the purchase.
      * It will also update the product sales in the department table.

-----------------------

2. `BamazonManager.js`

    * Starts with a menu:
        * View Inventory
        * View Low Inventory
        * Add to Inventory
        * Add New Product
        * Quit




    * If the manager selects `View inventory`, it lists all of the products in the store including all of their details.

    * If the manager selects `View Low Inventory`, it'll list all the products with less than five items in its StockQuantity column.

    * If the manager selects `Add to Inventory`, it allows the manager to select a product and add inventory.

    * If the manager selects `Add New Product`, it allows the manager to add a new product to the store.

    * If the manager selects `Quit`, it ends the session and doesn't go back to the menu.

-----------------------

3. `bamazonSupervisor.js`

    * Starts with a menu:
        * View Inventory
        * Product Sales by Department
        * Create New Department
        * Quit

    * If the manager selects `View inventory`, it lists all of the products in the store including all of their details.

    * If the manager selects `Product Sales by Department`, it lists the Department Sales and calculates the total sales from the overhead cost and product sales.

    * If the manager selects `Create New Department`, it allows the manager to create a new department and input current overhead costs and product sales. If there are none, by default it will set at 0.

    * If the manager selects `Quit`, it ends the session and doesn't go back to the menu.

## Demo GIF

* Customer: bamazonClient.js 

    ![Customer Demo](screenShots/customer.gif)

* Manager : bamazonManager.js 

    ![Manager Demo](screenShots/manager.gif)

* Supervisor : bamazonSupervisor.js

    ![Supervisor Demo](screenShots/supervisor.gif)


## Technologies used
- Node.js
- Inquire NPM Package (https://www.npmjs.com/package/inquirer)
- MYSQL NPM Package (https://www.npmjs.com/package/mysql)


## Built With

* Sublime Text - Text Editor
* MySQLWorkbench
* Terminal/Gitbash

## Authors

* **Hamrah Khamsehzadeh** - *JS/MySQL/Node.js* - [Hamrah Khamsehzadeh](https://github.com/Haamraah)
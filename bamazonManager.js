var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "zap",
    database: "bamazon"
});
isConnected = false;
// program runs on connection call back

console.log("connecting to Database ...")
connection.connect((err) => {
    if (err) throw err;
    console.log(`
    
    connected as id ${connection.threadId}
    
    `);
    isConnected = true;
    exe();
});
// main prompt function we call this function if error in user input or user selects main menu of after each opration
function exe() {
    inquirer.prompt([{
        type: "list",
        choices: [`View inventory`, `View Low Inventory`, `Add to Inventory`, `Add new product`, `Quit`],
        name: "command"
    }]).then((res) => {
        if (res.command == `Add new product`) {
            // readDb (query,log or not log, callback)
            readDb("SELECT item_id,product_name,department_name,departments.department_id,price,stock_quantity,product_sales FROM bamazon.products  INNER JOIN bamazon.departments ON bamazon.departments.department_id = bamazon.products.department_id", true, addProduct())
        } else if (res.command == `Quit`) {
            // close the connection before exit

            connection ? connection.destroy() : false;
        } else if (res.command == `View inventory`) {
            readDb("SELECT item_id,product_name,department_name,departments.department_id,price,stock_quantity,product_sales FROM bamazon.products  INNER JOIN bamazon.departments ON bamazon.departments.department_id = bamazon.products.department_id", true, exe())
        } else if (res.command == `View Low Inventory`) {
            readDb("SELECT * FROM bamazon.products WHERE stock_quantity <5", true, exe())
        } else if (res.command == `Add to Inventory`) {
            console.log("add to inventory")
            readDb("SELECT item_id,product_name,department_name,departments.department_id,price,stock_quantity,product_sales FROM bamazon.products  INNER JOIN bamazon.departments ON bamazon.departments.department_id = bamazon.products.department_id", true, addToInventory())
        }
    });
}

// ask manager the prodct to add to and the quantity to add
function addToInventory() {

    console.log(`

    -------- ADD to existing product --------
    
    
    
    
      `);
    inquirer.prompt([{
        type: "input",
        message: `product ID? (* for main menu)`,
        name: "productId"
    }, {
        type: "input",
        message: `product quantity to add? (* for main menu)`,
        name: "productQuantity"
    }]).then((resProductInfo) => {
        if (resProductInfo.productId == "*" || resProductInfo.productQuantity == "*") {
            exe();
        } else if (isNaN(resProductInfo.productId)) {
            console.log(`
    
    -------- invalid product id--------
      
      `);
        } else {
            console.log("update db call")
            updateDb(resProductInfo.productId, resProductInfo.productQuantity, exe());
        }
    });


}
// readDb (query,log or not log, callback)
function readDb(_query, logOut, callback) {
    // check the status of connection

    if (isConnected) {
        connection.query(_query, (err, res) => {
            if (err) throw err;
            // check if we want to log the result or not
            if (logOut) {
                console.log(`
            
-------------------Loading-------------------


            `)
                console.table(res)
                console.log(`
            




            `)
            }
            // call the callback only in case of success
            callback
            return res

        });


    }
}


function addProduct() {
    console.log(`

-------- ADD product --------




  `);
    readDb("SELECT * FROM bamazon.departments", true)
    inquirer.prompt([{
        type: "input",
        message: `department ID? (* for main menu)`,
        name: "departmentId"
    }, {
        type: "input",
        message: `product name? (* for main menu)`,
        name: "productName"
    }, {
        type: "input",
        message: `price? (* for main menu)`,
        name: "productPrice"
    }, {
        type: "input",
        message: `product quantity? (* for main menu)`,
        name: "productQuantity"
    }]).then((resProductInfo) => {
        if (resProductInfo.departmentId == "*" || resProductInfo.productName == "*" || resProductInfo.productPrice == "*" || resProductInfo.productQuantity == "*") {
            exe();
        } else if (isNaN(resProductInfo.departmentId)) {
            console.log(`

-------- invalid department id--------
  
  `);
        } else {
            addToDb(resProductInfo.departmentId, resProductInfo.productName, resProductInfo.productPrice, resProductInfo.productQuantity, exe());
        }
    });
};


function addToDb(_depID, _productName, _productPrice, _productQuantity, callback) {
    // console.log(`will add ${depName} and ${costOverHead} to db`)

    if (isConnected) {
        console.log(`
        Inserting a new department......

        `);
        connection.query(
            "INSERT INTO products SET ?", {
                department_id: _depID,
                product_name: _productName,
                price: _productPrice,
                stock_quantity: _productQuantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(`
                
                product ${_productName}  inserted!
                
                `);

                callback
            }
        );

    }


};


function updateDb(_productID, _productQuantity, callback) {

    if (isConnected) {
        console.log(`
        updating product quantity......

        `);
        connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${_productQuantity} WHERE ?`,
            [{
                item_id: _productID
            }],
            function (err, res) {
                if (err) throw err;
                console.log(`
                
                product  updated!
                
                `);

                callback
            }
        );

    }


};
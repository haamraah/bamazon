var inquirer = require("inquirer");
var _table = require("table");
var mysql = require("mysql");
console.log("connecting to Database ...")

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
        choices: [`see inventory`, `buy product`, `Quit`],
        name: "command"
    }]).then((res) => {
        if (res.command == `buy product`) {
            // readDb (query,log or not log, callback)
            // in this case we show all the products to client and as a call back we run buyProduct function
            readDb("SELECT item_id,product_name,department_name,departments.department_id,price,stock_quantity,product_sales FROM bamazon.products  INNER JOIN bamazon.departments ON bamazon.departments.department_id = bamazon.products.department_id", true, buyProduct());
        } else if (res.command == `Quit`) {
            // close the connection before exit
            connection ? connection.destroy() : false;
        } else if (res.command == `see inventory`) {
            // readDb (query,log or not log, callback)
            // in this case we show all the products to client and as a call back we run exe function(main menu)
            readDb("SELECT item_id,product_name,department_name,departments.department_id,price,stock_quantity,product_sales FROM bamazon.products  INNER JOIN bamazon.departments ON bamazon.departments.department_id = bamazon.products.department_id", true, exe())
        }
    });
}


function buyProduct() {

// ask client the prodct to buy and the quantity needed
    inquirer.prompt([{
        type: "input",
        message: `product ID to buy? (* for main menu)`,
        name: "productId"
    }, {
        type: "input",
        message: `quantity? (* for main menu)`,
        name: "productQuantity"
    }]).then((resProductInfo) => {
        if (resProductInfo.productId == "*") {
            exe();
        } else if (isNaN(resProductInfo.productId)) {
            console.log(`
    
    -------- invalid product id--------
      
      `)
      buyProduct()
      ;
        } else {
// checkQuantity(item id , quantity needed by client)
            checkQuantity(resProductInfo.productId, resProductInfo.productQuantity)

        }
    });


}

// readDb (query,log or not log, callback)
function readDb(_query, toLog, callback) {
    // check the status of connection
    if (isConnected) {
        connection.query(_query, (err, res) => {
            if (err) throw err;
            // check if we want to log the result or not
            if (toLog) {
                console.log(`
            
-------------------loading table-------------------


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


function checkQuantity(productID, quantityToBuy) {
        // check the status of connection

    if (isConnected) {
        connection.query(`SELECT stock_quantity FROM bamazon.products WHERE item_id=${productID}`, (err, res) => {
            if (err) throw err;
            // console.log(res[0].stock_quantity ,Number(quantityToBuy),"quantity check")
// if we have enough in the stock we update the table product
            if (res[0].stock_quantity >= Number(quantityToBuy)) {
                updateDb(productID, quantityToBuy, exe())
                // if not enough in stock tell user and go to buyproduct()
            } else {
                console.log(`
                
                insuficent quantity
                
                `)
                buyProduct()
            }

        });

    }
}


function updateDb(_productID, _productQuantity, callback) {
    // check the status of connection

    if (isConnected) {
        console.log(`
        updating product quantity......

        `);
// UPDATE products SET stock_quantity = ( stock_quantity - 2), product_sales =product_sales + (2 * price )WHERE item_id=1
        connection.query(`UPDATE products SET stock_quantity = ( stock_quantity - ${_productQuantity}), product_sales = product_sales + ( ${_productQuantity} * price ) WHERE ?`,
            [{
                item_id: _productID
            }],
            function (err, res) {
                if (err) throw err;
                console.log(`
                
                product  quantity updated!
                
                `);
            // call the callback only in case of success

                callback
            }
        );

    }


};
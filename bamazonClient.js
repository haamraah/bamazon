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

connection.connect((err) => {
    if (err) throw err;
    console.log(`
    
    connected as id ${connection.threadId}
    
    `);
    isConnected = true;
    exe();

});

function exe() {
    inquirer.prompt([{
        type: "list",
        choices: [`see inventory`, `buy product`, `Quit`],
        name: "command"
    }]).then((res) => {
        if (res.command == `buy product`) {
            readDb("SELECT item_id,product_name,department_name,departments.department_id,price,stock_quantity,product_sales FROM bamazon.products  INNER JOIN bamazon.departments ON bamazon.departments.department_id = bamazon.products.department_id", true, buyProduct());
        } else if (res.command == `Quit`) {
            connection ? connection.destroy() : false;
        } else if (res.command == `see inventory`) {
            readDb("SELECT item_id,product_name,department_name,departments.department_id,price,stock_quantity,product_sales FROM bamazon.products  INNER JOIN bamazon.departments ON bamazon.departments.department_id = bamazon.products.department_id", true, exe())
        }
    });
}



function readDb(_query, toLog, callback) {
    if (isConnected) {
        connection.query(_query, (err, res) => {
            if (err) throw err;
            if (toLog) {
                console.log(`
            
-------------------loading table-------------------


            `)
                console.table(res)
                console.log(`
            




            `)
            }
            callback
            // console.table(res)
            return res

        });

    }
}


function checkQuantity(productID, quantityToBuy) {
    if (isConnected) {
        connection.query(`SELECT stock_quantity FROM bamazon.products WHERE item_id=${productID}`, (err, res) => {
            if (err) throw err;
            console.log(res[0].stock_quantity ,Number(quantityToBuy),"quantity check")

            if (res[0].stock_quantity >Number(quantityToBuy)) {
                updateDb(productID, quantityToBuy, exe())
            } else {
                console.log("insuficent quantity")
                exe()
            }

        });

    }
}

function buyProduct() {


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

            checkQuantity(resProductInfo.productId, resProductInfo.productQuantity)

        }
    });


}


function updateDb(_productID, _productQuantity, callback) {

    if (isConnected) {
        console.log(`
        updating product quantity......

        `);
        connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${_productQuantity} WHERE ?`,
            [{
                item_id: _productID
            }],
            function (err, res) {
                if (err) throw err;
                console.log(`
                
                product  quantity updated!
                
                `);

                callback
            }
        );

    }


};
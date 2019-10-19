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
        choices: [`View inventory`, `View Low Inventory`, `Add to Inventory`, `Add new product`, `Quit`],
        name: "command"
    }]).then((res) => {
        if (res.command == `Add new product`) {
            addProduct();
        } else if (res.command == `Quit`) {
            connection ? connection.destroy() : false;
        } else if (res.command == `View inventory`) {
            readDb("SELECT * FROM bamazon.products", true, exe())
        } else if (res.command == `View Low Inventory`) {
            readDb("SELECT * FROM bamazon.products WHERE stock_quantity <5", true, exe())
        } else if (res.command == `Add to Inventory`) {
            console.log("add to inventory")
            readDb("SELECT * FROM bamazon.products", true, addToInventory())
        }
    });
}


async function addToInventory() {

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

function readDb(_query, logOut, callback) {

    if (isConnected) {
        connection.query(_query, (err, res) => {
            if (err) throw err;
            if (logOut) {
                console.log(`
            
-------------------Loading-------------------


            `)
                console.table(res)
                console.log(`
            




            `)
            }
            return res

        });
        callback // ? callback : false;

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
            addToDb(resProductInfo.departmentId, resProductInfo.productName, resProductInfo.productPrice, resProductInfo.productQuantity);
        }
    });
};


function addToDb(_depID, _productName, _productPrice, _productQuantity) {
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

                exe();
            }
        );

    }


};


function updateDb(_productID, _productQuantity) {
    // console.log(`will add ${depName} and ${costOverHead} to db`)

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

            }
        );

    }


};
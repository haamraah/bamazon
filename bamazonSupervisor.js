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
        choices: [`View inventory`, `View departments`, `Product Sales by Department`, `Create New Department`, `Quit`],
        name: "command"
    }]).then((res) => {
        if (res.command == `Create New Department`) {
            readDb("SELECT * FROM bamazon.departments", addDepartment());
        } else if (res.command == `Quit`) {
            connection ? connection.destroy() : false;
        } else if (res.command == `Product Sales by Department`) {
            readDb(`SELECT department_name ,SUM(product_sales) AS "sales by department",(SUM(product_sales)-departments.over_head_costs) AS "total_profit"
            FROM bamazon.departments
            INNER JOIN bamazon.products
            ON bamazon.departments.department_id = bamazon.products.department_id
            GROUP BY department_name;`, exe())
        } else if (res.command == `View departments`) {
            readDb("SELECT * FROM bamazon.departments", exe())
        } else if (res.command == `View inventory`) {
            readDb("SELECT item_id,product_name,department_name,departments.department_id,price,stock_quantity,product_sales FROM bamazon.products  INNER JOIN bamazon.departments ON bamazon.departments.department_id = bamazon.products.department_id", exe())
        }
    });
}


function addDepartment() {
    console.log(`

-------- ADD DEPARTMENT --------




  `);
    inquirer.prompt([{
        type: "input",
        message: `department name? (* to main menu)`,
        name: "depName"
    }]).then((resDepName) => {
        if (resDepName.depName == "*") {
            exe();
        } else if (resDepName.depName == "" || resDepName.depName == null || resDepName.depName.length > 99 || resDepName.depName.length < 3) {
            console.log(`

-------- invalid department name--------
  ( more than 3 and less than 100 characters)
  
  `);
            addDepartment();
        } else {
            inquirer.prompt([{
                type: "number",
                message: `cost over head? ( empty to go back)`,
                name: "costOverHead"
            }]).then((resCOH) => {
                if (isNaN(resCOH.costOverHead)) {
                    console.log(`

-------- invalid cost over head--------
  (not null , must be numbre)
  
  `);
                    addDepartment();

                } else {
                    console.log("update db");
                    addToDb(resDepName.depName, resCOH.costOverHead, exe())
                }
            });
        }
    });
};
function readDb(_query, callback) {
    if (isConnected) {
        connection.query(_query, (err, res) => {
            if (err) throw err;
            console.log(`
            
-------------------loading table-------------------


            `)
            console.table(res)
            console.log(`
            




            `)
            callback
            return res

        });

    }
}

function addToDb(depName, costOverHead, callback) {
    // console.log(`will add ${depName} and ${costOverHead} to db`)

    if (isConnected) {
        console.log(`
        Inserting a new department......

        `);
        connection.query(
            "INSERT INTO departments SET ?", {
                department_name: depName,
                over_head_costs: costOverHead
            },
            function (err, res) {
                if (err) throw err;
                console.log(`
                
                department ${depName}  inserted!
                
                `);

                callback
            }
        );

    }


};
var inquirer = require("inquirer");
var _table = require("table");
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
});
exe();

function exe() {
    inquirer.prompt([{
        type: "list",
        choices: [`see inventory`, `see departments`, `Product Sales by Department`, `add depatment`, `Quit`],
        name: "command"
    }]).then((res) => {
        if (res.command == `add depatment`) {
            readDb("SELECT * FROM bamazon.departments", addDepartment());
        } else if (res.command == `Quit`) {
            connection ? connection.destroy() : false;
        } else if (res.command == `Product Sales by Department`) {
            connection ? connection.destroy() : false;
        } else if (res.command == `see departments`) {
            readDb("SELECT * FROM bamazon.departments", exe())
        } else if (res.command == `see inventory`) {
            readDb("SELECT * FROM bamazon.products", exe())
        }
    });
}

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
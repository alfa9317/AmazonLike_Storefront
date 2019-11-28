require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: process.env.MYSQL_PASSWORD,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayProducts();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("\nProducts available:\n")
    for(var i = 0; i<res.length; i++){
        console.log(`
        ID: ${res[i].item_id}\n
        Product Name: ${res[i].product_name}\n
        Department: ${res[i].department_name}\n
        Price: $${res[i].price}\n
        Stock quantity: ${res[i].stock_quantity}\n\n`)
    }
    console.log("---------------------------------------\n");
    start();
  });
}

function start(){
    console.log("\nWelcome to Bamazon 👾\n")
    inquirer.prompt(
        {
            name: "item",
            type: "list",
            message: "What would you like to do?",
            choices: ["Buy something", "Exit"]  
        }
    ).then(function(answer){
        if(answer.item === "Buy something"){
            buy();
        }else{
            console.log("\nOk then... Bye bye! 👾\n")
            connection.end();
        }
    });
}

function buy(){
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Could you give me the id of the product you would like to buy?",
            validate: function( value ) {
                var pass = Number.isInteger(Number(value));
                if (pass) {
                  return true;
                } else {
                  return "Please enter a valid input";
                }
            }
        },
        {
            name: "unitsNum",
            type: "input",
            message: "How many units would you like to buy?",
            validate: function( value ) {
                var pass = Number.isInteger(Number(value));
                if (pass) {
                  return true;
                } else {
                  return "Please enter a valid input";
                }
            }
        }
    ]).then(function(answer){
        connection.query(`SELECT * FROM products WHERE item_id=${answer.id};`, function(err, res) {
            if (err) throw err;
            if(res[0].stock_quantity>=answer.unitsNum){
                connection.query(`UPDATE products SET stock_quantity=${res[0].stock_quantity-answer.unitsNum} WHERE item_id=${answer.id}`,(err,res2)=>{
                    if (err) throw err;
                    console.log(`\nThanks for you purchase! You order is already on its way ✈️\nTotal cost: $${res[0].price * answer.unitsNum}\n`);
                    start();
                })
            }else{
                console.log(`\n\nOops... Sorry! We just have ${res[0].stock_quantity} pieces of that product. Try again 🖥\n`)
                start();
            }
        });
         
    });
}



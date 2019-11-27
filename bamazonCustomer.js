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
    console.log("---------------------------------------")
    connection.end();
  });
}

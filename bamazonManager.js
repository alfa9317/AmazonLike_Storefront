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
  start();
});

function start(){
    console.log("\n\nWelcome Manager! 👾\n")
    inquirer.prompt({
        name: "item",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit"]
    }).then(function(answer){
        switch(answer.item){
            case "View Products for Sale":
                displayProductsForSale() 
                break;
            case "View Low Inventory":
                displayLowInventory()
                break;
            case "Add to Inventory":
                addToInventory()
                break;
            case "Add New Product":
                addNewProduct()
                break;
            case "Exit":
                console.log("\nOk then... Bye bye 👾\n")
                connection.end();
                break;
            default:
                connection.end();
                break; 
        }
    });
};

function displayProductsForSale(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\nProducts available for sale:\n")
        for(var i = 0; i<res.length; i++){
            console.log(`
            ID: ${res[i].item_id}
            Product Name: ${res[i].product_name}
            Department: ${res[i].department_name}
            Price: $${res[i].price}
            Stock quantity: ${res[i].stock_quantity}\n\n`)
        }
        console.log("---------------------------------------\n");
        start();
    });
}

function displayLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.log("\nProducts with low inventory:\n")
        for(var i = 0; i<res.length; i++){
            console.log(`
            ID: ${res[i].item_id}
            Product Name: ${res[i].product_name}
            Department: ${res[i].department_name}
            Price: $${res[i].price}
            Stock quantity: ${res[i].stock_quantity}\n\n`)
        }
        console.log("---------------------------------------\n");
        start();
    });
}

function addToInventory(){
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Please give the product's id:",
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
            name: "item2",
            type: "input",
            message: "How many items of that product would you like to add?:",
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
        connection.query(`UPDATE products SET stock_quantity=stock_quantity+${answer.item2} WHERE item_id=${answer.item}`, function(err, res) {
            if (err) throw err;
            console.log(`\nThe stock quantity of your product with id #${answer.item} has been updated!\n`);
            start();
        });    
    });
}

function addNewProduct(){
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Give me the product's name:"
        },
        {
            name: "department",
            type: "list",
            message: "Select a product's department",
            choices: ["Arts and Crafts","Automotive","Baby","Beauty and Personal Care","Books","Computers","Electronics","Women's Fashion","Men's Fashion","Girls' Fashion","Boys' Fashion","Deals","Health and House Hold","Home and Kitchen","Industrial and Scientific","Luggage","Movies and TV","Music, CDs and Vinyl","Pet Supplies","Software","Sports and Outdoors","Tools and Home Improvement","Toys and Games","Video Games"]
        },
        {
            name: "price",
            type: "number",
            message: "Type the product's price:"
        },
        {
            name: "quantity",
            type: "input",
            message: "Type the initial stock quantity",
            validate: function( value ) {
                var pass = Number.isInteger(Number(value));
                if (pass) {
                  return true;
                } else {
                  return "Please enter a valid input";
                }
            }
        },
        
    ]).then(function(answer){
        var price = (answer.price).toFixed(2);
        inquirer.prompt(
            {
                name: "confirmation",
                type: "confirm",
                message: `\nIs this ok? \nName: ${answer.name}\nDepartment: ${answer.department}\nPrice: $${price}\nStock Quantity: ${answer.quantity}\n`
            }
        ).then(function(answer2){
            if(answer2.confirmation){
                connection.query(`INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ('${answer.name}','${answer.department}',${price},${answer.quantity})`, function(err, res) {
                    if (err) throw err;
                    console.log(`\nYour product has been successfully added to the list!\n`);
                    start();
                });
            }else{
                console.log("\nOK\n")
                start();
            }
        })
    });
}
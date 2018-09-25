
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\n");
    console.log("Welcome to Bamazon !");
    console.log("____________________");
    console.log("\n");
    startShopping();
});




    function startShopping() {
        connection.query("SELECT * FROM products WHERE id", function (err, res) {

            for (var i = 0; i < res.length; i++) {
                console.log("Item # " + res[i].id + " *** " + res[i].name + " *** " + "$" + res[i].price);
                console.log("------------------------------------------------------------");
            }
            itemSelect();
        });
       
    }

    var pickedItemId = [];
    var storeStock = [];
    var unitsWanted = [];
    var price = [];


    // FUNCTION TO KNOW WHICH ITEM WAS PICKED

    function itemSelect() {
        inquirer.prompt([{
            name: "picker",
            message: "Hello Bamazon Customer! Please select item # that you would like to buy.",
            type: "input"
        }]).then(function (data) {

            connection.query("SELECT * FROM products WHERE id =" + data.picker, function (err, res) {

                pickedItemId.push(data.picker);
                storeStock.push(res[0].stock);
                price.push(res[0].price);
            });
            quantityTotal();
        });
    }
    // HOW MANY DOES THE CUSTOMER WANT
    function quantityTotal() {
        inquirer.prompt([{
            name: "howMany",
            message: "How many pieces?",
            type: "input",
        }]).then(function (dataTwo) {
            connection.query("SELECT * FROM products WHERE stock =" + dataTwo.howMany, function (err, res) {
                unitsWanted.push(dataTwo.howMany);
                if (parseInt(unitsWanted) > parseInt(storeStock[0])) {
                    console.log("Oops! We do not have enough in stock. Please modify quantity.");
                    console.log("We only have " + storeStock[0] + " of this item.");
                }
                else {
                    totalAll();

                }
            })
        });
    }
    // TOTAL PURCHASED AND UPDATING STOCKS
    function totalAll() {
        var itemsLeft = parseInt(storeStock[0]) - parseInt(unitsWanted[0]);
        connection.query("UPDATE products SET stock =" + itemsLeft + "WHERE ? " + { id: 0 }, function (err, res) {
            var finalTotal = parseInt(price[0]) * parseInt(unitsWanted[0]);
            console.log("YOUR ORDER HAS BEEN FULFILLED! *** TOTAL PURCHASED: $" + finalTotal);
            console.log("We have " + itemsLeft + " units left for this item after your purchase.");
        })
    }

/*
README: items in cart are stored in a matrix format. Each row is a array of item selected and its details and column is the specified
detail of the item. Column number index is shown below

cartArray index legend

index 0 = quanity of item
index 1 = name of item
index 2 = add on option 1
index 3 = add on option 2
index 4 = special instruction for item
index 5 = price of item (item price x qty)
*/

class Cart {
    constructor() {
        this.cartArray = [];
    }

    cartArrayLength() { //shows length of this.cartArray
        return this.cartArray.length;
    }

    totalAmt() {
        var total = 0;
        for (var i=0; i<this.cartArray.length; i++) {
            total += this.cartArray[i][5];
        }
        return total
    }

    pushCart(itemDetailsArray) { //pushes item and its customizations to the cart
        this.cartArray.push(itemDetailsArray);
    }

    printCart() { //prints all items that are added to cart
        console.log("\n==================================================================================================");
        console.log("Your Cart: \n");
        for (var i=0; i < this.cartArray.length; i++) 
            console.log( (i+1)+": " +this.cartArray[i][0] +" x "+ this.cartArray[i][1]+" "+this.cartArray[i][2]+ this.cartArray[i][3] +" - "+this.cartArray[i][4]+" ($"+this.cartArray[i][5]+")");
        console.log("\n==================================================================================================");
    }
    
    itemRemove() { //lets user remove item from cart
        do {
            var input = require('readline-sync');
            console.log("\n\t\tSelect item to remove:");
    
            for (var i=0; i < this.cartArray.length; i++) 
                console.log("\t\t " + (i+1)+": " +this.cartArray[i][0] +" x "+ this.cartArray[i][1]+" "+this.cartArray[i][2]+ this.cartArray[i][3] +" - "+this.cartArray[i][4]+" ($"+this.cartArray[i][5]+")");
                
            console.log("\t\t 0: Back to Cart");
            var option = input.questionInt(">>>>>");

            if (option < 0 || option > i)
                console.log("Invalid input entered. Please try again");
        } while (option < 0 || option > i)

        if (option != 0) {
            --option;
            console.log("\t\tRemoved: " + this.cartArray[option][0] +" x "+ this.cartArray[option][1]+" "+this.cartArray[option][2]+ this.cartArray[option][3] +" - "+this.cartArray[option][4]+" ($"+this.cartArray[option][5]+")");
            this.cartArray.splice(option, 1);
        }
    }

    orderReceipt() { //prints order receipt and removes all items in cart
        var txt = "\n========================================================================================"
        txt += "\nOrder Number: " + Math.floor(100000 + Math.random() * 100000 );
        txt +="\n\nItems:";

        for (var i=0; i < this.cartArray.length; i++) 
            txt += "\n\t"+ (i+1)+": " +this.cartArray[i][0] +" x "+ this.cartArray[i][1]+" "+this.cartArray[i][2]+ this.cartArray[i][3] +" - "+this.cartArray[i][4]+" ($"+this.cartArray[i][5]+")";

        return txt;
    }
}


module.exports = Cart;




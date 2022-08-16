class Food { //new class to create food objects 
    constructor (gid, uid, name, price) {
        this.gid = gid; //gid = Group Identification Number > gid is the number allocated to the item category. It corresponds with the option number of the category
        this.uid = uid; //uid = Unique Identification Number > uid is the array number of the item in foodArray
        this.name = name;
        this.price = price;
    }

}

/*Legend:
gid = 1 = rice items
gid = 2 = noodle items
gid = 3 = seafood items
*/

//Array for each category of food item
class FoodItems {
    constructor() {
        this.foodArray = [
            //rice items
            new Food(1, 0, "R01 Salted Egg Yolk Chicken Rice", 6.00),
            new Food(1, 1, "R02 Salted Egg Prawn Rice", 7.50),
            new Food(1, 2, "R03 Sweet and Sour Pork Rice", 5.00),
        
            //noodle items
            new Food(2, 3, "N01 Hokkien Mee", 6.00),
            new Food(2, 4,"N02 Chicken Hor Fun", 5.50),
            new Food(2, 5,"N03 Yummy Prawn Mee", 7.00),
        
            //drinks
            new Food(3, 6,"D01 Sugarcane Juice", 1.30),
            new Food(3, 7,"D02 Bandung", 1.40),
            new Food(3, 8,"D03 Teh Tarik", 1.50)
        ];
    }

    foodArrayLength() { //prints length of foodArray
        return this.foodArray.length;
    }

    foodDetails(uid) { //gets uid of food item which its also its array index in foodArray
        return this.foodArray[uid];
    }

    printFoodCategory(gid) { //uses gid to print out a category of food items
        var optionNumber = 0;
        var uidStorage = [];

        for (var i = 0; i < this.foodArray.length; i++) {
            if (gid == this.foodArray[i].gid) {
                ++optionNumber;
                console.log("\t\t " + optionNumber + ": " + this.foodArray[i].name + " ($" + this.foodArray[i].price + ")");
                uidStorage.push(this.foodArray[i].uid);
            }
        }

        return uidStorage;
    }
}

//use module.exports so that it can be used in CA2_main.js
module.exports = FoodItems;

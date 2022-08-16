//README: Explanations to what the functions do are below the main program


//main program
var input = require('readline-sync');
var fs = require('fs'); //import file system module included in node.js
var FoodItems = require('./CA2_food'); //import food array
var Cart = require('./CA2_cart'); //import Cart class
var PromoCodesArray = require('./CA2_promoCode'); //import PromoCodesArray class to use discount codes

var foodClass = new FoodItems;
var cartClass = new Cart;
var promotion = new PromoCodesArray;
var usedPromo = 0; //counts number of used promo codes by user. User can only use 1 promo code per order
var promoArrIndex; //to store array index of promotion code used if any promo code is used

do {
    var quit = 0;
    mainInterface();

    if (navigate == 1) { //runs view menu program if user chooses 1
        do {
            var exitFromMenu = 0;

            var categoryChoice = menuCategory();
            if (categoryChoice != 0) {
                var itemUID = itemSelection();
                var addOnArr = addOn();
                var qty = askQty();
                var specialInstruction = instruction();
                var confirmation = confirmAddToCart();
                addToCart(); //only runs when confirmation == 1
            }

        } while (exitFromMenu == 1)
    }

    if (navigate == 2) { //runs view cart program if user chooses 2
        do {
            var total = cartClass.totalAmt();
            if (usedPromo == 1) {
                total *= promotion.offerRate(promoArrIndex);
            }
            var exitFromCart = 1;
            var navigateCart = cartOptions(); 

            switch (navigateCart) {
                case 1: //runs when user wants to check out with their items
                    var checkoutStatus = checkOut();
                    var orderStatus = finalConfirmOrder(checkoutStatus);
                    if (orderStatus == 1) { // orderStatus = 1 means that order is comfirmed and everything in cart will be reset
                        exitFromCart = 0;
                        cartClass.cartArray.splice(0, cartClass.cartArray.length);
                        total = 0;
                        usedPromo = 0;
                    }
                    break;

                case 2: //runs when the user wants to remove an item from the cart
                    cartClass.itemRemove();
                    break;

                case 3: //runs when user wants to enter or remove promo code
                    promoCodeFunction();
                    break;
                
                case 0:
                    exitFromCart = 0;
            }

        } while (exitFromCart == 1);
    }

} while (quit != 1)




//functions for main program
function inputChecker(value, min, max) { //checks for invalid input
    if (value < min || value > max)
        console.log("Invalid input entered. Please try again");
}

function mainInterface() { //Starting interface when program first runs, can exit from program here
    do {
        navigate = input.questionInt("\nWelcome to NiceMeal Restaurant \n 1: View Menu \n 2: View Cart \n 0: Exit \n>>>>>");
        inputChecker(navigate, 0, 2);
    } while (navigate < 0 || navigate > 2)

    if (navigate == 0) {
        var quitComfirm = input.question("\nPress 1 to quit or any key to go back \n>>>>>");

        if (quitComfirm == 1) {
            console.log("\nExiting... Thank you for using our delivery app!");
            quit = 1;
        }
    }
}


//functions for menu
function menuCategory() { //Menu category to let user choose food category
    do {
        option = input.questionInt("\n\tSelect Category \n\t 1: Rice \n\t 2: Noodles \n\t 3: Drinks \n\t 0: Back \n>>>>>");
        inputChecker(option, 0, 3);
    } while (option < 0 || option > 3)

    return option;
}

function itemSelection() { //For user to select their desired item from the category they have chosen
    do {
        console.log("\n\t\tSelect Item")

        uidStore = foodClass.printFoodCategory(categoryChoice);

        console.log("\t\t 0: Back to Home");
        var option = input.questionInt(">>>>>");

        inputChecker(option, 0, uidStore.length)
    } while (option < 0 || option > uidStore.length)

    if (option == 0)
        return -1;
    else 
        return uidStore[--option];
}

function addOn() { //Ask if customer wants green chilli (not applicable for seafood)
    var addOnArray = [];

    if (itemUID == -1)
        return 0;

    if (categoryChoice != 3) {
        do {
            var option = input.questionInt("\n\t\t\tSelect an option \n\t\t\t 1: Green Chilli \n\t\t\t 2: No Green Chilli \n\t\t\t 0: Back to Home\n>>>>>");
            inputChecker(option, 0, 2)
        } while (option < 0 || option > 2)

        switch (option) {
            case 1:
                addOnArray.push("+ Green Chilli");
                break;
            case 2:
                addOnArray.push("+ No Green Chilli");
                break;
            case 0:
                return 0;
        }

        if (categoryChoice == 2) {
            do {
                var option = input.questionInt("\n\t\t\tSelect an option \n\t\t\t 1: Add Egg \n\t\t\t 2: No Egg \n\t\t\t 0: Back to Home\n>>>>>");
                inputChecker(option, 0, 2)
            } while (option < 0 || option > 2)
    
            switch (option) {
                case 1:
                    addOnArray.push(" + Egg");
                    return addOnArray;
                case 2:
                    addOnArray.push(" + No Egg");
                    return addOnArray;
                case 0:
                    return 0;
            }
        }

        else {
            addOnArray.push("");
            return addOnArray;
        }
    }

    else {
        addOnArray.push("", "");
        return addOnArray;
    }
}

function askQty() { //For user to enter desired quantity of selected item
    if (addOnArr == 0) 
        return 0;
    else {
        do {
            qtyInput = input.questionInt("\n\t\t\tEnter Quantity: \n>>>>>");
            if (qtyInput <= 0) {
                console.log("Invalid input entered. Please try again");
            }
        } while (qtyInput <= 0)
    
        return qtyInput;
    }
}

function instruction() { //Ask if customer has any special instructions
    if (qty == 0)
        return 0;
    else {
        do {
            var option = input.questionInt("\n\t\t\tAny Additional Instructions? \n\t\t\t 1: Yes \n\t\t\t 2: No \n\t\t\t 0: Back to Home\n>>>>>");
            inputChecker(option, 0, 2);
        } while (option < 0 || option > 2)
    
        switch (option) {
            case 1:
                return input.question("\n\t\t\tEnter Instruction or press Enter to continue \n>>>>>")
            case 2:
                return "";
            case 0:
                return 0;
        }
    }
}

function confirmAddToCart() { //Ask user to comfirm if they want to add their item to cart
    if (specialInstruction === 0)
        return 0;
    else {
        var price = qty * foodClass.foodDetails(itemUID).price //calcuate price using item price * quantity

        console.log("\n==================================================================================================\nYou have selected:");
        console.log(qty+ " x " +foodClass.foodDetails(itemUID).name+ " " + addOnArr[0]+addOnArr[1] + " - " +specialInstruction+" ($"+price+")");
        console.log("==================================================================================================")
    
        do {
            option = input.questionInt("\n\t\t\tAdd to Cart? \n\t\t\t 1: Yes \n\t\t\t 0: No (Back to Home) \n>>>>>");
            inputChecker(option, 0, 1);
        } while (option < 0 || option > 1)
    
        return option;
    }
}

function addToCart() { //add items to cart and prints out to user
    if (confirmation == 1) {
        var price = qty * foodClass.foodDetails(itemUID).price //calcuate price using item price * quantity
        var itemDetailsArr = [qty, foodClass.foodDetails(itemUID).name, addOnArr[0], addOnArr[1], specialInstruction, price];
        cartClass.pushCart(itemDetailsArr);

        console.log("\n==================================================================================================");
        console.log("Added to cart: " + qty +" x "+ foodClass.foodDetails(itemUID).name+" "+ addOnArr[0]+addOnArr[1] +" - "+specialInstruction+" ($"+price+")");
        console.log("==================================================================================================");

        //this is displayed to allow user to choose next step
        do {
            navigateMenu = input.questionInt("\n\t\t\t\tSelect an option \n\t\t\t\t 1: Continue Ordering \n\t\t\t\t 2: View Cart \n\t\t\t\t 3: Return to Home \n>>>>>");
            inputChecker(navigateMenu, 1, 3)
        } while (navigateMenu < 1 || navigateMenu > 3)
    
        switch (navigateMenu) {
            case 1:
                exitFromMenu = 1;
                break;
            case 2:
                navigate = 2;
                break;
            case 3:
                break;
        }
    }
}


//functions for cart
function cartOptions() { //shows items in cart and options to navigate the cart
    if (cartClass.cartArrayLength() == 0) {
        console.log("\nYour cart is empty!");
        return 0;
    }

    else {
        do {
            cartClass.printCart();
            console.log("Total: $" + total.toFixed(2));
            if (usedPromo == 1)
                console.log("Promo code applied: " + promotion.description(promoArrIndex));

            var option = input.questionInt("\n\tSelect an option \n\t 1: Check out \n\t 2: Remove item \n\t 3: Use/Remove Promo Code \n\t 0: Return to Home \n>>>>>");
            inputChecker(option, 0, 3);
        } while (option < 0 || option > 3)

        return option;
    }
}

function promoCodeFunction() { //Lets user use promo codes or remove promo codes that they applied
    var discountCode = input.question("Enter Promotion Code (Enter 0 to remove promo code): ");
    if (usedPromo == 0) {                    
        var promoIndex = promotion.checkPromo(discountCode);
        if (promoIndex != -1) { 
            usedPromo = 1; //changes usedPromo to 1, more promo codes cant be entered
            promoArrIndex = promoIndex;
        }
    }
    else if (usedPromo == 1 && discountCode == 0) { //if user enteres 0 promo code in use will be removed
        usedPromo = 0;
        console.log("\nPromotion code ("+ promotion.description(promoArrIndex) +") has been removed");
    }
    else 
        console.log("\nError: You can only use 1 promo code per order.");
}

function checkOut() { //lets user select payment method and check out with items chosen
    do {    
        var option = input.questionInt("\n\t\tSelect Payment Method \n\t\t 1: VISA \n\t\t 2: Mastercard \n\t\t 0: Back to Cart \n>>>>>");

        inputChecker(option, 0 , 3);
    } while (option < 0 || option > 3);

    if (option == 0)
        return 0; //so that finalConfirmOrder() will not run

    else { //visa or mastercard payment
        var visaRegEx = /^4/;
        var mastercardRegEx = /^5/;
    
        //lets user enter visa credit card details
        console.log("\n\t\t\tPlease enter the following details");
        var cardName = input.question("\t\t\t Card Name: ");
        var cardNum = input.questionInt("\t\t\t 16-digit Card Number (Omit dash and spacing): ");
        var cardCVV = input.questionInt("\t\t\t 3-digit CVV: ");
        var cardExpiry = input.questionInt("\t\t\t Card Expiry Date (MMYY): ");
        var cardPIN = input.questionInt("\t\t\t 6-digit PIN: ");
    
    
        //loop statements to check if any error in input and display error if needed

        //only if user selects payment by visa
        if (option == 1 && visaRegEx.test(cardNum) == false || cardNum.toString().length != 16) {
            console.log("\nError: Invalid VISA Card Number entered, Please try again");
            return 0;
        }

        // only if user selects payment by mastercard
        else if (option == 2 && mastercardRegEx.test(cardNum) == false || cardNum.toString().length != 16) {
            console.log("\nError: Invalid MasterCard Number entered, Please try again");
            return 0;
        }

        else if (cardCVV.toString().length != 3) {
            console.log("\nError: 3-digit CVV is not 3 digits, Please try again");
            return 0;
        }
            
        else if (cardExpiry.toString().length != 4) {
            console.log("\nError: Card expiry date is not 4-digits, Please try again");
            return 0;
        }
    
        else if (cardPIN.toString().length != 6) {
            console.log("\nError: PIN is not 6-digits, Please try again");
            return 0;
        }
    
        else { //this only runs if there is no error in all inputs
            txt = "\nYour card details have been approved!";
            txt += "\n Card Name: " + cardName;
            txt += "\n Card Number: " + cardNum;
            txt += "\n Card Expiry Date: " + cardExpiry;
            console.log(txt);
            return 1;
        }
    }
}

function finalConfirmOrder(checkoutStatus) { //Asks user for the last time if he wants to confirm order
    if (checkoutStatus == 1) {
        console.log("\nPlease enter the details below so that smooth delivery is ensured")
        var address = input.question(" Enter address (We will never collect your data): ");
        var doorNum = input.question(" Enter Door/Floor number (Press enter to skip if not applicable): ");
        do {
            var userPhone = input.questionInt(" Enter phone number: ");
            if (userPhone.toString().length != 8)
                console.log("\n Invalid phone number, please try again.");
        } while (userPhone.toString().length != 8)

        
        do {
            cartClass.printCart();
            console.log("\nTotal: $" + total.toFixed(2));
            if (usedPromo == 1)
                console.log("Promo code applied: " + promotion.description(promoArrIndex));

            var txt = "\n\tComfirm Order?";
            txt += "\n\t 1: Yes";
            txt += "\n\t 0: Cancel";
            console.log(txt);
            var option = input.questionInt(">>>>>")
    
            inputChecker(option, 0, 1);
        } while (option<0 || option>1)
    
        if (option == 1) { //runs only when user confirms order
            var txt = cartClass.orderReceipt();
            txt += "\nTotal: $" + total.toFixed(2);

            if (usedPromo == 1)
                txt += "\nPromo code applied: " + promotion.description(promoArrIndex);

            txt += "\n\nDeliver to: " + address;
            txt += "\nDoor/Floor Number: " + doorNum;
            txt += "\nPhone Number: " + userPhone;
            txt += "\n========================================================================================";

            //Below is code to append order details to CA2_receipt.txt
            fs.writeFile("CA2_receipt.txt", txt,{
                flag: 'a'
            }, (err) => { 
                console.log("Error: " + err)
            })

            //continuation of txt variable to print out on the terminal
            txt += "\n\nAn available delivery rider has been found! Preparing your order...\n";
            txt += "\nThank you for using our delivery app!";
            txt += "\n========================================================================================\n";
            console.log(txt);

            return 1;
        }
    }
}

class PromoCode {
    constructor(code, terms, discount) {
        this.code = code;
        this.terms = terms;
        this.discount = discount;
    }
}

class PromoCodesArray {
    constructor() {
        this.promoCodesArr = [ //promo codes are case sensitive
            new PromoCode("5off", "5% off total", 0.95),
            new PromoCode("10off", "10% off total", 0.9),
            new PromoCode("20Shiok", "20% off total", 0.80),
            new PromoCode("99Sale2021", "9% off total", 0.91)
        ]; 
    }

    offerRate(arrayIndex) { //returns the discount percentage the promo code will give
        return this.promoCodesArr[arrayIndex].discount;
    }

    description(arrayIndex) { //returns description of what the promo code does
        return this.promoCodesArr[arrayIndex].code + " - " + this.promoCodesArr[arrayIndex].terms;
    }

    checkPromo(promo) { //checks if user entered a valid promo code. If valid, promo code will be applied
        var checkThisPromo = promo.split(""); //splits every letter of the promo code into an array so that each letter would be checked

        for (var i = 0; i < this.promoCodesArr.length; i++) {
            var promoCode = this.promoCodesArr[i].code.split("");

            if (promoCode.length == checkThisPromo.length) { //checks if length of code user entered is equal to length of any valid code
                var correct = 0;

                for (var k = 0; k < promoCode.length; k++) { //checks each promo code letter by letter
                    if (promoCode[k] == checkThisPromo[k]) {
                        ++correct;
                    }
                }

                if (correct == promoCode.length) { //runs if every letter is correct when checked with a valid promo code
                    console.log("\nPromotion code successfully applied!");
                    console.log(this.promoCodesArr[i].code + " - " + this.promoCodesArr[i].terms);
                    var promoArrayNum = i;
                    i += this.promoCodesArr.length;
                    return promoArrayNum; //returns the array number of the valid promo code entered
                }
            }
        }
        console.log("\nInvalid promotion code entered.");
        return -1; //returns -1 if code entered is invalid
    }
}


module.exports = PromoCodesArray;

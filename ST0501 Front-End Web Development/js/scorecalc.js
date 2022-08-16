"use strict";

function calc() { // create calculator function 
    var score = parseFloat(document.getElementById("myText").value); //get input enetered using DOM

    // create array containing course and score for courses
    var courseArray = ["S30 Applied AI and Analytics (DAAA)", "S54 Infocomm Security Management (DISM)", "S32 Common Infocomm Technology Programme (CITP)", "S69 Information Technology (DIT)"];
    var scoreArray = ["3-9", "4-11", "5-12", "3-14"];
    var output = "";

    //loop statements to check for input of score entered by user and display appropriate output 
    if ( isNaN(score) || score - Math.floor(score) != 0 ) {
        var output = "<tr><td colspan=2 class='p-3'>Error: Please enter whole numbers only!</td></tr>";
    }

    else if (score < 3 || score > 45) {
        var output = "<tr><td colspan=2 class='p-3'>Invalid score entered!</td></tr>";
    }

    else if (score <= 9) {
        for (var i = 0; i < courseArray.length; i++) {
            output += "<tr>";
            output += "<td class='p-3'>" + courseArray[i] + "</td>";
            output += "<td class='p-3'>" + scoreArray[i] + "</td>";
            output += "</tr>";
        }
    }

    else if (score > 9 && score <= 11) {
        for (var i = 1; i < courseArray.length; i++) {
            output += "<tr>";
            output += "<td class='p-3'>" + courseArray[i] + "</td>";
            output += "<td class='p-3'>" + scoreArray[i] + "</td>";
            output += "</tr>";
        }
    }

    else if (score > 11 && score <= 12) {
        for (var i = 2; i < courseArray.length; i++) {
            output += "<tr>";
            output += "<td class='p-3'>" + courseArray[i] + "</td>";
            output += "<td class='p-3'>" + scoreArray[i] + "</td>";
            output += "</tr>";
        }
    }

    else if (score > 12 && score <= 14) {
        for (var i = 3; i < courseArray.length; i++) {
            output += "<tr>";
            output += "<td class='p-3'>" + courseArray[i] + "</td>";
            output += "<td class='p-3'>" + scoreArray[i] + "</td>";
            output += "</tr>";
        }
    }

    else {
        var output = "<tr><td colspan=2 class='p-3'>No courses in range of score entered.</td></tr>";
    }

    document.getElementById("result").innerHTML = output; //display output to website using DOM
}



/**
 * fills the income section with the streams from user account
 */
function loadIncome() {

    //Values
    const streams = account.streams;    //Data to show
    const incomeList = document.querySelector(".income-list");  //Where to show the data

    //Loop through streams
    for (let i = 0; i < streams.length; i++) {

        //Other variables
            //3 is the smallest a fincance object can be
        let streamLength = 3;

        //Main parts of a stream, the name and the data
        let category = document.createElement('button');
        let list = document.createElement('ul');

        let items = [document.createElement('li'),  //Amount
            document.createElement('li'),           //Next due date
            document.createElement('li'),           //End date
        ];
        //Data holds the actual values of each item
        let data = [document.createElement('span'),
            document.createElement('span'),
            document.createElement('span'),
        ];

        //Fill out category
        category.innerHTML = streams[i].text;
        category.classList.add("finance-category");

        items[0].innerHTML = "Amount: ";
        items[1].innerHTML = "Next Payday: ";
        items[2].innerHTML = "Goes until: ";
        
        data[0].innerHTML = "$" + addCommasToInt(streams[i].amount);
        data[1].innerHTML = prettyDate(new Date(streams[i].date));
        data[2].innerHTML = prettyDate(new Date(streams[i].endDate));

        //Recurrance data
            //If this stream recurs
        if (streams[i].recurrance.length > 0) {
            //Add new list item
            items.push(document.createElement('li'));
            data.push(document.createElement('span'));

            //Give it proper data
            items[3].innerHTML = "Recurrance: ";
            data[3].innerHTML = prettyRecurrance(streams[i].recurrance);

            //know now that stream length is 4, not 3
            streamLength = 4;

            //Hide new data
            items[3].classList.add('hidden');
        }

        //Hide list items that won't be shown until label clicked
        items[2].classList.add('hidden');

          //Shows extra data upon clicking label
        category.addEventListener('click', function() {
            if (streamLength >= 3) {
                items[2].classList.toggle('hidden')
            }
            if (streamLength == 4) {
                items[3].classList.toggle('hidden');
            }
        });
        
        //If there were a way to know how many values an object had i would do this differently
        for (let j = 0; j < streamLength; j++) {
            data[j].classList.add('income-text');
            items[j].appendChild(data[j]);
            list.appendChild(items[j]);
        }

        incomeList.appendChild(category);
        incomeList.appendChild(list);
    }
}

function loadExpense() {

    //Values
    const expenses = account.expenses;    //Data to show
    const expenseList = document.querySelector(".expense-list");  //Where to show the data

    //Loop through streams
    for (let i = 0; i < expenses.length; i++) {

        //Other variables
            //3 is the smallest a finance object can be
        let expenseLength = 3;

        //Main parts of a stream, the name and the data
        let category = document.createElement('button');
        let list = document.createElement('ul');

        let items = [document.createElement('li'),  //Amount
            document.createElement('li'),           //Next due date
            document.createElement('li'),           //End date
        ];
        //Data holds the actual values of each item
        let data = [document.createElement('span'),
            document.createElement('span'),
            document.createElement('span'),
        ];

        //Fill out category
        category.innerHTML = expenses[i].text;
        category.classList.add("finance-category");

        items[0].innerHTML = "Amount: ";
        items[1].innerHTML = "Next Due Date: ";
        items[2].innerHTML = "Goes until: ";
        
        data[0].innerHTML = "$" + addCommasToInt(expenses[i].amount);
        data[1].innerHTML = prettyDate(new Date(expenses[i].date));
        data[2].innerHTML = prettyDate(new Date(expenses[i].endDate));

        //Recurrance data
            //If this stream recurs
        if (expenses[i].recurrance.length > 0) {
            //Add new list item
            items.push(document.createElement('li'));
            data.push(document.createElement('span'));

            //Give it proper data
            items[3].innerHTML = "Recurrance: ";
            data[3].innerHTML = prettyRecurrance(expenses[i].recurrance);

            //know now that stream length is 4, not 3
            expenseLength = 4;

            //Hide new data
            items[3].classList.add('hidden');
        }

        //Hide list items that won't be shown until label clicked
        items[2].classList.add('hidden');

          //Shows extra data upon clicking label
        category.addEventListener('click', function() {
            if (expenseLength >= 3) {
                items[2].classList.toggle('hidden')
            }
            if (expenseLength == 4) {
                items[3].classList.toggle('hidden');
            }
        });
        
        //If there were a way to know how many values an object had i would do this differently
        for (let j = 0; j < expenseLength; j++) {
            data[j].classList.add('expense-text');
            items[j].appendChild(data[j]);
            list.appendChild(items[j]);
        }

        expenseList.appendChild(category);
        expenseList.appendChild(list);
    }
}

/**
 * 
 * @param {number} num 
 * @description converts a number to a position
 * e.g. 1 -> "1st", 2 -> "2nd" 3 -> "3rd", 4 -> "4th"
 */
function intToPosition(num) {

    let suffix = "";
    switch (num) {
        case 1: 
            suffix = "st";
            break;
        case 2:
            suffix = "nd";
            break;
        case 3:
            suffix = "rd";
            break;
        default:
            suffix = "th";
            break;
    }

    //Number.toString() takes base of number and number to convert
    return num.toString(10, num) + suffix;
}

/**
 * 
 * @param {number} num number to convert
 * @description returns the number num as a string with proper
 * commas (ex: 1000 -> "1,000")
 * sidenote: this function was so much more annoying than i expected lmao
 */
function addCommasToInt(num) {
    
    //Variables
    let strVer = num.toString();    //String version of number
    let returnStr = ""; //Return value (num w/ commas)
    let iterator = 0;   //Keep track of where in string we are
    let isDecimal = false;  //Is num a decimal number?
    let decimals = "";  //The decimal portion of num if isDecimal true

    //Stop running if bad input
    if (isNaN(num)) {
        return "Cannot parse number: Not a number";
    }
    else {
        //Basic testing
            //Is num a decimal?
        if (strVer.includes(".")) {
            decimals = strVer.split(".")[1];
            strVer = strVer.split(".")[0];
            isDecimal = true;
        }
        //https://masteringjs.io/tutorials/fundamentals/trim
        //Trims off leading 0's just in case
        if (strVer[0] == 0 && strVer != "0") {
            strVer = strVer.replace(/^0+/, '');
        }

        //Decides where the first comma would be
        //modulus 3 of the length returns correctly every time
        //unless divisible by 3, in which case it would return 0
        //when the real first comma would be 3
        let firstCommaPos = strVer.length % 3;
        if (firstCommaPos == 0 || strVer.length <= 3) {
            firstCommaPos = 3;
        }

        //Loop through string
        for (let i = 0; i < strVer.length; i++) {

            //Add comma if at comma spot
            if (i == firstCommaPos || iterator == 3) {
                returnStr += "," + strVer[i];
                iterator = 1;
            }
            else {
                returnStr += strVer[i];
                iterator++;
            }
        }

        //Append decimals if they are there
        if (isDecimal) {
            returnStr += "." + decimals;
        }

        return returnStr;
    }
}

/**
 * 
 * @param {Date} date 
 * @description Takes a date object and returns in form:
 * <name of month> <date><th/st/rd> <year>
 */
function prettyDate(date) {

    let months = ["January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    let day = intToPosition(date.getDate());

    let pretty = months[date.getMonth()] + " " + day + " " + date.getFullYear();
    return pretty;
}

/**
 * 
 * @param {Array} recurrance 
 * @description an array recurrance featuring rate of payment, an x, and optional y 
 * or y and weekday returned in a more readable form
 */
function prettyRecurrance(recurrance) {

    let rate = recurrance[0];
    let x = 0;
    let y = 0;
    let weekday = "";

    //Set x, y, and weekday based on length of recurrance
    if (recurrance.length > 0) {
        x = Number(recurrance[1]);
    }
    if (recurrance.length > 1) {
        y = Number(recurrance[2]);
    }
    if (recurrance.length > 2) {
        weekday = recurrance[3];
    }

    let prettyRate = "";

    //it may be possible to have day vs days without needing day(s)
    //but idk not a huge issue rn
    switch (rate) {
        case "daily":
            prettyRate = "Every X day(s)";
            prettyRate = prettyRate.replace("X", x);
            break;
        case "monthly":
            prettyRate = "Every X month(s)";
            prettyRate = prettyRate.replace("X", x);
            break;
        case "yearly":
            prettyRate = "Every X year(s)";
            prettyRate = prettyRate.replace("X", x);
            break;
        case "specificDay":
            prettyRate = "X day of every Y month(s)";
            prettyRate = prettyRate.replace("X",intToPosition(x));
            prettyRate = prettyRate.replace("Y", y);
            break;
        case "specificDayOfWeek":
            prettyRate = "X W of every Y month";
            prettyRate = prettyRate.replace("X", intToPosition(x));
            prettyRate = prettyRate.replace("Y", intToPosition(y));
            prettyRate = prettyRate.replace("W", weekday);
            break;
    }

    return prettyRate;
}


async function main() {
    await account.loadFromStorage();

    loadIncome();
    loadExpense();
}

main();
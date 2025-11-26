/**
 * fills the income section with the streams from user account
 */
function loadIncome() {

    //Values
    const streams = account.streams;    //Data to show
    const incomeListUpcoming = document.querySelector("#upcoming-income");  //Where to show the data
    const incomeListPast = document.querySelector("#past-income");

    let upcoming = false;
    let past = false;

    incomeUpcomingButton = document.querySelector("#upcoming-income-label");
    incomePastButton = document.querySelector("#past-income-label");

    //Loop through streams
    for (let i = 0; i < streams.length; i++) {

        //Other variables
            //3 is the smallest a fincance object can be
        let streamLength = 3;
            //new Date gets current date of user system
        let today = new Date();
            //JavaScript is really weird about date objects
        let trueNextDate = new Date(streams[i].date);
        let trueEndDate = new Date(streams[i].endDate);

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

        //If endDate is in past
        if (trueEndDate < today) {
            past = true;
        }
        else {
            upcoming = true;

            if (trueNextDate < today) {
                account.streams[i].date = updateDate(trueNextDate, account.recurrance);
            }
        }

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

        if (past) {
            incomeListPast.appendChild(category);
            incomeListPast.appendChild(list);
        }
        else if (upcoming) {
            incomeListUpcoming.appendChild(category);
            incomeListUpcoming.appendChild(list);
        }
    }

    //Hide empty labels
    if (incomeListUpcoming.innerHTML.trim().length == 0) {
        incomeUpcomingButton.classList.add('hidden')
    }
    if (incomeListPast.innerHTML.trim().length == 0) {
        incomePastButton.classList.add('hidden')
    }

}

//Takes a date and recurrance and returns boolean
function updateDate(date, recurrance) {
    
    let nextDate = new Date(date);

    weekdays = new Map()
    weekdays.set("Sunday", 0)
    weekdays.set("Monday", 1)
    weekdays.set("Tuesday", 2)
    weekdays.set("Wednesday", 3)
    weekdays.set("Thursday", 4)
    weekdays.set("Friday", 5)
    weekdays.set("Saturday", 6)

    //These are the simple ones, simply adding a certain amount of time to the last date
    if (recurrance[0] == "daily") {
        let days = Number(recurrance[1]);
        nextDate.setDate(date.getDate() + days);
    }
    else if (recurrance[0] == "monthly") {
        let months = Number(recurrance[1]);
        nextDate.setMonth(date.getMonth() + months);
    }
    else if (recurrance[0] == "yearly") {
        let years = Number(recurrance[1]);
        nextDate.setFullYear(date.getFullYear() + years);
    }

    //Specific day - every Xth day of every Yth month
    //Edge cases - X > 28 automatically sets to last day of month
    else if (recurrance[0] == "specificDay") {
        let days = Number(recurrance[1]);
        let months = Number(recurrance[2]);

        //Avoids issues with overflowing of months
        nextDate.setDate(1);

        //If more than the max amount of days of shortest month,
        //interpret as the last day of every month
        if (days > 28) {
            //setMonth is set to one month past desired month
            //This is because when setting date to the 0th of that
            //month, JS reads 0 as the last day of the previous month
            nextDate.setMonth(date.getMonth() + months + 1);
            nextDate.setDate(0);

            console.log("nextDate: " + nextDate);
        }
        else {
            nextDate.setMonth(date.getMonth() + months);
            nextDate.setDate(days);
        }
    }

    //SpecificDayOfWeek - The Xth W of Every Yth month where W is a day of the week
    else if (recurrance[0] == "specificDayOfWeek") {

        let days = Number(recurrance[1]);
        let months = Number(recurrance[2]);

        //Set at start of proper months
        nextDate.setMonth(date.getMonth() + months);
        nextDate.setDate(1);

        //Run while the nextDate's weekday is not the weekday needed
        while (nextDate.getDay() != weekdays.get(recurrance[4])) {
            nextDate.setDate(nextDate.getDate() + days);
        }

        for (let i = 1; i < days; i++) {
            nextDate.setDate(nextDate.getDate() + 7)
        }
    }

    return nextDate;
}

function loadExpense() {

    //Values
    const expenses = account.expenses;    //Data to show
    const expenseListUpcoming = document.querySelector("#upcoming-expenses");  //Where to show the data
    const expenseListPast = document.querySelector("#past-expenses");

    let upcoming = false;
    let past = false;

        expenseUpcomingButton = document.querySelector("#upcoming-expenses-label");
    expensePastButton = document.querySelector("#past-expenses-label");

    //Loop through streams
    for (let i = 0; i < expenses.length; i++) {

        //Other variables
            //3 is the smallest a finance object can be
        let expenseLength = 3;
                    //new Date gets current date of user system
        let today = new Date();
            //JavaScript is really weird about date objects
        let trueNextDate = new Date(expenses[i].date);
        let trueEndDate = new Date(expenses[i].endDate);

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

        //If endDate is in past
        if (trueEndDate < today) {
            past = true;
        }
        else {
            upcoming = true;

            if (trueNextDate < today) {
                account.expenses[i].date = updateDate(trueNextDate, account.recurrance);
            }
        }

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

        if (past) {
            expenseListPast.appendChild(category);
            expenseListPast.appendChild(list);
        }
        else if (upcoming) {
            expenseListUpcoming.appendChild(category);
            expenseListUpcoming.appendChild(list);
        } 
    }

    //Hide empty labels
    if (expenseListUpcoming.innerHTML.trim().length == 0) {
        expenseUpcomingButton.classList.add('hidden')
    }
    if (expenseListPast.innerHTML.trim().length == 0) {
        expensePastButton.classList.add('hidden')
    }
}

/**
 * 
 * @param {number} num 
 * @description converts a number to a position
 * e.g. 1 -> "1st", 2 -> "2nd" 3 -> "3rd", 4 -> "4th"
 */
function intToPosition(num) {

    //Gets the last two digits of a number
    let lastDigit = num % 10;
    let secondToLastDigit = Math.floor(num / 10) % 10
    let neededDigits = (secondToLastDigit * 10) + lastDigit;

    let suffix = "";

    //Brute force but we ball
    if (lastDigit == 1 && neededDigits != 11) {
        suffix = "st";
    }
    else if (lastDigit == 2 && neededDigits != 12) {
        suffix = "nd";
    }
    else if (lastDigit == 3 && neededDigits != 13) {
        suffix = "rd";
    }
    else {
        suffix = "th";
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

    //date.getMonth will return number matching index of name
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

    //day of month as a position
    let day = intToPosition(date.getDate());

    //Month + day + year
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

/**
 * @description Makes a graph based on the account's unallocated income and expenses. Ignores income that was set aside of a distribution.
 * dude why is the function this massive it is LITERALLY just a GRAPH
 */
function makeGraph()
{
    let totalIncome = [];
    let incomeSum = 0;
    let totalExpenses = [];
    let expenseSum = 0;
    let distributed = 0;
    const incomeArray = account.streams;
    const expenseArray = account.expenses;
    const dists = account.distributions;
    let today = new Date();

    days = new Map()
    days.set("Sunday", 0)
    days.set("Monday", 1)
    days.set("Tuesday", 2)
    days.set("Wednesday", 3)
    days.set("Thursday", 4)
    days.set("Friday", 5)
    days.set("Saturday", 6)

    // Get a month ago as a date
    let lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Get percentage of distribution
    for (let i = 0; i < dists.length; i++)
    {
        distributed += Number(dists[i][1]);
    }
    distributed = 1 - distributed/100;

    // Get relevant income objects
    for (let i = 0; i < incomeArray.length; i++)
    {
        if (incomeArray[i].recurrance.length == 0)
        {
            if (new Date(incomeArray[i].date) > lastMonth && new Date(incomeArray[i].date) <= today)
            {
                totalIncome.push(incomeArray[i]);
                temp = Number(incomeArray[i].amount);
                incomeSum += temp * distributed
            }
        }

        else // i hate recurrance
        {
            var inScope = true
            var tempDate = new Date(incomeArray[i].date)

            while (inScope)
            {
                if (tempDate > lastMonth && tempDate <= today)
                {
                    totalIncome.push(incomeArray[i]);
                    temp = Number(incomeArray[i].amount);
                    incomeSum += temp * distributed
                }
                else if (tempDate > today)
                {
                    inScope = false;
                    break;
                }

                switch(incomeArray[i].recurrance[0])
                {
                    case "daily":
                        tempDate.setDate(tempDate.getDate() + Number(incomeArray[i].recurrance[1]))
                        break;
                    case "monthly":
                        tempDate.setMonth(tempDate.getMonth() + Number(incomeArray[i].recurrance[1]))
                        break;
                    case "yearly":
                        tempDate.setFullYear(tempDate.getFullYear() + Number(incomeArray[i].recurrance[1]))
                        break;
                    case "specificDay":
                        tempDate.setMonth(tempDate.getMonth() + Number(incomeArray[i].recurrance[2]))
                        tempDate.setDate(Number(incomeArray[i].recurrance[1]))
                        break;
                    case "specificDayOfWeek":
                        tempDate.setMonth(tempDate.getMonth() + Number(incomeArray[i].recurrance[2])) // Go to correct month to start at (last one + 1)
                        tempDate.setDate(1) // Go to the first day of the month
                        
                        while (tempDate.getDay() != days.get(incomeArray[i].recurrance[4])) // Add until we get to the first specified weekday of that month
                        {
                            tempDate.setDate(tempDate.getDate() + Number(incomeArray[i].recurrance[1]))
                        }

                        for (let i = 1; i < incomeArray[i].recurrance[1]; i++) // Move to correct month
                        {
                            tempDate.setDate(tempDate.getDate() + 7)
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // Get relevant expense objects
    for (let i = 0; i < expenseArray.length; i++)
    {
        if (expenseArray[i].recurrance.length == 0)
        {
            if (new Date(expenseArray[i].date) > lastMonth && new Date(expenseArray[i].date) <= today)
            {
                totalExpenses.push(expenseArray[i]);
                expenseSum += Number(expenseArray[i].amount);
            }
        }

        else // i hate recurrance
        {
            var inScope = true
            var tempDate = new Date(expenseArray[i].date)

            while (inScope)
            {
                if (tempDate > lastMonth && tempDate <= today)
                {
                    totalExpenses.push(expenseArray[i]);
                    expenseSum += Number(expenseArray[i].amount);
                }
                else if (tempDate > today)
                {
                    inScope = false;
                    break;
                }

                switch(expenseArray[i].recurrance[0])
                {
                    case "daily":
                        tempDate.setDate(tempDate.getDate() + Number(expenseArray[i].recurrance[1]))
                        break;
                    case "monthly":
                        tempDate.setMonth(tempDate.getMonth() + Number(expenseArray[i].recurrance[1]))
                        break;
                    case "yearly":
                        tempDate.setFullYear(tempDate.getFullYear() + Number(expenseArray[i].recurrance[1]))
                        break;
                    case "specificDay":
                        tempDate.setMonth(tempDate.getMonth() + Number(expenseArray[i].recurrance[2]))
                        tempDate.setDate(Number(expenseArray[i].recurrance[1]))
                        break;
                    case "specificDayOfWeek":
                        tempDate.setMonth(tempDate.getMonth() + Number(expenseArray[i].recurrance[2])) // Go to correct month to start at (last one + 1)
                        tempDate.setDate(1) // Go to the first day of the month
                        
                        while (tempDate.getDay() != days.get(expenseArray[i].recurrance[4])) // Add until we get to the first specified weekday of that month
                        {
                            tempDate.setDate(tempDate.getDate() + Number(expenseArray[i].recurrance[1]))
                        }

                        for (let i = 1; i < expenseArray[i].recurrance[1]; i++) // Move to correct month
                        {
                            tempDate.setDate(tempDate.getDate() + 7)
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    let netBalance = incomeSum - expenseSum;

    // Constrcut Graph
    let graphTitle = "PANIC PANIC PANIC"
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Transaction');
    data.addColumn('number', 'Amount');
    
    if (netBalance > 0)
    {
        data.addRow(["Unallocated Income", netBalance]);
        graphTitle = "good for now..."
    }

    for (let i = 0; i < totalExpenses.length; i++)
    {   
        let tempRow = [totalExpenses[i].text, Number(totalExpenses[i].amount)]
        let dupes = 0
        
        for (let j = i+1; j < totalExpenses.length; j++)
        {
            let tempRow2 = [totalExpenses[j].text, Number(totalExpenses[j].amount)]
            if (tempRow[0] == tempRow2[0] && tempRow[1] == tempRow2[1])
            {
                dupes += 1
                i += 1
            }
        }

        let tempAmount = tempRow[1];
        for (let i = 0; i < dupes; i++)
        {
            tempRow[1] += tempAmount;
        }

        data.addRow(tempRow);
    }

    var chartArea = document.getElementById('chart_div');
    document.getElementById('chart-title').innerHTML = `<p class="cool-title" >${graphTitle}</p>`;
    var options = {
        'width': chartArea.width,
        'height': chartArea.height,
        'legend': {
            position: 'labeled',
            textStyle: {color: 'white', fontSize: 16}
        },
        'pieSliceText': 'value',
        'backgroundColor': "#212121"
        };
    
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

//main logic
async function main() {

    await account.loadFromStorage();
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(makeGraph);

    //Elements
    incomeUpcomingButton = document.querySelector("#upcoming-income-label");
    incomePastButton = document.querySelector("#past-income-label");
    expenseUpcomingButton = document.querySelector("#upcoming-expenses-label");
    expensePastButton = document.querySelector("#past-expenses-label");

    incomeUpcomingList = document.querySelector("#upcoming-income");
    incomePastList = document.querySelector("#past-income");
    expenseUpcomingList = document.querySelector("#upcoming-expenses");
    expensePastList = document.querySelector("#past-expenses");

    loadIncome();
    loadExpense();

    //Hides or shows upcoming/past income/expenses
    incomeUpcomingButton.addEventListener('click', function() {
        if (incomeUpcomingList.classList.contains('hidden')) {
            incomeUpcomingList.classList.remove('hidden');
        }
        else {
            incomeUpcomingList.classList.add('hidden');
        }
    })
    incomePastButton.addEventListener('click', function() {
        if (incomePastList.classList.contains('hidden')) {
            incomePastList.classList.remove('hidden');
        }
        else {
            incomePastList.classList.add('hidden');
        }
    })
    expenseUpcomingButton.addEventListener('click', function() {
        if (expenseUpcomingList.classList.contains('hidden')) {
            expenseUpcomingList.classList.remove('hidden');
        }
        else {
            expenseUpcomingList.classList.add('hidden');
        }
    })
    expensePastButton.addEventListener('click', function() {
        if (expensePastList.classList.contains('hidden')) {
            expensePastList.classList.remove('hidden');
        }
        else {
            expensePastList.classList.add('hidden');
        }
    })
    
}

main();
/**
 * I'm just using this to test certain functions in the terminal
 */


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

    return num.toString(10, num) + suffix;
}

/**
 * 
 * @param {Array} recurrance 
 * @description an array recurrance featuring rate of payment, an x, and optional y returned
 * in a more readable form
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

console.log(prettyRecurrance(["daily", "1"]));
console.log(prettyRecurrance(["monthly", "2"]));
console.log(prettyRecurrance(["yearly", "3"]));
console.log(prettyRecurrance(["specificDay", "4", "5"]));
console.log(prettyRecurrance(["specificDayOfWeek", "1", "3", "Wednesday"]));

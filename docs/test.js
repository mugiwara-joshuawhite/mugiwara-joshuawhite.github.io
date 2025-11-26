//Takes a date object and recurrance array and returns boolean
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

lastFriday = new Date("2025/11/21");
everyFriday = ["daily", "7"];

lastMonth = new Date("2025/11/01");
everyMonth = ["monthly", "1"];

lastYear = new Date("2024/01/01");
everyTwoYears = ["yearly", "2"];

newYears2024 = new Date("2024/12/31");
lastDayOf5Months = ["specificDay", "29", "5"];

nextWednesday = new Date("2025/11/26");
everyThirdWednesday = new Date("specificDayOfWeek", "3", "1", "Wednesday");

newDate1 = updateDate(lastFriday, everyFriday);    //Expected 2025/11/28
console.log(newDate1);

newDate2 = updateDate(lastMonth, everyMonth);   //Expected 2025/12/01
console.log(newDate2);

newDate3 = updateDate(lastYear, everyTwoYears); //Expected 2026/01/01
console.log(newDate3)

newDate4 = updateDate(newYears2024, lastDayOf5Months); //Expected 2025/05/31
console.log(newDate4);

newDate5 = updateDate(nextWednesday, everyThirdWednesday);  //Expected 2025/12/17 (third wednesday of december)
console.log(newDate5);
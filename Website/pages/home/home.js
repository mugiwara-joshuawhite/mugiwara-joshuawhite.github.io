/**
 * fills the income section with the streams from user account
 */
function loadIncome() {

    //Values
    const streams = account.streams;    //Data to show
    const incomeList = document.querySelector(".income-list");  //Where to show the data

    //Loop through streams
    for (let i = 0; i < streams.length; i++) {

        //Main parts of a stream, the name and the data
        let category = document.createElement('button');
        let list = document.createElement('ul');

        let items = [document.createElement('li'),  //Amount
            document.createElement('li'),           //Next due date
            document.createElement('li'),           //End date
            //To add later - recurrance data
        ];
        //Data holds the actual values of each item
        let data = [document.createElement('span'),
            document.createElement('span'),
            document.createElement('span'),
        ];

        //Fill out category
        category.innerHTML = streams[i].text;
        category.classList.add("finance-category");
        //TODO: add event listener to expand stream on category

        items[0].innerHTML = "Amount: $";
        items[1].innerHTML = "Next Payday: ";
        items[2].innerHTML = "Goes until: ";
        
        //TODO: Format dates better
        data[0].innerHTML = streams[i].amount;
        data[1].innerHTML = streams[i].date;
        data[2].innerHTML = streams[i].endDate;
        
        //If there were a way to know how many values an object had i would do this differently
        for (let j = 0; j < 3; j++) {
            data[j].classList.add('income-text');
            items[j].appendChild(data[j]);
            list.appendChild(items[j]);
        }

        incomeList.appendChild(category);
        incomeList.appendChild(list);
    }
}

async function main() {
    await account.loadFromStorage();

    loadIncome();
}

main();
/**
 * @author Roy Rodriguez
 * @license Zlib
 * @since 2025-10-27
 * @description Creates, modifies, removes, and displays income
 * from user data. Most of this is from the notification page's code. (not anymore)
 */

let abortController = new AbortController(); // allows for control over event listeners being canceled

/*
*/
function loadIncome(userAccount)
{
    //Variables
        //income streams
    const incomeArray = userAccount.streams;
        //Incomes
    const incomeList = document.querySelector('.income-list'); 
    incomeList.innerHTML = ''; // clear current notifications displayed

    // For all notifications in the list, load a notification in the display
    for(let i = 0; i < incomeArray.length; i++)
    {
        let transaction = document.createElement('li');
        let divider = document.createElement('div');
        let modifyButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        modifyButton.innerHTML = 'Modify Transaction';
        modifyButton.classList.add('modify-button');
        modifyButton.classList.add('hidden');

        // Bind modify button to modify notification at index
        modifyButton.addEventListener('click', function(){
            modifyIncome(i);
        })

        // Set up delete button
        deleteButton.innerHTML = 'Delete Transaction';
        deleteButton.classList.add('delete-button');
        deleteButton.classList.add('hidden');

        // Bind delete button to delete notification at index
        deleteButton.addEventListener('click', function(){
            deleteWarning(i);
        })
        
        transaction.classList.add('categories');
        divider.classList.add('bar');

        let isRecurring = "No";
        if (incomeArray[i].recurrance.length > 0)
        {
            isRecurring = "Yes";
        }

        // Add notication text and date to display
        // dude what even is this formatting
        transaction.innerHTML = `
        <p class="transaction-text"> ${incomeArray[i].text}
        <p class="amount-text"> ${incomeArray[i].amount}
        <p class="reoccurance-text"> ${isRecurring}
        `;

        // Add Notification to the list.
        transaction.innerHTML = 
            `<input type="checkbox" class="hidden checkbox" id="checkbox-${i}">`
            + transaction.innerHTML;
        incomeList.appendChild(transaction);
        incomeList.appendChild(modifyButton);
        incomeList.appendChild(deleteButton);
        incomeList.appendChild(divider);
    }
}

/**
 * Open window for adding income
 */
function openAddIncome()
{
    // Abort any operation pre-existing involving the notification and reset the controller
    // to prepare for any operation using the notification panel
    abortController.abort()
    abortController = new AbortController();

    //Elements
    const createBox = document.querySelector(".create-box");    //Create box
    const errorText = document.querySelector('.error-text');    //Error text
    const addNotificationButton = document.querySelector('#add-income');  //Add Transaction -> Add
    const modifyNotificationButton = document.querySelector('#modify-income');

    const transactionTextInput = document.querySelector('#transaction-text');   //Transaction name input
    const transactionAmountInput = document.querySelector('#transaction-amount');   //Transaction amount input
    const transactionDateInput = document.querySelector('#income-date');  //Next pay date
    const recurringInput = document.querySelector('#transaction-recurring');    //Is recurring?
    const recurringIntervalInput = document.querySelector('#recurring-interval');   //How often does recur?
    const endDateInput = document.querySelector('#end-date');   //When ends
    const xInput = document.querySelector('#x-text');   //Every x day
    const weekdayDropdown = document.querySelector('#weekday-dropdown');    //Weekday dropdown
    const yInput = document.querySelector('#y-text');   //Of every y timeframe

    // Reveal add button
    addNotificationButton.classList.remove('hidden');
    modifyNotificationButton.classList.add('hidden');

    // clear input fields on open
    transactionTextInput.value = "";
    transactionDateInput.value = "";
    transactionAmountInput.value = "";
    recurringInput.checked = false;
    showRecurring();
    recurringIntervalInput.value = "daily";
    endDateInput.value = "";
    xInput.value = "";
    weekdayDropdown.value = "Monday";
    yInput.value = "";


    // Hide error text, and reveal createbox when it's ready
    errorText.classList.add('hidden'); 
    createBox.classList.remove('hidden');
}

/**
 * Update the add income window based on recurring expense parameters
 */
function showRecurring()
{
    const xField = document.querySelector(".is-recurring"); // Show only if the payment is recurring
    const yField = document.querySelector(".has-y"); // Show only if the specific type of payment has a second variable involved
    const weekdayDropdown = document.querySelector(".is-weekday"); // Show only if the specific type of payment involves a day of the week
    const recurringCheck = document.querySelector(".recurring-check"); // Whether the payment is recurring or not
    const recurringSelect = document.querySelector(".recurring-select"); // Specific type of recurring payment

    // This code kinda sucks, however I cannot be bothered at the moment to make it better
    if (recurringCheck.checked == true)
    {
        xField.classList.remove('hidden');
        if (recurringSelect.value == "specificDay")
        {
            yField.classList.remove('hidden');
            weekdayDropdown.classList.add('hidden');
        }
        else if (recurringSelect.value == "specificDayOfWeek")
        {
            yField.classList.remove('hidden');
            weekdayDropdown.classList.remove('hidden');
        }
        else
        {
            yField.classList.add('hidden');
            weekdayDropdown.classList.add('hidden');
        }
        
    }
    else
    {
        xField.classList.add('hidden');
        yField.classList.add('hidden');
        weekdayDropdown.classList.add('hidden');
    }

}

/**
 * Clsoe window for adding income
 */
function closeAddIncome()
{
    const createBox = document.querySelector(".create-box");

    createBox.classList.add('hidden');
}

/**
 * Add income to account at index
 */
function addIncome(index)
{
    //Elements
    const transactionTextInput = document.querySelector('#transaction-text');   //Transaction name input
    const transactionAmountInput = document.querySelector('#transaction-amount');   //Transaction amount input
    const transactionDateInput = document.querySelector('#income-date');  //Next pay date
    const recurringInput = document.querySelector('#transaction-recurring');    //Is recurring?
    const recurringIntervalInput = document.querySelector('#recurring-interval');   //How often does recur?
    const endDateInput = document.querySelector('#end-date');   //When ends
    const xInput = document.querySelector('#x-text');   //Every x day
    const weekdayDropdown = document.querySelector('#weekday-dropdown');    //Weekday dropdown
    const yInput = document.querySelector('#y-text');   //Of every y timeframe

    // Get error field
    const errorText = document.querySelector('.error-text');
    errorText.classList.add('hidden'); // make sure it's hidden
    xError = false;
    yError = false;

    // The Mother of All Error Checkers
    if (recurringInput.checked)
    {
        xError = (xInput.value.length <= 0 || endDateInput.value.length <= 0);
        if (recurringIntervalInput.value == "specificDay" || recurringIntervalInput.value == "specificDayOfWeek")
        {
            yError = (yInput.value.length <= 0);
        }
    }

    //Check for making sure all available fields are filled
    if (transactionTextInput.value.length <= 0 ||
        transactionAmountInput.value.length <= 0 ||
        transactionDateInput.value.length <= 0 ||
        xError ||
        yError)
    {
        errorText.innerHTML = `All transaction fields must be filled out`
        errorText.classList.remove('hidden');
    }
    else // Valid transaction
    {
        // Replace dashes in transactionDate with
        let date = new Date(transactionDateInput.value.replace('-', '/'));

        //Changed it so that endDate is same as date if not recurring
        //as it made endDate null before
        //Also idk why it's making the dates so detailed now
        let endDate = new Date();
        if (recurringInput.checked) {
            endDate = new Date(endDateInput.value.replace('-', '/'));
        }
        else {
            endDate = new Date(date);
        }
        
        
        // Create recurrance array
        let recurrance = [];
        if (recurringInput.checked)
        {
            recurrance.push(recurringIntervalInput.value);
            recurrance.push(xInput.value);
            if (recurringIntervalInput.value == "specificDay" || recurringIntervalInput.value == "specificDayOfWeek")
            {
                recurrance.push(yInput.value);
            }
            if (recurringIntervalInput.value == "specificDayOfWeek")
            {
                recurrance.push(weekdayDropdown.value);
            }
        }

        // Create transaction
        let transaction = new Transaction(
            transactionTextInput.value,
            transactionAmountInput.value,
            date,
            recurrance,
            endDate
        );

        // If index is a number (not undefined) then replace transaction
        if (Number.isInteger(index))
            account.streams[index] = transaction;
        else // else add created transaction to end of list
            account.streams.push(transaction);

        account.streams.sort(compareIncomes);
        account.saveToStorage(); // save changes to storage

        // Reflect changes in notification display
        loadIncome(account);
        closeAddIncome();
    }
}

/**
 * Sorting function for two transactions.
 * Use with .sort()
 */
function compareIncomes(transaction1, transaction2)
{
    const dateObject1 = new Date(transaction1.date);
    const dateObject2 = new Date(transaction2.date);

    let result = dateObject2.valueOf() - dateObject1.valueOf();
    return result;
}

/**
 * Open dialog to modify an existing income
 */
function modifyIncome(index)
{
    // Obtain notification buttons
    const addIncomeButton = document.querySelector('#add-income');
    const modifyIncomeButton = document.querySelector('#modify-income');

    // Hide add button and reveal modify button
    openAddIncome();
    addIncomeButton.classList.add('hidden');
    modifyIncomeButton.classList.remove('hidden');

    // To modify notificiation we add notification to specified index
    modifyIncomeButton.addEventListener('click', function (){
        addIncome(index)},
        { signal:abortController.signal }
    );
}

/**
 * Show or hide modify Income buttons on the Income list
 */
function showOrHideModifyIncomes()
{
    const modifyButtons = document.querySelectorAll(".modify-button");
    const deleteButtons = document.querySelectorAll(".delete-button");

    for(let i = 0; i < modifyButtons.length; i++)
    {
        modifyButtons[i].classList.toggle('hidden');
    }

    //For some reason I couldn't do this in the other for loop
    //because of an out-of-bound error despite the fact they should
    //be the same length >:(
    for (let i = 0; i < deleteButtons.length; i++) {
        if (!deleteButtons[i].classList.contains('hidden')) {
            deleteButtons[i].classList.toggle('hidden');
        }
    }
}

/**
 * Warns the user before deleting data at the specified index.
 */
function deleteWarning(index)
{
    const deleteDialog = document.querySelector('.delete-box');
    const deleteText = document.querySelectorAll('#delete-warning');
    
    deleteIndex = index;

    for(let i = 0; i < deleteText.length; i++)
    {
        deleteText[i].classList.remove('hidden');
    }

    deleteDialog.classList.remove('hidden');
}

/**
 * Removes the warning window for deleting a transaction.
 */
function cancelWarning()
{
    const deleteDialog = document.querySelector('.delete-box');
    const deleteText = document.querySelectorAll('#delete-warning');

    for(let i = 0; i < deleteText.length; i++)
    {
        deleteText[i].classList.add('hidden');
    }

    deleteDialog.classList.add('hidden');
}

/**
 * Delete an income at the given index
 */
function deleteIncome()
{
    console.log(account.streams.splice(deleteIndex, 1));
    account.saveToStorage();
    cancelWarning(); // Make warning dialog disappear
    loadIncome(account);
    showOrHideDeleteIncomes(); // Keep the delete options open
}

/**
 * Show or hide delete Income buttons on Income list
 */
function showOrHideDeleteIncomes()
{
    const deleteButtons = document.querySelectorAll(".delete-button");
    const modifyButtons = document.querySelectorAll(".modify-button");

    for(let i = 0; i < deleteButtons.length; i++)
    {
        deleteButtons[i].classList.toggle('hidden');
    }

    //For some reason I couldn't do this in the other for loop
    //because of an out-of-bound error despite the fact they should
    //be the same length >:(
    for (let i = 0; i < modifyButtons.length; i++) {
        if (!modifyButtons[i].classList.contains('hidden')) {
            modifyButtons[i].classList.toggle('hidden');
        }
    }
}

/**
 * Main function
 * Using the same UI style as notifications
 */
async function main()
{
    //Load account from storage
    await account.loadFromStorage();

    //Elements
    const addButton = document.querySelector('#add-button');    //Add Transaction
    const modifyButton = document.querySelector('#modify-button');  //Modify Transaction
    const deleteButton = document.querySelector('#delete-button');  //Delete Transaction

    const confirmDelete = document.querySelector('#confirm-delete');
    const cancelDelete = document.querySelector('#cancel-delete');

    // Notification creation buttons
    const addIncomeButton = document.querySelector('#add-income');  //Add Transaction -> Add
    const cancelIncomeButton = document.querySelector('#cancel-income');    //Add Transaction -> Cancel

    //Listeners
    addButton.addEventListener('click', openAddIncome);
    modifyButton.addEventListener('click', showOrHideModifyIncomes);
    deleteButton.addEventListener('click', showOrHideDeleteIncomes);

    confirmDelete.addEventListener('click', deleteIncome);
    cancelDelete.addEventListener('click', cancelWarning);
    addIncomeButton.addEventListener('click', function () { addIncome(); });
    cancelIncomeButton.addEventListener('click', closeAddIncome);

    //Load incomes upon opening page
    loadIncome(account);
}

main()
let deleteIndex = 0; // Used for deleting a specific index
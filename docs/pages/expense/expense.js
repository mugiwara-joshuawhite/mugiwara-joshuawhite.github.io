/**
 * @author Roy Rodriguez
 * @license Zlib
 * @since 2025-10-27
 * @description Creates, modifies, removes, and displays Expense
 * from user data. Most of this is from the notification page's code.
 */

let abortController = new AbortController(); // allows for control over event listeners being canceled

function loadExpense()
{
    const ExpenseArray = account.expenses;
    const expenseList = document.querySelector('.expense-list'); 
    expenseList.innerHTML = ''; // clear current expenses displayed

    // For all expenses in the list, load a expense in the display
    for(let i = 0; i < ExpenseArray.length; i++)
    {
        let transaction = document.createElement('li');
        let divider = document.createElement('div');
        let modifyButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        modifyButton.innerHTML = 'Modify Transaction';
        modifyButton.classList.add('modify-button');
        modifyButton.classList.add('hidden');

        // Bind modify button to modify expense at index
        modifyButton.addEventListener('click', function(){
            modifyExpense(i);
        })

        // Set up delete button
        deleteButton.innerHTML = 'Delete Transaction';
        deleteButton.classList.add('delete-button');
        deleteButton.classList.add('hidden');

        // Bind delete button to delete expense at index
        deleteButton.addEventListener('click', function(){
            deleteWarning(i);
        })
        
        transaction.classList.add('categories');
        divider.classList.add('bar');

        let isRecurring = "No";
        if (ExpenseArray[i].recurrance.length > 0)
        {
            isRecurring = "Yes";
        }

        // Add notication text and date to display
        // dude what even is this formatting
        transaction.innerHTML = `
        <p class="transaction-text"> ${ExpenseArray[i].text}
        <p class="amount-text"> ${ExpenseArray[i].amount}
        <p class="reoccurance-text"> ${isRecurring}
        `;

        // Add expense to the list.
        transaction.innerHTML = 
            `<input type="checkbox" class="hidden checkbox" id="checkbox-${i}">`
            + transaction.innerHTML;
        expenseList.appendChild(transaction);
        expenseList.appendChild(modifyButton);
        expenseList.appendChild(deleteButton);
        expenseList.appendChild(divider);
    }
}

/**
 * Open window for adding Expense
 */
function openAddExpense()
{
    // Abort any operation pre-existing involving the expense and reset the controller
    // to prepare for any operation using the expense panel
    abortController.abort()
    abortController = new AbortController();

    // Obtian all buttons
    const createBox = document.querySelector(".create-box");
    const errorText = document.querySelector('.error-text');

    const transactionTextInput = document.querySelector('#transaction-text');   //Transaction name input
    const transactionAmountInput = document.querySelector('#transaction-amount');   //Transaction amount input
    const transactionDateInput = document.querySelector('#expense-date');  //Next pay date
    const recurringInput = document.querySelector('#transaction-recurring');    //Is recurring?
    const recurringIntervalInput = document.querySelector('#recurring-interval');   //How often does recur?
    const endDateInput = document.querySelector('#end-date');   //When ends
    const xInput = document.querySelector('#x-text');   //Every x day
    const weekdayDropdown = document.querySelector('#weekday-dropdown');    //Weekday dropdown
    const yInput = document.querySelector('#y-text');   //Of every y timeframe

    const addExpenseButton = document.querySelector('#add-expense');
    const modifyExpenseButton = document.querySelector('#modify-expense');

    // Reveal add button
    addExpenseButton.classList.remove('hidden');
    modifyExpenseButton.classList.add('hidden');

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
 * Update the add Expense window based on recurring expense parameters
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
 * Clsoe window for adding Expense
 */
function closeAddExpense()
{
    const createBox = document.querySelector(".create-box");

    createBox.classList.add('hidden');
}

/**
 * Add Expense to account at index
 */
function addExpense(index)
{
    // Get input fields
    const transactionTextInput = document.querySelector('#transaction-text');
    const transactionAmountInput = document.querySelector('#transaction-amount');
    const transactionDateInput = document.querySelector('#expense-date');
    const recurringInput = document.querySelector('#transaction-recurring');
    const recurringIntervalInput = document.querySelector('#recurring-interval');
    const endDateInput = document.querySelector('#end-date');
    const xInput = document.querySelector('#x-text');
    const weekdayDropdown = document.querySelector('#weekday-dropdown');
    const yInput = document.querySelector('#y-text');

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
            account.expenses[index] = transaction;
        else // else add created transaction to end of list
            account.expenses.push(transaction);

        account.expenses.sort(compareExpenses);
        account.saveToStorage(); // save changes to storage

        // Reflect changes in expense display
        loadExpense();
        closeAddExpense();
    }
}

/**
 * Sorting function for two transactions.
 * Use with .sort()
 */
function compareExpenses(transaction1, transaction2)
{
    const dateObject1 = new Date(transaction1.date);
    const dateObject2 = new Date(transaction2.date);

    let result = dateObject2.valueOf() - dateObject1.valueOf();
    return result;
}

/**
 * Open dialog to modify an existing Expense
 */
function modifyExpense(index)
{
    // Obtain expense buttons
    const addExpenseButton = document.querySelector('#add-expense');
    const modifyExpenseButton = document.querySelector('#modify-expense');

    // Hide add button and reveal modify button
    openAddExpense();
    addExpenseButton.classList.add('hidden');
    modifyExpenseButton.classList.remove('hidden');

    // To modify expense we add expense to specified index
    modifyExpenseButton.addEventListener('click', function (){
        addExpense(index)},
        { signal:abortController.signal }
    );
}

/**
 * Show or hide modify Expense buttons on the Expenses list
 */
function showOrHideModifyExpenses()
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
 * Delete an Expense at the given index
 */
function deleteExpense()
{
    console.log(account.expenses.splice(deleteIndex, 1));
    account.saveToStorage();
    cancelWarning(); // Make warning dialog disappear
    loadExpense();
    showOrHideDeleteExpenses(); // Keep the delete options open
}

/**
 * Show or hide delete Expense buttons on Expense list
 */
function showOrHideDeleteExpenses()
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
    await account.loadFromStorage();

    const addButton = document.querySelector('#add-button');
    const modifyButton = document.querySelector('#modify-button');
    const deleteButton = document.querySelector('#delete-button');
    const confirmDelete = document.querySelector('#confirm-delete');
    const cancelDelete = document.querySelector('#cancel-delete');

    // Expense creation buttons
    const addExpenseButton = document.querySelector('#add-expense');
    const cancelExpenseButton = document.querySelector('#cancel-expense');

    // Add expense to account on addButton press
    addButton.addEventListener('click', openAddExpense);

    // Modify expenses of account on button press
    modifyButton.addEventListener('click', showOrHideModifyExpenses);

    // Delete expenses prompts
    deleteButton.addEventListener('click', showOrHideDeleteExpenses);
    confirmDelete.addEventListener('click', deleteExpense);
    cancelDelete.addEventListener('click', cancelWarning);

    addExpenseButton.addEventListener('click', function () { addExpense(); });
    cancelExpenseButton.addEventListener('click', closeAddExpense);

    loadExpense(account);
}

main()
let deleteIndex = 0; // Used for deleting a specific index
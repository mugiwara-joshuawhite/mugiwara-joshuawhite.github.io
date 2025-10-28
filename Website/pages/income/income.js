/**
 * @author Roy Rodriguez
 * @license Zlib
 * @since 2025-10-27
 * @description Creates, modifies, removes, and displays income
 * from user data. Most of this is from the notification page's code.
 */

function loadIncome()
{

}

/**
 * Open window for adding income
 */
function openAddIncome()
{
    // Obtian all buttons
    const createBox = document.querySelector(".create-box");
    const errorText = document.querySelector('.error-text');
    const notificationTextInput = document.querySelector('#transaction-text');
    const notificationDateInput = document.querySelector('#notification-date');

    const addNotificationButton = document.querySelector('#add-notification');
    const modifyNotificationButton = document.querySelector('#modify-notification');

    // Reveal add button
    addNotificationButton.classList.remove('hidden');
    modifyNotificationButton.classList.add('hidden');

    // clear input fields on open
    notificationTextInput.value = "";
    notificationDateInput.value = "";

    // Hide error text, and reveal createbox when it's ready
    errorText.classList.add('hidden'); 
    createBox.classList.remove('hidden');
}

/**
 * Update the add income window based on recurring expense
 */
function showRecurring()
{
    const xField = document.querySelector("is-recurring");
    const yfield = document.querySelector("has-y");
    const recurringDropdown = document.querySelector("recurring-interval");
    const weekdayDropdown = document.querySelector("is-weekday");
    const recurringCheck = document.querySelector("transaction-recurring");

    if (recurringCheck.checked == true)
    {
        xField.classList.remove('hidden');
        
    }
    else
    {
        xField.classList.add('hidden');
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

function addIncome()
{

}

function compareIncomes()
{

}

function modifyIncome()
{

}

function modifyIncomes()
{

}

function deleteIncome()
{

}

function deleteIncomes()
{
    
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

    // Notification creation buttons
    const addNotificationButton = document.querySelector('#add-notification');
    const cancelNotificationButton = document.querySelector('#cancel-notification');
    const recurringCheckbox = document.querySelector("transaction-recurring");

    // Add notification to account on addButton press
    addButton.addEventListener('click', openAddIncome);

    // Modify notifications of account on button press
    modifyButton.addEventListener('click', modifyIncomes);


    addNotificationButton.addEventListener('click', function () { addIncome(); });
    cancelNotificationButton.addEventListener('click', closeAddIncome);
    recurringCheckbox.addEventListener('click', showRecurring);

    // loadIncome(account);
}

main()
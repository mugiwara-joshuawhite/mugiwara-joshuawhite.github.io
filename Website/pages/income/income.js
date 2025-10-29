/**
 * @author Roy Rodriguez
 * @license Zlib
 * @since 2025-10-27
 * @description Creates, modifies, removes, and displays income
 * from user data. Most of this is from the notification page's code.
 */

function loadIncome()
{
    const incomeArray = account.income;
    const notificationList = document.querySelector('.notification-list'); 
    notificationList.innerHTML = ''; // clear current notifications displayed

    // For all notifications in the list, load a notification in the display
    for(let i = 0; i < incomeArray.length; i++)
    {
        let transaction = document.createElement('li');
        let divider = document.createElement('div');
        let modifyButton = document.createElement('button');

        modifyButton.innerHTML = 'Modify Transaction';
        modifyButton.classList.add('modify-button');
        modifyButton.classList.add('hidden');

        // Bind modify button to modify notification at index
        modifyButton.addEventListener('click', function(){
            modifyIncome(i);
        })
        
        transaction.classList.add('categories');
        divider.classList.add('bar');

        let isRecurring = "No";
        if (incomeArray[i].recurrance.length > 0)
        {
            isRecurring = "Yes";
        }

        // Add notication text and date to display
        transaction.innerHTML = `
        <p class="transaction-text"> ${incomeArray[i].text}
        <p class="type-text"> ${incomeArray[i].type}
        <p class="amount-text"> ${incomeArray[i].amount}
        <p class="reoccurance-text"> ${isRecurring}
        `;

        // Add Notification to the list.
        transaction.innerHTML = 
            `<input type="checkbox" class="hidden checkbox" id="checkbox-${i}">`
            + transaction.innerHTML;
        notificationList.appendChild(transaction);
        notificationList.appendChild(modifyButton);
        notificationList.appendChild(divider);
    }
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
    // Get input fields
    const notificationTextInput = document.querySelector('#transaction-text');
    const notificationDateInput = document.querySelector('#notification-date');

    // Get error field
    const errorText = document.querySelector('.error-text');
    errorText.classList.add('hidden'); // make sure it's hidden

    // Get input data
    const notificationText = notificationTextInput.value;
    const notificationDate = notificationDateInput.value;

    // Invalid 
    if (notificationText.length <= 0 || notificationDate.length <= 0)
    {
        errorText.innerHTML = `Transaction needs all fields filled out`
        errorText.classList.remove('hidden');
    }
    else // Valid notification
    {
        // Replace dashes in notificationDate with
        let date = new Date(notificationDate.replace('-', '/'));
        let notification = new UserNotification(notificationText, date);

        // If index is a number (not undefined) then replace notificatio
        if (Number.isInteger(index))
            account.notifications[index] = notification;
        else // else add created notification to end of list
            account.notifications.push(notification);

        account.notifications.sort(compareDates);
        account.saveToStorage(); // save changes to storage

        // Reflect changes in notification display
        loadNotifications();
        closeAddNotification();
    }
}

function compareIncomes()
{

}

/**
 * Open dialog to modify an existing income
 */
function modifyIncome()
{
    // Obtain notification buttons
    const addNotificationButton = document.querySelector('#add-notification');
    const modifyNotificationButton = document.querySelector('#modify-notification');

    // Hide add button and reveal modify button
    openAddIncome();
    addNotificationButton.classList.add('hidden');
    modifyNotificationButton.classList.remove('hidden');

    // To modify notificiation we add notification to specified index
    modifyNotificationButton.addEventListener('click', function (){
        addNotification(index);
    })
}

/**
 * Show or hide modify income buttons on the income list
 */
function modifyIncomes()
{
    const modifyButtons = document.querySelectorAll(".modify-button");


    for(let i = 0; i < modifyButtons.length; i++)
    {
        modifyButtons[i].classList.toggle('hidden');
    }
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

    account.income.push(new Transaction(text="Hiiii", type="Salary", amount="100", date=new Date("2020-01-01"), recurrance=["monthly", 1], endDate=new Date("2021-01-01")));
    loadIncome(account);
}

main()
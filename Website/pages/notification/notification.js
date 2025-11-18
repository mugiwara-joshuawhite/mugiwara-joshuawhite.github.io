/**
 * @author Jeffrey Kotz, Ryan Rupakheti
 * @license Zlib
 * @since 2025-10-25
 * @description Logic for notifications page allowing viewing,
 * adding, modification, and removal of notifications
 */

let abortController = new AbortController(); // allows for control over event listeners being canceled

/**
 * Add notifications for each expense
 */
function expense_notifications()
{
    // For each expense add a notification
    account.expenses.forEach((Expense)=> 
    {
        let endDate = new Date(Expense.endDate);
        let expenseDate = new Date(Expense.date)
        let currentDate = new Date()

        // If the expense is current then form it's notification
        if (expenseDate > currentDate || endDate > currentDate)
        {
            let text = `${Expense.text} | Amount Due: $${Expense.amount} `
            
            let notification = new UserNotification(text, expenseDate)

            let matchingNotifications = account.notifications.filter((notifcation) =>  text === notifcation.text)

            // if there is a matching notification given, then update the date
            if(matchingNotifications.length > 0)
                matchingNotifications[0].date = expenseDate 
            else // else add a new notification to the account for the expense
                account.notifications.push(notification);
            
            account.saveToStorage()
        }
    })
    
}

/**
 * open window to add notifications
 */
function openAddNotifications()
{
    // Abort any operation pre-existing involving the notification and reset the controller
    // to prepare for any operation using the notification panel
    abortController.abort()
    abortController = new AbortController();


    // Obtian all buttons
    const createBox = document.querySelector(".create-box");
    const errorText = document.querySelector('.error-text');
    const notificationTextInput = document.querySelector('#notification-text');
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
 * Close notification creation window
 */
function closeAddNotification()
{
    const createBox = document.querySelector(".create-box");
    
    createBox.classList.add('hidden');
}

/**
 * Add notification to account or replace if index is given
 * @param {int} index index of notification
 */
function addNotification(index)
{
    // Get input fields
    const notificationTextInput = document.querySelector('#notification-text');
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
        errorText.innerHTML = `Notification needs a body and date`
        errorText.classList.remove('hidden');
    }
    else // Valid notification
    {
        // Replace dashes in notificationDate with
        let date = new Date(notificationDate.replace('-', '/'))
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

/**
 * Compare function to compare dates of a user notification
 * @param {UserNotification} notification1 
 * @param {UserNotification} notification2 
 * @returns 
 */
function compareDates(notification1, notification2){
    const dateObject1 = new Date(notification1.date);
    const dateObject2 = new Date(notification2.date);

    let result = dateObject2.valueOf() - dateObject1.valueOf();
    return result;
}

/**
 * Modification notification at index
 * @param {int} index notification index in account to modify
 */
function modifyNotification(index)
{
    // Obtain notification buttons
    const addNotificationButton = document.querySelector('#add-notification');
    const modifyNotificationButton = document.querySelector('#modify-notification');

    // Hide add button and reveal modify button
    openAddNotifications();
    addNotificationButton.classList.add('hidden');
    modifyNotificationButton.classList.remove('hidden');

    // To modify notificiation we add notification to specified index
    modifyNotificationButton.addEventListener('click', function (){
        addNotification(index);
    },
    { signal:abortController.signal }) // bind it to the abort controller to cancel it if not used
}



/**
 * Modify notifications of user account
 */
function modifyNotifications()
{
    const modifyButtons = document.querySelectorAll(".modify-button");


    for(let i = 0; i < modifyButtons.length; i++)
    {
        modifyButtons[i].classList.toggle('hidden');
    }
}

/**
 * Show check boxes to mark tasks complete
 */
function showCompleteTasks()
{
    const allSelectionBox = document.querySelectorAll(".completeCheckBox");

    const completeButton = document.querySelector('#complete-button');
    const confirmCompleteButton = document.querySelector('#confirm-complete-button');
    completeButton.classList.add('hidden')
    confirmCompleteButton.classList.remove('hidden')

    allSelectionBox.forEach((checkbox) => checkbox.classList.remove('hidden'));
}

/**
 * Remove all tasks marked as complete
 */
function confirmCompleteTasks()
{
    const allSelectionBox = document.querySelectorAll(".completeCheckBox");

    const completeButton = document.querySelector('#complete-button');
    const confirmCompleteButton = document.querySelector('#confirm-complete-button');
    completeButton.classList.remove('hidden')
    confirmCompleteButton.classList.add('hidden')

    // check and remove all checked notifications
    for(let i = allSelectionBox.length - 1; i >= 0; i--)
    {
        if(allSelectionBox[i].checked)
        {
            account.notifications.splice(i,1);
        }
    }

    account.saveToStorage();

    // load notifications
    loadNotifications();
}


/**
 * Main function, limits scope.
 */
async function main()
{
    await account.loadFromStorage();

    const addButton = document.querySelector('#add-button');
    const modifyButton = document.querySelector('#modify-button');
    const completeButton = document.querySelector('#complete-button');
    const confirmCompleteButton = document.querySelector('#confirm-complete-button');


    // Notification creation buttons
    const addNotificationButton = document.querySelector('#add-notification');
    const cancelNotificationButton = document.querySelector('#cancel-notification');

    // Add notification to account on addButton press
    addButton.addEventListener('click', openAddNotifications);

    // Modify notifications of account on button press
    modifyButton.addEventListener('click', modifyNotifications);

    completeButton.addEventListener('click', showCompleteTasks);
    confirmCompleteButton.addEventListener('click', confirmCompleteTasks);

    addNotificationButton.addEventListener('click', addNotification);
    cancelNotificationButton.addEventListener('click', closeAddNotification);

    expense_notifications()

    loadNotifications(account);
}



main()

// Notification.requestPermission()
// const notification = new Notification("Hi there!");

/**
 * @author Jeffrey Kotz, Ryan Rupakheti
 * @license Zlib
 * @since 2025-10-25
 * @description Logic for notifications page allowing viewing,
 * adding, modification, and removal of notifications
 */

/**
 * Load notifications from account
 */
function loadNotifications()
{
    const notifications = account.notifications;
    const notificationList = document.querySelector('.notification-list'); 
    notificationList.innerHTML = ''; // clear current notifications displayed

    // For all notifications in the list, load a notification in the display
    for(let i = 0; i < notifications.length; i++)
    {
        let notification = document.createElement('li');
        let divider = document.createElement('div');
        let modifyButton = document.createElement('button');

        modifyButton.innerHTML = 'Modify Notification';
        modifyButton.classList.add('modify-button');
        modifyButton.classList.add('hidden');

        // Bind modify button to modify notification at index
        modifyButton.addEventListener('click', function(){
            modifyNotification(i);
        })
        
        notification.classList.add('categories');
        divider.classList.add('bar');

        let date = new Date(notifications[i].date);

        // Add notication text and date to display
        notification.innerHTML = `
        <p class="notification-text"> ${notifications[i].text}
        <p class="date-text"> ${date.toDateString()}
        `;

        // Add Notification to the list.
        notification.innerHTML = 
            `<input type="checkbox" class="hidden checkbox" id="checkbox-${i}">`
            + notification.innerHTML;
        notificationList.appendChild(notification);
        notificationList.appendChild(modifyButton);
        notificationList.appendChild(divider);
    }
}

/**
 * open window to add notifications
 */
function openAddNotifications()
{
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
    })

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
 * Main function, limits scope.
 */
async function main()
{
    await account.loadFromStorage();

    const addButton = document.querySelector('#add-button');
    const modifyButton = document.querySelector('#modify-button');

    // Notification creation buttons
    const addNotificationButton = document.querySelector('#add-notification');
    const cancelNotificationButton = document.querySelector('#cancel-notification');

    // Add notification to account on addButton press
    addButton.addEventListener('click', openAddNotifications)

    // Modify notifications of account on button press
    modifyButton.addEventListener('click', modifyNotifications)


    addNotificationButton.addEventListener('click', function () { addNotification(); });
    cancelNotificationButton.addEventListener('click', closeAddNotification);


    loadNotifications(account);
}

main()
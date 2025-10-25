/**
 * @author Jeffrey Kotz
 * @license Zlib
 * @since 2025-10-12
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

    for(let i = 0; i < notifications.length; i++)
    {
        let notification = document.createElement('li');
        let divider = document.createElement('div');
        
        notification.classList.add('categories');
        divider.classList.add('bar');

        let date = new Date(notifications[i].date);

        // TODO: use inner html to make this pretty
        // Closing tags?
        notification.innerHTML = `
        <p class="notification-text"> ${notifications[i].text}
        <p class="date-text"> ${date.toDateString()}
        `;

        notification.innerHTML = 
            `<input type="checkbox" class="hidden checkbox" id="checkbox-${i}">`
            + notification.innerHTML;
        notificationList.appendChild(notification);
        notificationList.appendChild(divider);
    }
}

/**
 * open window to add notifications
 */
function openAddNotifications()
{
    const createBox = document.querySelector(".create-box");

    createBox.classList.remove('hidden');
}


function closeAddNotification()
{
    const createBox = document.querySelector(".create-box");

    createBox.classList.add('hidden');
}

function addNotification()
{
    let notification = new UserNotification('This is a notification', new Date());
    const notificationTextBox = document.querySelector('#notification-text');

    account.notifications.push(notification);
    account.saveToStorage();

    loadNotifications(account);

    closeAddNotification();
}

/**
 * Modify notifications of user account
 */
function modifyNotifications()
{
    const checkboxes = document.querySelectorAll(".checkbox")
    const notificationList = document.querySelectorAll('li');

    // for(let i = 0; i < notificationList.length; i++)
    // {
    //     notificationList[i].innerHTML = notificationList[i].innerHTML.replace(`<p`, `'<input type="text"`);
    //     notificationList[i].innerHTML = notificationList[i].innerHTML.replace(`<\p>`, ``);
    //     notificationList[i].innerHTML = notificationList[i].innerHTML.replace(`class="`, `class="input `);
    // }
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

    addNotificationButton.addEventListener('click', addNotification);
    cancelNotificationButton.addEventListener('click', closeAddNotification);


    loadNotifications(account);
}

main()
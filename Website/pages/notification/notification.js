/**
 * @author Jeffrey Kotz
 * @license Zlib
 * @since 2025-10-12
 * @description Logic for notifications page allowing viewing,
 * adding, modification, and removal of notifications
 */


/**
 * Load notifications from account
 * @param {Account} account 
 */
function loadNotifications(account)
{
    const notifications = account.notifications;
    const notificationList = document.querySelector('.notification-list'); 

    for(let i = 0; i < notifications.length; i++)
    {
        let notification = document.createElement('li');
        notification.classList.add('categories');

        let date = new Date(notifications[i].date);


        // TODO: use inner html to make this pretty
        // Closing tags?
        notification.innerHTML = `
        <p style="flex: 3;"> ${notifications[i].text}
        <p style="flex: 1;"> ${date.toDateString()}
        `;

        notificationList.appendChild(notification);
    }
}

/**
 * add notification data to user account
 * @param {Account} account user account
 */
function addNotifications(account)
{
    let notification = new UserNotification('This is a notification', new Date());

    account.notifications.push(notification)
    account.saveToStorage();

    loadNotifications(account);
}


/**
 * Main function, limits scope.
 * @param none
 * @returns nothing
 */
function main()
{
    let account = new Account();
    account.loadFromStorage(); // Load any currently stored data in storage
    
    account.onLoadSuccess = function ()
    {
        // bind button here with account as paramenter?

        //i.e. bind button to function () { addNotification (account); }

        //loadNotifications(account);
        addNotifications(account);
    }
}

main()
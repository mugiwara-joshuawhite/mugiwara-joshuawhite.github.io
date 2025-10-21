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


function modifyNotifications(account)
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
    const addButton = document.querySelector('#add-button');
    const modifyButton = document.querySelector('#modify-button');

    let account = new Account();
    await account.loadFromStorage();

    //
    addButton.addEventListener('click', function (){
        addNotifications(account);
    })

    //
    modifyButton.addEventListener('click', function (){
        modifyNotifications(account);
    })

    loadNotifications(account);
}

main()
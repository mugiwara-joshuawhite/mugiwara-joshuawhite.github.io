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

        const date = notifications[i].date;

        // Add notication text and date to display
        notification.innerHTML = `
        <input type="checkbox" value=${i} class="completeCheckBox hidden" > 
        <p class="notification-text">${notifications[i].text} <p class="date-text"> ${date.toDateString()}
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
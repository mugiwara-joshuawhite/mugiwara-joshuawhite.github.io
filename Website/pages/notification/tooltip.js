
async function main()
{
    await account.loadFromStorage();
    loadNotifications();

    // Send out notifications 
    account.notifications.forEach((notification) => notification.checkSendNotification());
}


main();
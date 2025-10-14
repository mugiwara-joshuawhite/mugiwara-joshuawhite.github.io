/**
 * @author Jeffrey Kotz
 * @license Zlib
 * @since 2025-10-5
 * @description This script provides consistent definitions for various data types across all pages
 */

// WARNING: SESSION STORAGE CLEARS UPON PAGE EXIT OR CLOSE
// ANY UNSAVED DATA IS LOST WHEN THE USER LEAVES
// THIS DATA DOES NOT TRANFER BETWEEN MULTIPLE INSTANCES OF THE WEBPAGE.
//sessionStorage.setItem('key', 'value');
//sessionStorage.getItem('key') => value;

// storing/updating user account
// sessionStorage.setItem('Account', JSON.stringify(account));

// Loading from session storage
//let accountJSON = JSON.parse(sessionStorage.getItem('Account'));
//let account = new Account(accountJSON);

// Initializing user data in JSON Format
//const accountJSON = {
//  "name": "TestName",
//  "password": "1234"
//}
//account = new Account(accountJSON);


/**
 * Account class
 */
class Account 
{
    /**
     * 
     * @param {string} userData Json formatted userData
     */
    constructor(userData)
    {
        this.name = userData.name;
        this.password = userData.password;

        // Make array if notifications aren't defined yet
        if (userData.notifications)
            this.notifications = userData.notifications;
        else
            this.notifications = [];
    }

    hello()
    {
        console.log('hi');
    }
}

/**
 * Notification class
 */
class UserNotification
{
    /**
     * 
     * @param {string} text - notification text
     * @param {string} date - notification date
     * @param {int} priority - priority to make important notifications appear first
     */
    constructor(text, date, priority = 0) 
    {
        this.text = text;
        this.date = date;
        this.priority = priority;
    }
}
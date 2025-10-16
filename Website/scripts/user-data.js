/**
 * @author Jeffrey Kotz
 * @license Zlib
 * @since 2025-10-5
 * @description This script provides consistent definitions for various data types across all pages
 */

/**
 * Account class
 */
class Account 
{
    /**
     * Use constructor to make a fresh account, otherwise use Account method load
     * to load user data
     * @param {Object} userData JSON formatted data parsed as an object
     */
    constructor(name, password)
    {
        this.name = name;
        this.password = password;
        this.notifications = []
    }

    /**
     * Load user data into account object.
     * 
     * If you have JSON string, use JSON.parse(stringJSON) to get object input
     * for this method.
     * @param {Object} userData JSON formatted data parsed as an object
     */
    load(userData)
    {
        if (userData)
        {
            this.name = userData.name;
            this.password = userData.password;

            // Make array if notifications aren't defined yet
            if (userData.notifications)
                this.notifications = userData.notifications;
            else
                this.notifications = []; 
        }
    }

    /**
     * Save current account to IndexedDB storage
     */
    saveToStorage()
    {
        const request = indexedDB.open('AccountDatabase', 1);
        const thisAccount = this;

        // If request gives error, indicate error occured
        request.onerror = function() { console.error('IndexedDB error occured'); }

        // If database needs to be created then form database
        // of correct pattern
        request.onupgradeneeded = function() 
        {
            const db = request.result;
            const store = db.createObjectStore('account', { keyPath: 'id' });
        }

        //
        request.onsuccess = function () 
        {
            const db = request.result;
            // Open account database for reading and writign
            const transaction = db.transaction('account', 'readwrite');
            // Open a store for the account
            const store = transaction.objectStore('account');
            // Convert account to JSON string for storage
            const accountJSON = JSON.parse(JSON.stringify(thisAccount));

            // put current account into storage at index 0
            store.put({ id: 0, account: accountJSON });
        }
    }

    
    /**
     * Load account from IndexedDB storage
     */
    loadFromStorage()
    {
        const request = indexedDB.open('AccountDatabase', 1);
        let thisAccount = this;

        // If request gives error, indicate error occured
        request.onerror = function() { console.error('IndexedDB error occured'); }

        // If database needs to be created then form database
        // of correct pattern
        request.onupgradeneeded = function() 
        {
            const db = request.result;
            const store = db.createObjectStore('account', { keyPath: 'id' });
        }

        // When request succeeds, load account and perform operation defined by
        // onLoadSuccess
        request.onsuccess = function () 
        {
            const db = request.result;
            // Open account database for reading and writign
            const transaction = db.transaction('account', 'readwrite');
            // Open a store for the account
            const store = transaction.objectStore('account');

            const query = store.get(0); // Account hardcoded to id of 0 :)
            
            // When query succeeds, load the stored account
            // and after loading, perform operation defined as needed
            query.onsuccess = function()
            {
                thisAccount.load(query.result.account);
                thisAccount.onLoadSuccess();

                if (! thisAccount)
                {
                    window.location.href = '';
                }
            }
        }
    }

    /**
     * Override this function with what you want to do when the account is loaded from the database
     */
    onLoadSuccess()
    {
        console.error(`You forgot to reassign this!
            Do functions with the loaded account data by reassigning
            onLoad success like this!
            account.onLoadSuccess = function ()
            {
                // DO STUFF HERE WITH ACCOUNT
            }
            `);
    }

    /**
     * Save current user data to storage
     */
    // save()
    // {
    //     sessionStorage.setItem('account', JSON.stringify(this));
    // }

    /**
     * Reload user data from storage.
     */
    // loadFromStorage()
    // {
    //     let accountJSON = JSON.parse(sessionStorage.getItem('account'));
    //     this.load(accountJSON);
    // }
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

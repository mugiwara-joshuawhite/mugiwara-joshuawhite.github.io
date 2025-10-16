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
     * @param {string} name username of account
     * @param {string} password password of account
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
        // Open account database from indexedDB, with version '1'
        const request = indexedDB.open('AccountDatabase', 1);
        const thisAccount = this;

        // If request gives error, indicate error occured
        request.onerror = function() { console.error('IndexedDB error occured'); }

        // If database needs to be created then form database
        // of correct pattern
        request.onupgradeneeded = function() 
        {
            const database = request.result; // obtain database

            // Define storage pattern. We want to store an account. Accounts are indexed by id
            const store = database.createObjectStore('account', { keyPath: 'id' });
        }

        // On successful request, open database
        // and store account
        request.onsuccess = function () 
        {
            // Open database holding account information
            const database = request.result;
            const transaction = database.transaction('account', 'readwrite');
            const store = transaction.objectStore('account');

            // Convert account to JSON object for storage
            const accountString = JSON.stringify(thisAccount);
            const accountJSON = JSON.parse(accountString);

            // put current account into storage at index 0
            store.put({ id: 0, account: accountJSON });

            // Do any operations on successful save
            thisAccount.onSaveSuccess();
        }
    }

    
    /**
     * Load account from IndexedDB storage
     */
    loadFromStorage()
    {
        // Open account database from indexedDB, with version '1'
        const request = indexedDB.open('AccountDatabase', 1);
        let thisAccount = this; // retain reference to this Account

        // If request gives error, indicate error occured
        request.onerror = function() { console.error('IndexedDB error occured'); }

        // If database needs to be created then form database
        // of correct pattern
        request.onupgradeneeded = function() 
        {
            const database = request.result; // obtain database

            // Define storage pattern. We want to store an account. Accounts are indexed by id
            const store = database.createObjectStore('account', { keyPath: 'id' });
        }

        // When request succeeds, load account and perform operation defined by
        // onLoadSuccess
        request.onsuccess = function () 
        {
            // Open database holding account information
            const database = request.result;
            const transaction = database.transaction('account', 'readwrite');
            const store = transaction.objectStore('account');

            // get the current account from the store at id 0
            const query = store.get(0); 

            // When query succeeds, load the stored account
            // and after loading, perform operation defined as needed
            query.onsuccess = function()
            {
                thisAccount.load(query.result.account);
                thisAccount.onLoadSuccess();
            }
        }
    }

    /**
     * Override this function with what you want to do when the account is loaded from the database
     */
    onLoadSuccess()
    {
        console.error(`You forgot to reassign this!
            Do operations with the loaded account data by reassigning
            onLoad success like this! Otherwise loading does nothing!
            account.onLoadSuccess = function ()
            {
                // DO STUFF HERE WITH ACCOUNT
            }
            `);
    }

    /**
     * Perform any operations on successful save as defined later
     * Override this with desired behaviors
     */
    onSaveSuccess()
    {
        /* If you want to perform any operations on save, then override
            onSaveSuccess by doing something like:
            account.onSaveSuccess = function ()
            {
                // DO STUFF HERE WITH ACCOUNT
            }
        */
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

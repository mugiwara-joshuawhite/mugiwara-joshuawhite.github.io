/**
 * @author Jeffrey Kotz
 * @license Zlib
 * @since 2025-10-5
 * @description This script provides consistent definitions for various data types across all pages
 */

// Constant for account file name to avoid hardcoding it
const ACCOUNT_FILE_NAME = "account.json";

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
        this.notifications = [];
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
     * Save to origin private file system
     */
    async saveToStorage()
    {
        // Open root directory, and get file handle to write data to
        const root = await navigator.storage.getDirectory();
        const accountFile = await root.getFileHandle(ACCOUNT_FILE_NAME, {create: true});
        const writableFile = await accountFile.createWritable();

        // Write current account data to account file
        await writableFile.write(`${JSON.stringify(this)}`);
        await writableFile.close();
    }

    /**
     * Load from origin private file system
     */
    async loadFromStorage()
    {
        // Open root directory, and get account file to read
        const root = await navigator.storage.getDirectory();
        const accountFile = await root.getFileHandle(ACCOUNT_FILE_NAME, {create: true});
        const readableFile = await accountFile.getFile();

        const text = await readableFile.text();

        // if there is data to load, load it
        if (text.length > 0)
        {
            // Load account info from file
            const accountJSON = JSON.parse(await readableFile.text());
            this.load(accountJSON);
        }
    }

    /**
     * Use this to clear account file from storage
     */
    async clearStorage()
    {
        const root = await navigator.storage.getDirectory();
        root.removeEntry(ACCOUNT_FILE_NAME);
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
     */
    constructor(text, date) 
    {
        this.text = text;
        this.date = date;
        this.isRead = false;
    }

    
}



let account = new Account();
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
     * Save to origin private file system
     */
    async saveToStorage()
    {
        // Open root directory, and get file handle to store data in
        const root = await navigator.storage.getDirectory();
        const testFile = await root.getFileHandle("account.json", {create: true});
        const writableFile = await testFile.createWritable();

        await writableFile.write(`${JSON.stringify(this)}`);
        await writableFile.close();
    }

    /**
     * Load from origin private file system
     */
    async loadFromStorage()
    {
        const root = await navigator.storage.getDirectory();
        const testFile = await root.getFileHandle("account.json");

        // Read the file and load the account
        const readableFile = await testFile.getFile();
        const accountJSON = JSON.parse(await readableFile.text());
        this.load(accountJSON);
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


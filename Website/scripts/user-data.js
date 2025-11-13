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

        this.setup = false; //By default, set setup to false to indicate account has not been setup
        this.streams = [];  //Array of streams, each element should have four parts: [name, amount, rate, day]
        this.expenses = []; //Array of expenses, each element should have three parts: [name, amount, rate]
        this.distributions = []; //Array of dostributions, each element should have two parts: [name, percent]
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

            //Setup data
            this.setup = userData.setup;
            this.streams = userData.streams;
            this.expenses = userData.expenses;
            this.distributions = userData.distributions;

            // Make array if notifications aren't defined yet
            if (userData.notifications)
            {
                for (let i = 0; i < userData.notifications.length; i++)
                {
                    let notification = new UserNotification();
                    notification.load(userData.notifications[i]);
                    this.notifications[i] = notification;
                }
            }
            else
                this.notifications = [];

            // Ditto above for streams
            if (userData.streams)
                this.streams = userData.streams;
            else
                this.streams = [];

            // Ditto above for expenses
            if (userData.expenses)
                this.expenses = userData.expenses;
            else
                this.expenses = [];
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
     * @param {Date} date - notification date
     */
    constructor(text, date) 
    {
        this.text = text;
        this.date = date;

        this.dateNotified = null;
        this.isRead = false;
    }

    /**
     * load notification from input data
     * @param {Object} userNotificion JSON object containing notification data
     */
    load(userNotificion)
    {   
        this.date = new Date(userNotificion.date);
        this.text = userNotificion.text;

        if (userNotificion.dateNotified)
            this.dateNotified = new Date(userNotificion.dateNotified);
    }

    /**
     * Check if notification should be sent, if so send notification
     */
    async checkSendNotification()
    {
        const currentDate = new Date();

        if (this.dateNotified) // Check if notification has been sent before
        {
            let timeSinceLastNotification = currentDate.valueOf() - this.dateNotified.valueOf();

            // 43200000 = 12 hours, if time since notification is greater than 12 hours re-notify
            if (timeSinceLastNotification > 43200000)
            {
                this.notify();
            }
        }
        else // Send notification 
        {
            this.notify();
        }
    }

    /**
     * Send notification 
     */
    async notify()
    {
        // Check if supported by browse
        if (!("Notification" in window))
        {
            alert("no notifications");
        }
        else if (Notification.permission === "granted") // if allowed and granted
        {
            this.createNotification();
        }
        else if (Notification.permission !== "denied") // request permission if they haven't denied previously
        {
            await Notification.requestPermission()
            if (Notification.permission === "granted")
            {
                this.createNotification();
            }
            else
            {
                alert("no permission to notify given");
            }
        }

        account.saveToStorage();
    }

    createNotification()
    {
        this.dateNotified = new Date();
        const notification = new Notification(`${this.text} - ${this.date.toDateString()}`);
    }
}

/**
 * Transaction class
 * Represents either income or expenses
 */
class Transaction
{
    /**
     * 
     * @param {string} text - Name of the transaction
     * @param {number} amount - How much money was involved in the transaction
     * @param {Date} date - When the transaction next happens
     * @param {Array} recurrance - How and when the transaction reoccurs, if at all. Empty if not.
     * - First element is a string with type of recurrance (i.e. "daily")
     *      - "daily" - Every X days
     *      - "monthly" - Every X months
     *      - "yearly" - Every X years
     *      - "specificDay" - The Xth day of every Yth month (i.e. the 1st day of every 2nd month (for every other month))
     *      - "specificDayOfWeek" - The Xth (weekday dropdown) of every Yth month (i.e. the 1st Tuesday of every other month)
     * - Second element is X value of recurrance (i.e. every 30 days, X = 30)
     * - Third element is Y value of recurrance (i.e. 2nd day of every 3rd month, Y = 30)
     * - Fourth element is weekday of recurrance (i.e. every tuesday, "Tuesday")
     * @param {Date} endDate - If reocurring, when the payment stops reocurring
     */
    constructor(text, amount, date, recurrance, endDate)
    {
        this.text = text;
        this.amount = amount;
        this.date = date
        this.recurrance = recurrance;
        this.endDate = endDate;
    }
}

let account = new Account();
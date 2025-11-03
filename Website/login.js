/**
 * @author Jeffrey Kotz
 * @license Zlib
 * @since 2025-10-5
 * @description this script handles login logic
 */

/**
 * Decrypt data given a key
 * @param {String} encryptedData data to decrypt
 * @param {String} key key given to decrypt data
 * @returns {String} result decrypted data
 */

function decrypt(encryptedData, key)
{
    let result;
    
    try // try to decrypt the data
    {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key)
        result = decrypted.toString(CryptoJS.enc.Utf8);
    }
    catch (e) // if data can't be decrypted set result to empty string
    {
        result = ""
    }

    // Return decrypted result
    return result;
}

/**
 * Try to load account from text, if text is invalid set account to
 * undefined
 * @param {String} text
 * @returns {Account} account Account after attempting to load
 */
function tryLoadAccount(text)
{
    let tempAccount = new Account()
    // try to load the data in JSON format
    try
    {
        const dataJSON = JSON.parse(text)
        tempAccount.load(dataJSON);
    }
    catch (e) // if can't load, then set account to undefined
    {
        tempAccount = null;
    } 
    
    return tempAccount;
}

/**
 * check if file given is a valid json file
 * @param {File} file check if file is a valid JSON file
 * @returns {bool} validFile boolean value indicating whether JSON file is valid
 */
function validJSONFile(file)
{
    let validFile = false;

    // If json file is given load it
    if (file)
    {
        // Check if valid file was given
        if (file.name.includes('.json'))
        {
            validFile = true;
        }
    }

    return validFile;
}

/**
 * login function triggered by login button.
 * if valid login take user to home page
 */
async function login()
{
    const fileInput = document.querySelector('#user-file');
    const errorText = document.querySelector('.error-text');

    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Load user file from input if file is given
    const file = fileInput.files[0];

    // if valid file was given verify account details
    if (validJSONFile(file))
    {
        fileInput.classList.remove('red-border');

        // Load and decrypt file data
        const fileText = await file.text();
        const decryptedText = decrypt(fileText, username + password);

        // Try and load data into account
        account = tryLoadAccount(decryptedText);

        // Validate user credentials
        // if name or username is incorrect then give invalid login
       if (account.name !== username || account.password !== password)
        {
            errorText.innerHTML = `Invalid Login, Please Try Again.`;
            errorText.classList.remove(`hidden`);

            usernameInput.classList.add('red-border');
            passwordInput.classList.add('red-border');
        }
        else // Correct login, save account and move to hompage
        {
            await account.saveToStorage();
            window.location.href = 'pages/home/index.html',true; //https://stackoverflow.com/questions/15759020/window-location-href-doesnt-redirect
        }
    }
    else // else load from storage
    {
        await account.loadFromStorage();
        
        // Validate user credentials
        // if name or username is incorrect then give invalid login
        if (account.name !== username || account.password !== password)
        {
            errorText.innerHTML = `Invalid Login, Please Try Again.`;
            
            errorText.classList.remove(`hidden`);
            usernameInput.classList.add('red-border');
            passwordInput.classList.add('red-border');
        }
        else // Correct login, save account and move to hompage
        {
            await account.saveToStorage();
            if (account.setup == false) {
                window.location.href = 'pages/setup/index.html',true;
            }
            else {
                 window.location.href = 'pages/home/index.html',true; //https://stackoverflow.com/questions/15759020/window-location-href-doesnt-redirect
            }
        }
    }
    // else // Invalid input file, put red border to indicate invalid file
    // {
    //     usernameInput.classList.remove('red-border');
    //     passwordInput.classList.remove('red-border');
    //     errorText.classList.add(`hidden`);

    //     fileInput.classList.add('red-border');
    // }
}




/**
 * TODO: input sanitization
 * 
 * Create account button is pressed, check if valid username/password
 * was given, create the account and send the user to the home page
 * as a new user
 */
async function createAccount()
{
    const errorText = document.querySelector('.error-text')
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const passwordConfirmInput = document.querySelector('#confirm-password');

    const username = usernameInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    // Tests for input of username
    if (username.length < 5 || username.length > 25)
    {

        errorText.classList.remove('hidden');
        
        if (username.length == 0) {
            errorText.innerHTML = 'Error: No UserName provided.';
        }
        else if (username.length < 5) {
            errorText.innerHTML = 'Error: UserName too short, must be 5 or more characters.';
        }
        else if (username.length > 25) {
            errorText.innerHTML = 'Error: UserName too long, must be 25 or fewer characters.';
        }

        usernameInput.classList.add('red-border');
        passwordInput.classList.remove('red-border');
        passwordConfirmInput.classList.remove('red-border');
    }
    // Tests for input of password
    else if (password.length < 5 || password.length > 25)
    {   
        errorText.classList.remove('hidden');

         if (password.length == 0) {
            errorText.innerHTML = 'Error: No PassWord provided.';
        }
        else if (password.length < 5) {
            errorText.innerHTML = 'Error: PassWord too short, must be 5 or more characters.';
        }
        else if (password.length > 25) {
            errorText.innerHTML = 'Error: PassWord too long, must be 25 or fewer characters.';
        }

        usernameInput.classList.remove('red-border');
        passwordInput.classList.add('red-border');
        passwordConfirmInput.classList.remove('red-border');
    }
    // If password and confirmation aren't equal then don't create the account
    else if (password !== passwordConfirm) 
    {
        errorText.classList.remove('hidden');
        errorText.innerHTML = `Error: Passwords Don't Match`;

        usernameInput.classList.remove('red-border');
        passwordInput.classList.add('red-border');
        passwordConfirmInput.classList.add('red-border');
    }
    else // create account of input username and password
    {
        // Wait for account to be saved before moving to home page
        account.name = username;
        account.password = password;

        //Setup page if account not setup
        //If for some odd reason setup is true, go to home page
        await account.saveToStorage();
               if (account.setup == false) {
            window.location.href = 'pages/setup/index.html',true;
        }
        else {
            window.location.href = 'pages/home/index.html',true;
        }
    }
}


/**
 * Toggle whethere new account creation is shown
 *  Login is hidden during creation
 *  Creation is hidden during login
 */
function toggleAccountCreation()
{
    // Unhide everything relevant to create account
    // for the creation of a new account
    const newAccountElements = document.querySelectorAll('.create');
    const loginButtons = document.querySelectorAll('.login');
    const errorElements = document.querySelectorAll('.red-border');
    const errorText = document.querySelector('.error-text')

    toggleElements(newAccountElements);
    toggleElements(loginButtons);
    hideErrors(errorElements);
    errorText.classList.add('hidden');
    
}

/**
 * Toggle visibility of elements given
 * @param {NodeListOf<Element>} html elements to toggle visibility of
 */
function toggleElements(elements)
{
    // For all elements given, toggle hidden status
    for (let i = 0; i < elements.length; i++)
    {
        elements[i].classList.toggle('hidden');
    }
}

/**
 * remove error indicators from elements
 * @param {NodeListOf<Element>} html elements to hide
 */
function hideErrors(elements)
{
    // For all elements given, remove red-border class
    for (let i = 0; i < elements.length; i++)
    {
        elements[i].classList.remove('red-border');
    }
}



/**
 * Main function, mainly here to control scope of variables
 * But also to tidy up the script. 
 * Primarily binds the buttons of the login page to their respective function
 */
function main()
{
    const loginButton = document.querySelector('#login');
    const newAccountButton = document.querySelector('#new-account');
    const createAccountButton = document.querySelector('#create-account')
    const backButton = document.querySelector('#back')

    loginButton.addEventListener('click', login);
    newAccountButton.addEventListener('click', toggleAccountCreation);
    backButton.addEventListener('click', toggleAccountCreation);
    createAccountButton.addEventListener('click', createAccount);
}

main(); // call main
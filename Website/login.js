/**
 * @author Jeffrey Kotz
 * @license Zlib
 * @since 2025-10-5
 * @description this script handles login logic
 */


/**
 * login function triggered by login button.
 * if valid login take user to home page
 * @param none
 * @returns nothing
 */
async function login()
{
    let account = new Account();
    const fileInput = document.querySelector('#user-file');
    const errorText = document.querySelector('.error-text');

    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Load user file from input if file is given
    const file = fileInput.files[0]

    let validFile = false;

    // If json file is given load it
    if (file)
    {
        // Check if valid file was given
        if (file.name.includes('.json'))
        {
            const fileJSON = await fileInput.files[0].text();
            const accountJSON = JSON.parse(fileJSON);
            account.load(accountJSON);
            validFile = true;
        }
        else // invalid file
        {
            fileInput.classList.add('red-border');
        }
    }
    else // invalid file
    {
        fileInput.classList.add('red-border');
    }

    // if valid file was given verify account details
    if (validFile)
    {
        if (account.name !== username)
        {
            errorText.innerHTML = `Invalid Login, Please Try Again.`
            fileInput.classList.add('red-border');
            errorText.classList.remove(`hidden`);
        }
        else if (account.password !== password)
        {
            errorText.innerHTML = `Invalid Login, Please Try Again.`
            fileInput.classList.add('red-border');
            errorText.classList.remove(`hidden`);
        }
        else // Correct login, save account and mvoe to hompage
        {
            await account.saveToStorage();
            window.location.href = '/pages/home';
        }
    }
}


/**
 * TODO: input sanitization
 * 
 * Create account button is pressed, check if valid username/password
 * was given, create the account and send the user to the home page
 * as a new user
 * @param none
 * @returns nothing
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

    // If no username is given don't create account
    if (username.length == 0)
    {
        errorText.classList.remove('hidden');
        errorText.innerHTML = `Error: Invalid Username`;

        usernameInput.classList.add('red-border');
        passwordInput.classList.remove('red-border');
        passwordConfirmInput.classList.remove('red-border');
    }
    // If no password is given don't create account
    else if (password.length == 0)
    {
        errorText.classList.remove('hidden');
        errorText.innerHTML = `Error: No Password`;

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
        let account = new Account(username, password);

        // Wait for account to be saved before moving to home page
        await account.saveToStorage();
        window.location.href = '/pages/home';
    }
}

/**
 * Toggle whethere new account creation is shown
 *  Login is hidden during creation
 *  Creation is hidden during login
 * @param none
 * @returns nothing
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
 * @param none
 * @returns nothing
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
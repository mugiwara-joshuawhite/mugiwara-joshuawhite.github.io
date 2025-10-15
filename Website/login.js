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
function login()
{
    window.location.href = '/pages/home';

    // TODO: actual login logic

    const accountJSON = {
        "name": "TestName",
        "password": "1234"
    }

    account.load(accountJSON);
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
    let newAccountElements = document.querySelectorAll(".create-account");

    for (let i = 0; i < newAccountElements.length; i++)
    {
        newAccountElements[i].classList.toggle('hidden');
    }

    let loginButtons = document.querySelectorAll(".login-button");

    for (let i = 0; i < loginButtons.length; i++)
    {
        loginButtons[i].classList.toggle('hidden');
    }
}

/**
 * Create account button is pressed, check if valid username/password
 * was given, create the account and send the user to the home page
 * as a new user
 * @param none
 * @returns nothing
 */
function createAccount()
{

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
    let loginButton = document.querySelector('#login');
    let newAccountButton = document.querySelector('#new-account');
    let createAccountButton = document.querySelector('#create-account')
    let backButton = document.querySelector('#back')

    loginButton.addEventListener('click', login);
    newAccountButton.addEventListener('click', toggleAccountCreation);
    backButton.addEventListener('click', toggleAccountCreation);
    createAccountButton.addEventListener('click', createAccount);
}

main(); // call main
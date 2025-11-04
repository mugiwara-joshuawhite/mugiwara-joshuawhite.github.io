/**
 * @author Joshua White
 * @license Zlib
 * @since 2025-10-13
 * @description Collection of functions that assist setup page
 */
function showOrHideIncomeSelect() {

    const streamSelect = document.querySelector('#stream-selector');

    if (streamSelect.classList.contains('hidden')) {
        streamSelect.classList.remove('hidden');
    } else {
        streamSelect.classList.add('hidden');
    }
}

function showOrHideExpenseSelect() {
    const expenseSelect = document.querySelector('#expense-selector');

    if (expenseSelect.classList.contains('hidden')) {
        expenseSelect.classList.remove('hidden');
    } else {
        expenseSelect.classList.add('hidden');
    }
}

function showOrHideDistributionSelect() {

    const distributionSelect = document.querySelector('#distribution-selector'); 

    if (distributionSelect.classList.contains('hidden')) {
        distributionSelect.classList.remove('hidden');
    } else {
        distributionSelect.classList.add('hidden');
    }
}

/**
 * Collection of functions that add data to user account
 */
function addStream() {

    //Data
    payDaySelector = document.querySelector('#acc-pay-day');
    payRateSelector = document.querySelector('#acc-pay-rate');
    payAmountSelector = document.querySelector('#acc-pay-amount');
    payNameSelector = document.querySelector('#acc-stream-name');
    errorText = document.querySelector('#stream-error-text');

    payDay = payDaySelector.value;
    payRate = payRateSelector.value;
    payAmount = payAmountSelector.value;
    payName = payNameSelector.value;

    //Add stream to account
    if (payDay === "") {
        errorText.innerText  = "Set a day of the week for pay!";
        errorText.classList.remove('hidden');
    }
    else if (payRate === "") {
        errorText.innerText  = "Set a pay rate!";
        errorText.classList.remove('hidden');
    }
    else if (payAmount === "" || isNaN(payAmount)) {
        errorText.innerText = "Issue with pay amount!";
        errorText.classList.remove('hidden');
    }
    else if (payName === "") {
        errorText.innerText = "Set a name for the stream!";
        errorText.classList.remove('hidden');
    }
    else {
        errorText.classList.add('hidden');

        account.streams.push([payName, payAmount, payRate, payDay]);

        //Reset inputs
        payDaySelector.value = '';
        payRateSelector.value = '';
        payAmountSelector.value = '';
        payNameSelector.value = '';
    }
}

function addExpense() {

    //Data
    expRateSelector = document.querySelector('#acc-expense-rate');
    expAmountSelector = document.querySelector('#acc-expense-amount');
    expNameSelector = document.querySelector('#acc-expense-name');
    errorText = document.querySelector('#expense-error-text');

    expRate = expRateSelector.value;
    expAmount = expAmountSelector.value;
    expName = expNameSelector.value;

    //Add expense to account
    if (expRate === "" || isNaN(expRate)) {
        errorText.innerText  = "Set a valid expense rate!";
        errorText.classList.remove('hidden');
    }
    else if (expAmount === "" || isNaN(expAmount)) {
        errorText.innerText = "Set a valid expense amount!";
        errorText.classList.remove('hidden');
    }
    else if (expName === "") {
        errorText.innerText = "Set a name for the expense!";
        errorText.classList.remove('hidden');
    }
    else {
        errorText.classList.add('hidden');

        account.expenses.push([expName, expAmount, expRate]);

        //Reset inputs
        expRateSelector.value = '';
        expAmountSelector.value = '';
        expNameSelector.value = '';
    }

}

function addDistribution() {
    //Data
    distNameSelector = document.querySelector('#acc-distribution-name');
    distPercentSelector = document.querySelector('#acc-distribution-percent');
    errorText = document.querySelector('#distribution-error-text');

    distName = distNameSelector.value;
    distPercent = distPercentSelector.value;

    //Only add distribution if all other distributions + this one <= 100%
    if (checkDistributionTotal(distPercent) > 100) {
        errorText.innerText = "Total distribution percentage cannot exceed 100%!";
        errorText.classList.remove('hidden');
    }
    else if (distName === "") {
        errorText.innerText = "Set a name for the distribution!";
        errorText.classList.remove('hidden');
    }
    else {
        errorText.classList.add('hidden');
        account.distributions.push([distName, distPercent]);

        //Reset inputs
        distNameSelector.value = '';
    }
}

/**
 * Activates upon clicking finish setup button
 * Ensures user has entered at least one of each piece of data and then
 * saves to storage and redirects to home page
 */
async function collect() {

    if (account.streams.length >= 1
        && account.expenses.length >= 1
        && account.distributions.length >= 1) 
    {
        //Account is now setup
        account.setup = true;

        //Save account to storage
        await account.saveToStorage();

        //Go to homepage
        window.location.href = "../home/index.html"
    }
}

/**
 * 
 * @param {int} newDistPercent - percentage of new distribution to be added 
 * @returns Total percentage of all distributions including new one
 */
function checkDistributionTotal(newDistPercent) {

    //Initialize
    let distributions = account.distributions;
    let totalPercent = 0;

    //Distributions are ordered as a 2d array [name, percent] so must pull just the percent
    for (let i = 0; i < distributions.length; i++) {
        totalPercent += parseInt(distributions[i][1]);
    }

    return totalPercent + parseInt(newDistPercent);
}

async function main() {

    //Load from storage
    await account.loadFromStorage();

    //Elements
    const incomeStreamButton = document.querySelector('#button-add-stream');    //Add Income Stream Button
    const submitButton = document.querySelector('#button-submit-stream');   //Submit Income Stream Button
    const expenseButton = document.querySelector('#button-add-expense');    //Add Expense Button
    const submitExpenseButton = document.querySelector('#button-submit-expense'); //Submit Expense Button
    const distributionButton = document.querySelector('#button-add-distribution');  //Add Distribution Button
    const submitDistributionButton = document.querySelector('#button-submit-distribution'); //Submit Distribution Button
    const distSlider = document.querySelector('#acc-distribution-percent'); //Distribution Percentage Slider
    const percentage = document.querySelector('#percent')   //Percentage Display

    const finishSetupButton = document.querySelector('#button-finish-setup'); //Finish Setup Button

    //Listeners
    incomeStreamButton.addEventListener('click', showOrHideIncomeSelect);   //Upon clicking "Add Income Stream" button
    submitButton.addEventListener('click', addStream);  //Upon clicking "Submit" button for Income Stream
    expenseButton.addEventListener('click', showOrHideExpenseSelect);   //Upon clicking "Add Expense" button
    submitExpenseButton.addEventListener('click', addExpense);  //Upon clicking "Submit" button for Expense
    distributionButton.addEventListener('click', showOrHideDistributionSelect); //Upon clicking "Add Distribution" button
    submitDistributionButton.addEventListener('click', addDistribution);    //Upon clicking "Submit" button for Distribution

    distSlider.addEventListener('input', function() {   //Upon using Distribution Slider
        percentage.innerHTML = distSlider.value + "%";
    });

    finishSetupButton.addEventListener('click', collect) //Upon clicking "Finish Setup" button

    //Initializes percentage display
    percentage.innerHTML = distSlider.value + "%";
}

main();
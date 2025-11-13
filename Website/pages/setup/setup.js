/**
 * @author Joshua White
 * @license Zlib
 * @since 2025-10-13
 * @description Collection of functions that assist setup page
 */


/**
 * Collection of functions that show/hide sections
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
    payNameSelector = document.querySelector('#acc-stream-name');   //Name of income stream
    payAmountSelector = document.querySelector('#acc-pay-amount');  //Amount for income stream
    payDaySelector = document.querySelector('#acc-pay-day');    //Next payday
    payRateTypeSelector = document.querySelector('#acc-pay-rate-type'); //Pay rate type
    payRateXSelector = document.querySelector('#acc-pay-rate-x');  //Pay rate amount x
    payRateYSelector = document.querySelector('#acc-pay-rate-y');  //Pay rate amount y
    errorText = document.querySelector('#stream-error-text');   //Error text @ bottom

    payName = payNameSelector.value;
    payAmount = payAmountSelector.value;
    payDay = new Date(payDaySelector.value.replace('-', '/'));
    payRecur = [payRateTypeSelector.value, 
                payRateXSelector.value,
                payRateYSelector.value];
    payEnd = new Date("9999/12/31");

    //Add stream to account
    if (payName === "") {
        errorText.innerText  = "Set a name for the stream!";
        errorText.classList.remove('hidden');
    }
    else if (payAmount == "" || isNaN(payAmount)) {
        errorText.innerText = "Set an amount for this stream!";
        errorText.classList.remove('hidden');
    }
    else if (payRecur.length < 3) {
        errorText.innerText = "Either the rate, or the blanks are empty!";
        errorText.classList.remove('hidden');
    }
    else {
        thisTrans = new Transaction(payName, payAmount, payDay, payRecur, payEnd);
        account.streams.push(thisTrans);
    }

    //Reset
    payNameSelector.value = '';
    payAmountSelector.value = '';
    payDaySelector.value = new Date(); //Empty Date returns current date
    payRateTypeSelector.value = '';
    payRateXSelector.value = '';
    payRateYSelector.value = '';
    showOrHideIncomeSelect();
}

function addExpense() {

    //Data
    expNameSelector = document.querySelector('#acc-expense-name');   //Name of income stream
    expAmountSelector = document.querySelector('#acc-expense-amount');  //Amount for income stream
    expDaySelector = document.querySelector('#acc-expense-duedate');    //Next payday
    expRateTypeSelector = document.querySelector('#acc-expense-rate-type'); //Pay rate type
    expRateXSelector = document.querySelector('#acc-expense-rate-x');  //Pay rate amount x
    expRateYSelector = document.querySelector('#acc-expense-rate-y');  //Pay rate amount y
    errorText = document.querySelector('#exp-error-text');   //Error text @ bottom

    expName = expNameSelector.value;
    expAmount = expAmountSelector.value;
    expDay = expDaySelector.value;
    expRecur = [expRateTypeSelector.value, 
                expRateXSelector.value,
                expRateYSelector.value];
    expEnd = new Date("9999-12-31");

    //Add stream to account
    if (expName === "") {
        errorText.innerText  = "Set a name for the expense!";
        errorText.classList.remove('hidden');
    }
    else if (expAmount == "" || isNaN(expAmount)) {
        errorText.innerText = "Set an amount for this expense!";
        errorText.classList.remove('hidden');
    }
    else if (expRecur.length == 0) {
        errorText.innerText = "Either the rate, or the blanks are empty!";
        errorText.classList.remove('hidden');
    }
    else {
        thisTrans = new Transaction(expName, expAmount, expDay, expRecur, expEnd);
        account.expenses.push(thisTrans);
    }

    //Reset
    expNameSelector.value = '';
    expAmountSelector.value = '';
    expDaySelector.value = new Date(); //Empty Date returns current date
    expRateTypeSelector.value = '';
    expRateXSelector.value = '';
    expRateYSelector.value = '';
    showOrHideExpenseSelect();

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

    //Reset
    distNameSelector.value = '';
    showOrHideDistributionSelect();
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

/*
Shows the Y recurrance option if selecting a type that necessitates it
*/
function showRecurranceOptionsStream() {

    payRateTypeSelector = document.querySelector('#acc-pay-rate-type'); //Pay rate type
    payRateYSelector = document.querySelector('#acc-pay-rate-y');  //Pay rate amount y
    payRateYLabel = document.querySelector('#label-acc-pay-rate-y');

    //Show Y selector if needed
    if (payRateTypeSelector.value == "specificDay" || payRateTypeSelector.value == "specificDayOfWeek") {
        payRateYSelector.classList.remove('hidden');
        payRateYLabel.classList.remove('hidden');
    }

    //Hide Y selector if user switches away
    else {
        payRateYSelector.classList.add('hidden');
        payRateYLabel.classList.add('hidden');
    }

}
function showRecurranceOptionsExpense() {

    expRateTypeSelector = document.querySelector('#acc-expense-rate-type'); //Pay rate type
    expRateYSelector = document.querySelector('#acc-expense-rate-y');  //Pay rate amount y
    expRateYLabel = document.querySelector('#label-acc-expense-rate-y');

    //Show Y selector if needed
    if (expRateTypeSelector.value == "specificDay" || expRateTypeSelector.value == "specificDayOfWeek") {
        expRateYSelector.classList.remove('hidden');
        expRateYLabel.classList.remove('hidden');
    }

    //Hide Y selector if user switches away
    else {
        expRateYSelector.classList.add('hidden');
        expRateYLabel.classList.add('hidden');
    }

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
/**
 * @author Roy Rodriguez
 * @author Joshua White
 * @since 2025/11/7
 * @description handles distributions editing
 */

let abortController = new AbortController();

function loadDistributions() {

    const DistributionArray = account.distributions;
    const distributionList = document.querySelector('.distribution-list'); 
    distributionList.innerHTML = ''; // clear current expenses displayed

    // For all expenses in the list, load a expense in the display
    for(let i = 0; i < DistributionArray.length; i++)
    {
        let distribution = document.createElement('li');
        let divider = document.createElement('div');
        let modifyButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        modifyButton.innerHTML = 'Modify Distribution';
        modifyButton.classList.add('modify-button');
        modifyButton.classList.add('hidden');

        // Bind modify button to modify expense at index
        modifyButton.addEventListener('click', function(){
            modifyDistribution(i);
        })

        //Set up delete button
        deleteButton.innerHTML = 'Delete Distribution';
        deleteButton.classList.add('delete-button');
        deleteButton.classList.add('hidden');

        // Bind delete button to delete expense at index
        deleteButton.addEventListener('click', function(){
            deleteWarning(i);
        })
        
        distribution.classList.add('categories');
        divider.classList.add('bar');

        // Add notication text and date to display
        // dude what even is this formatting
        distribution.innerHTML = `
        <p class="transaction-text"> ${DistributionArray[i][0]}
        <p class="amount-text"> ${DistributionArray[i][1]}%
        `;

        // Add expense to the list.
        distribution.innerHTML = 
            `<input type="checkbox" class="hidden checkbox" id="checkbox-${i}">`
            + distribution.innerHTML;
        distributionList.appendChild(distribution);
        distributionList.appendChild(modifyButton);
        distributionList.appendChild(deleteButton);
        distributionList.appendChild(divider);
    }
}

/**
 * Open window for adding Distribution
 */
function openAddDistribution()
{
    // Abort any operation pre-existing involving the expense and reset the controller
    // to prepare for any operation using the expense panel
    abortController.abort()
    abortController = new AbortController();

    // Obtian all buttons
    const createBox = document.querySelector(".create-box");
    const errorText = document.querySelector('.error-text');

    //Commented these out cause they weren't being used.
    //const distributionTextInput = document.querySelector('#distribution-text');
    //const distributionDateInput = document.querySelector('#expense-date');

    const addDistributionButton = document.querySelector('#add-distribution');
    const modifyDistributionButton = document.querySelector('#modify-distribution');

    // Reveal add button
    addDistributionButton.classList.remove('hidden');
    modifyDistributionButton.classList.add('hidden');

    // clear input fields on open
    // distributionTextInput.value = "";
    // distributionDateInput.value = "";

    // Hide error text, and reveal createbox when it's ready
    errorText.classList.add('hidden'); 
    createBox.classList.remove('hidden');
}

/**
 * Close window for adding distribution
 */
function closeAddDistribution() {
    const createBox = document.querySelector(".create-box");

    createBox.classList.add('hidden');
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

/**
 * 
 * @param {int} index where in the array to put distribution
 */
async function addDistribution(index) {

    //Input fields
    const distName = document.querySelector('#distribution-text');
    const distAmount = document.querySelector('#distribution-amount');

    //Error text
    const errorText = document.querySelector('#error-add');
    const xperc = document.querySelector('#percent');

    //Check for valid input
    if (distName.value != "") {
        if (checkDistributionTotal(distAmount.value) < 100) {
            if (Number.isInteger(index)) {
                account.distributions[index] = 
                    [distName.value, distAmount.value];
            }
            else {
                account.distributions.push(
                    [distName.value, distAmount.value]
                );
            }
             //Refresh
            distName.value = "";
            distAmount.value = 1;
            xperc.innerHTML = "1%";
            await account.saveToStorage();
            loadDistributions();
            closeAddDistribution();
        }
        else {
            errorText.innerHTML = "Your percentages will go over 100% of income if you add this! Delete some other distributions first.";
            errorText.classList.remove('hidden');
        }
    }
    else {
        //Literally why is it not showing
        errorText.innerHTML = "Missing value! Can't add distribution";
        errorText.classList.remove('hidden');
    }
}

/**
 * Show or hide modify Distribution buttons on the Distribution list
 */
function showOrHideModifyDistributions()
{
    const modifyButtons = document.querySelectorAll(".modify-button");
    const deleteButtons = document.querySelectorAll(".delete-button");

    for(let i = 0; i < modifyButtons.length; i++)
    {
        modifyButtons[i].classList.toggle('hidden');
    }

    //For some reason I couldn't do this in the other for loop
    //because of an out-of-bound error despite the fact they should
    //be the same length >:(
    for (let i = 0; i < deleteButtons.length; i++) {
        if (!deleteButtons[i].classList.contains('hidden')) {
            deleteButtons[i].classList.toggle('hidden');
        }
    }
}

/**
 * Open dialog to modify an existing Distribution
 */
function modifyDistribution(index)
{
    // Obtain expense buttons
    const addDistButton = document.querySelector('#add-distribution');
    const modifyDistButton = document.querySelector('#modify-distribution');

    // Hide add button and reveal modify button
    openAddDistribution();
    addDistButton.classList.add('hidden');
    modifyDistButton.classList.remove('hidden');

    // To modify expense we add expense to specified index
    modifyDistButton.addEventListener('click', function (){
        addDistribution(index)},
        { signal:abortController.signal }
    );
}

/**
 * Show or hide delete Distribution buttons on Distribution list
 */
function showOrHideDeleteDistributions()
{
    const deleteButtons = document.querySelectorAll(".delete-button");
    const modifyButtons = document.querySelectorAll(".modify-button");

    for(let i = 0; i < deleteButtons.length; i++)
    {
        deleteButtons[i].classList.toggle('hidden');
    }

    //For some reason I couldn't do this in the other for loop
    //because of an out-of-bound error despite the fact they should
    //be the same length >:(
    for (let i = 0; i < modifyButtons.length; i++) {
        if (!modifyButtons[i].classList.contains('hidden')) {
            modifyButtons[i].classList.toggle('hidden');
        }
    }
}

/**
 * Warns the user before deleting data at the specified index.
 */
function deleteWarning(index)
{
    const deleteDialog = document.querySelector('.delete-box');

    //Why is this text clickable?
    const deleteText = document.querySelectorAll('#delete-warning');
    
    deleteIndex = index;

    for(let i = 0; i < deleteText.length; i++)
    {
        deleteText[i].classList.remove('hidden');
    }

    deleteDialog.classList.remove('hidden');
}

async function deleteDistribution(deleteIndex) {
    console.log(account.distributions.splice(deleteIndex, 1));
    await account.saveToStorage();
    cancelWarning(); // Make warning dialog disappear
    loadDistributions();
    showOrHideDeleteDistributions(); // Keep the delete options open
}

/**
 * Removes the warning window for deleting a transaction.
 */
function cancelWarning()
{
    const deleteDialog = document.querySelector('.delete-box');
    const deleteText = document.querySelectorAll('#delete-warning');

    for(let i = 0; i < deleteText.length; i++)
    {
        deleteText[i].classList.add('hidden');
    }

    deleteDialog.classList.add('hidden');
}

async function main() {

    //Get account
    await account.loadFromStorage();

    //Elements
    const addButton = document.querySelector('#add-button'); //Add Distribution button
    const modifyButton = document.querySelector('#modify-button');  //Modify Distribution button
    const deleteButton = document.querySelector('#delete-button');  //Delete Distribution button
    const cancelDistributionButton = document.querySelector('#cancel-distribution');
    const distributionSlider = document.querySelector('#distribution-amount');
    const percentageText = document.querySelector('#percent');
    const addDistButton = document.querySelector('#add-distribution');
    const confirmDeleteButton = document.querySelector('#confirm-delete');
    const cancelDeleteButton = document.querySelector('#cancel-delete');

    //Listeners
    addButton.addEventListener('click', openAddDistribution);
    modifyButton.addEventListener('click', showOrHideModifyDistributions);
    deleteButton.addEventListener('click', showOrHideDeleteDistributions);
    cancelDistributionButton.addEventListener('click', closeAddDistribution);
    distributionSlider.addEventListener('input', function() {
        percentageText.innerHTML = distributionSlider.value + "%";
    });
    addDistButton.addEventListener('click', addDistribution);
    confirmDeleteButton.addEventListener('click', deleteDistribution);
    cancelDeleteButton.addEventListener('click', cancelWarning);

    //Load distributions on page open
    loadDistributions();

    //Initialize percentage
    percentageText.innerHTML = distributionSlider.value + "%";
}

//Call main
main();
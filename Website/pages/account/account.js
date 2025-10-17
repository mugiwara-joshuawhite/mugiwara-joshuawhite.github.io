/**
 * Link download button to download anchor element
 */
async function linkDownloadButton()
{
    const downloadAnchor = document.querySelector('#download-button')
    
    // Open file 
    const root = await navigator.storage.getDirectory();
    const accountFile = await root.getFileHandle(ACCOUNT_FILE_NAME);
    const readableFile = await accountFile.getFile();

    // Get link to readable account file and attach it to anchor
    // as it's link
    const fileURL = URL.createObjectURL(readableFile);
    downloadAnchor.href = fileURL;
}

/**
 * Clear user data and return to home page
 */
async function clearStorage()
{
    let account = new Account();
    await account.clearStorage();

    window.location.href = "/";
}


/**
 * Main function, controls scope of page elements
 */
async function main()
{
    const clearDataButton = document.querySelector('#clear-data')
    
    clearDataButton.addEventListener('click', clearStorage);


    linkDownloadButton();
}

main();
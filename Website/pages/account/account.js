/**
 * Link download button to download anchor element
 */
async function linkDownloadButton()
{
    const downloadAnchor = document.querySelector('#download-button')
    const key = account.name + account.password
    
    // Encrypt account and prepare it for download
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(account), key);
    const encryptedBlob = new Blob([encrypted], {type: "text/plain"});

    // Get link to readable account file and attach it to anchor
    // as it's link
    const fileURL = URL.createObjectURL(encryptedBlob);
    downloadAnchor.href = fileURL;
}

/**
 * Clear user data and return to home page
 */
async function clearStorage()
{
    await account.clearStorage();
    window.location.href = "/";
}


/**
 * Main function, controls scope of page elements
 */
async function main()
{
    await account.loadFromStorage();
    const clearDataButton = document.querySelector('#clear-data')
    
    clearDataButton.addEventListener('click', clearStorage);

    linkDownloadButton();
}

main();
/**
 * Link download button to download anchor element
 */
async function linkDownloadButton()
{
    const downloadAnchor = document.querySelector('#download-button')
    
    // Open file 
    const root = await navigator.storage.getDirectory();
    const accountFile = await root.getFileHandle("account.json");
    const readableFile = await accountFile.getFile();

    // Get link to readable account file and attach it to anchor
    const fileURL = URL.createObjectURL(readableFile);
    downloadAnchor.href = fileURL;
}

/**
 * Main function, controls scope of page elements
 */
function main()
{
    linkDownloadButton();
}

main();
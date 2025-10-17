async function linkDownloadButton()
{
    const downloadAnchor = document.querySelector('#download-button')
    
    // Open file 
    const root = await navigator.storage.getDirectory();
    const accountFile = await root.getFileHandle("account.json");
    const readableFile = await accountFile.getFile();

    // Get link to readable account file and attach it to anchor
    const fileURL = URL.createObjectURL(readableFile);
    const fileData = await readableFile.text();
    downloadAnchor.href = fileURL;
}

function main()
{
    linkDownloadButton();
}

main();
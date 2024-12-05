browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'downloadData') {
        const data = message.data;
        const blob = new Blob([data[0]], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        console.log(data)
    
        // Trigger the download
        browser.downloads.download({
            url: url,
            filename: data[1].replace("/","-").replace("/","-")+".csv",
            saveAs: true
        }).then(() => {
            console.log("Download initiated.");
        }).catch((error) => {
            console.error("Download failed:", error);
        });
    }
});
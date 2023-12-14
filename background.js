chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("bestbuy.ca/en-ca/search")) {
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            productPage: urlParameters.get("path"),
        });
    }
  });


// Fetching product spects
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchProductDetails') {
        const urls = request.urls;
        urls.forEach(url => {
            chrome.tabs.create({ url: url, active: false }, tab => {
                // Wait for the tab to load and then inject the content script
                chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
                    if (info.status === 'complete' && tabId === tab.id) {
                        chrome.tabs.executeScript(tab.id, {file: 'contentScript.js'}, () => {
                            // Optionally close the tab after scraping
                            chrome.tabs.remove(tab.id);
                        });
                        chrome.tabs.onUpdated.removeListener(onUpdated);
                    }
                });
            });
        });
    }
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processData") {
      processData(request.data);
    }
  });
  
  function processData(data) {
    // Process your data here
    let processedData = "Processed: " + data;
  
    // Store the processed data in chrome.storage.local
    chrome.storage.local.set({ "processedData": processedData }, function() {
      console.log('Data is stored in chrome.storage');
    });
  
    // Open compare.html in a new tab
    chrome.tabs.create({ url: 'compare.html' });
  }
  
  
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processUrls") {
      processData(request.data);
    }
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "processedData") {
        chrome.storage.local.set({ "processedData": message.data });
        chrome.tabs.create({ url: 'compare.html' });
    }
});

function processData(data) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "fetchData", urls: data });
    });
}

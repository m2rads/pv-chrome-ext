document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get("processedData", function(items) {
      if (!chrome.runtime.error) {
        console.log(items);
        if (items.processedData) {
          document.getElementById("message").textContent = items.processedData;
        } else {
          document.getElementById("message").textContent = "No data found";
        }
      }
    });
  });
  
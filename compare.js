document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get("processedData", function(items) {
    if (!chrome.runtime.error) {
      console.log(items);

      let messageDiv = document.getElementById("message");

      if (items.processedData && Array.isArray(items.processedData) && items.processedData.length > 0) {
        let list = document.createElement('ul');

        items.processedData.forEach(url => {
          let listItem = document.createElement('li');
          listItem.textContent = url;
          list.appendChild(listItem);
        });

        messageDiv.appendChild(list);
      } else {
        messageDiv.textContent = "No URLs found";
      }
    }
  });
  // chrome.storage.local.get("processedData", function(items) {
  //     console.log("Retrieved URLs in compare.js: ", items.processedData);
  // });
});

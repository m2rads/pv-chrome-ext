document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get({basket: []}, function(result) {
        let basket = result.basket;
        let list = document.getElementById('productList'); 
        if (list) {
            basket.forEach(productInfo => {
                let fullProductName = productInfo[1];
                let shortenedProductName = fullProductName.length > 10 ? fullProductName.substring(0, 10) + '...' : fullProductName;
                
                let listItem = document.createElement('li');
                listItem.textContent = shortenedProductName;

                list.appendChild(listItem);
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    let buttonContainer = document.getElementById('buttonContainer')
    if (buttonContainer) {
        buttonContainer.addEventListener('click', (event) => {
            if (event.target && event.target.id === 'clearStorage') {
                clearStorage();
            } else if (event.target && event.target.id === 'compare') {
                openComparisonTab();
            }
        });
    }
});

function clearStorage() {
    chrome.storage.sync.clear(() => {
        let list = document.getElementById('productList');
        if (list) {
            list.innerHTML = '';
        }
    });
}

function openComparisonTab() {
    // chrome.tabs.create({url: './compare.html'});
    chrome.runtime.sendMessage({ action: "processData", data: "Hello World" });
}


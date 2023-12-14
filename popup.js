const selectProduct = () => {
    console.log("product selected ")
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("popup is getting loaded")
    chrome.storage.sync.get({basket: []}, function(result) {
        let basket = result.basket;
        let list = document.getElementById('productList'); 

        basket.forEach(productInfo => {
            let fullProductName = productInfo[1];
            let shortenedProductName = fullProductName.length > 10 ? fullProductName.substring(0, 10) + '...' : fullProductName;
            
            let listItem = document.createElement('li');
            listItem.textContent = shortenedProductName;

            list.appendChild(listItem);
            console.log("item appended");
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('buttonContainer').addEventListener('click', (event) => {
        if (event.target && event.target.id === 'clearStorage') {
            clearStorage();
        } else if (event.target && event.target.id === 'compare') {
            openComparisonTab();
        }
    });
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
    chrome.tabs.create({url: './compare.html'});
}


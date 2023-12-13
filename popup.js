document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get({basket: []}, function(result) {
        let basket = result.basket;
        let list = document.getElementById('productList'); // An element with id 'productList' in your popup.html
        basket.forEach(productName => {
            let listItem = document.createElement('li');
            listItem.textContent = productName;
            list.appendChild(listItem);
        });
    });
});

const selectProduct = () => {
    console.log("product selected ")
}
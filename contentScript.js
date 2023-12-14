(() => {
    let currentPage;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, productPage } = obj;

        if (type === "NEW") { 
            currentPage = productPage;
            waitForElementToDisplay(".productsRow_DcaXn", 500);
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "fetchData") {
            // Process each URL in the array and collect promises
            let fetchPromises = message.urls.map(url => fetchDataFromUrl(url).then(processData));
    
            // Wait for all fetch operations to complete
            Promise.all(fetchPromises)
                .then(results => {
                    // Send the array of processed data back to background script
                    chrome.runtime.sendMessage({ action: "processedData", data: results });
                })
                .catch(error => console.error('Error processing data:', error));
        }
    });
    
    async function fetchDataFromUrl(url) {
        try {
            let response = await fetch(url);
            return await response.text();
        } catch (error) {
            console.error('Error fetching data:', error);
            return ''; // Return an empty string or handle error differently
        }
    }
    
    function processData(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
    
        const descriptionDiv = doc.querySelector('.description_1N8uX');
        if (descriptionDiv) {
            return descriptionDiv.textContent.trim();
        } else {
            return "Description not found";
        }
    }    
    
    const newProductPageLoaded = () => {
        let productsRow = document.querySelector(".productsRow_DcaXn");
        if (productsRow) {
            Array.from(productsRow.children).forEach((child, index) => {
                // Attach a checkbox for each product
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'selectProduct' + index;
                checkbox.name = 'selectProduct';
                checkbox.className = 'selectedProduct';
                checkbox.value = index; 
    
                checkbox.style.top = '5px';
                checkbox.style.left = '5px';
                checkbox.style.zIndex = '10';
    
                let label = document.createElement('label');
                label.htmlFor = 'selectProduct' + index;
                label.appendChild(document.createTextNode('Select Product ' + (index + 1)));
    
                child.prepend(checkbox);
                // child.appendChild(label);
    
                checkbox.addEventListener('change', (event) => {
                    let productName = child.querySelector('.productItemName_3IZ3c').innerText;
                    let productHref = child.querySelector('.link_3hcyN').href;
                    let productInfo = [index, productName, productHref];
    
                    chrome.storage.sync.get({basket: []}, function(result) {
                        let basket = result.basket;
    
                        if (event.target.checked) {
                            console.log('Product ' + (index + 1) + ' selected');
                            basket.push(productInfo);
                        } else {
                            console.log('Product ' + (index + 1) + ' deselected');
                            basket = basket.filter(item => item[0] !== index);
                        }
    
                        chrome.storage.sync.set({basket: basket});
                    });
                });
            });
        } else {
            console.log("Element not found");
        }
    }
    
    function waitForElementToDisplay(selector, time) {
        if(document.querySelector(selector) != null) {
            newProductPageLoaded();
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }

    newProductPageLoaded()
    
})();

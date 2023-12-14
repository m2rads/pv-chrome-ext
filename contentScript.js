(() => {
    let currentPage;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, productPage } = obj;

        if (type === "NEW") { 
            currentPage = productPage;
            waitForElementToDisplay(".productsRow_DcaXn", 500);
        }
    });


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
                    let productInfo = [index, productName, productHref]; // Include unique ID in productInfo
    
                    chrome.storage.sync.get({basket: []}, function(result) {
                        let basket = result.basket;
    
                        if (event.target.checked) {
                            console.log('Product ' + (index + 1) + ' selected');
                            basket.push(productInfo);
                        } else {
                            console.log('Product ' + (index + 1) + ' deselected');
                            // Remove the product based on unique ID
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

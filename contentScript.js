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
                checkbox.className = 'selectedProduct'
                checkbox.value = index;

                // checkbox.style.position = 'absolute';
                checkbox.style.top = '5px';
                checkbox.style.left = '5px';
                checkbox.style.zIndex = '10';
    
                let label = document.createElement('label');
                label.htmlFor = 'selectProduct' + index;
                label.appendChild(document.createTextNode('Select Product ' + (index + 1)));
    
                child.prepend(checkbox);
                // child.appendChild(label);
    
                checkbox.addEventListener('change', (event) => {
                    if (event.target.checked) {
                        console.log('Product ' + (index + 1) + ' selected');
                        // Add logic here for when a product is selected
                    } else {
                        console.log('Product ' + (index + 1) + ' deselected');
                        // Add logic here for when a product is deselected
                    }
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

})();

(() => {
    let currentPage;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, productPage } = obj;

        if (type === "NEW") { 
            currentPage = productPage;
            waitForElementToDisplay(".productsRow_DcaXn", 500);
        }
    });

    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //     if (message.action === "fetchData") {
    //         // Process each URL in the array and collect promises
    //         let fetchPromises = message.urls.map(url => fetchDataFromUrl(url).then(processData));
    
    //         // Wait for all fetch operations to complete
    //         Promise.all(fetchPromises)
    //             .then(results => {
    //                 chrome.runtime.sendMessage({ action: "processedData", data: results });
    //             })
    //             .catch(error => console.error('Error processing data:', error));
    //     }
    // });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "fetchData") {
            let fetchPromises = message.urls.map(url => fetchDataFromUrl(url).then(processData));
    
            Promise.all(fetchPromises)
                .then(results => {
                    // Once all fetch operations are complete, send all results to the API
                    sendDataToApi(results).catch(e => console.error('Error sending to API', e));
                    console.log("info sent to api")
    
                    // Then send processed data back to background.js
                    chrome.runtime.sendMessage({ action: "processedData", data: results });
                })
                .catch(error => console.error('Error processing data:', error));
        }
    
        return true;
    });

    async function sendDataToApi(data) {
        console.log(data)
        try {
            const response = await fetch('https://product-advisor.vercel.app/api/extension', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({productInfo: data})
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // const clonedResponse = response.clone();
            // const jsonData = await clonedResponse.json();
            // console.log(jsonData);
            
            return await response.json();
        } catch (error) {
            console.error('Error sending data to API:', error);
        }
    }    
    
    async function fetchDataFromUrl(url) {
        try {
            let response = await fetch(url);
            return await response.text();
        } catch (error) {
            console.error('Error fetching data:', error);
            return '';
        }
    }
    
    function processData(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const imgElement = doc.querySelector('.displayingImage_3xp0y > img');

        const productInfo = {
            productImg: imgElement?.src || '404',
            description: doc.querySelector('.description_1N8uX')?.textContent.trim() || '404',
            productAbout: extractContent(doc.querySelector('.productDescription_2WBlx')),
            whatsIncluded: extractContent(doc.querySelector('.boxContents_2Q4kV')),
            // productPrice: extractPrice(html),
            productName: doc.querySelector('.productName_2KoPa')?.textContent.trim() || '404'
        };
        
        if (productInfo) {
            return productInfo;
        } else {
            return "Description not found";
        }
    }    

    function extractPrice(html) {
        const priceRegex = /\$\d{1,3}(,\d{3})*(\.\d{2})?/g;
        const matches = html.match(priceRegex);
        // console.log("all the matches: ", matches)
        return matches && matches.length > 2 ? matches[2] : '404';
    }

    function extractContent(containerElement) {
        if (!containerElement) return 'Content not found';
    
        // Check if the container itself is a <ul>
        if (containerElement.tagName === 'UL') {
            const items = Array.from(containerElement.querySelectorAll('li'));
            return items.map(item => item.textContent.trim()).join(', ');
        }
    
        // Check if the container has a <ul> element
        const ulElement = containerElement.querySelector('ul');
        if (ulElement) {
            const items = Array.from(ulElement.querySelectorAll('li'));
            return items.map(item => item.textContent.trim()).join(', ');
        }
    
        // If there is no <ul>, look for <p> tags and concatenate their content
        const paragraphs = Array.from(containerElement.querySelectorAll('p'));
        return paragraphs.map(p => p.textContent.trim()).join(', ');
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

// document.addEventListener('DOMContentLoaded', function() {
//   chrome.storage.local.get("processedData", function(items) {
//     if (!chrome.runtime.error) {
//       console.log(items);

//       let messageDiv = document.getElementById("message");

//       if (items.processedData && Array.isArray(items.processedData) && items.processedData.length > 0) {
//         let list = document.createElement('ul');

//         items.processedData.forEach(url => {
//           let listItem = document.createElement('li');
//           listItem.textContent = url;
//           list.appendChild(listItem);
//         });

//         messageDiv.appendChild(list);
//       } else {
//         messageDiv.textContent = "No URLs found";
//       }
//     }
//   });
// });

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get("processedData", function(items) {
    if (!chrome.runtime.error && items.processedData) {
      let containerDiv = document.querySelector(".productCardContainer");
      let template = document.querySelector(".template");

      items.processedData.forEach(product => {
        let productCard = document.createElement('div');
        productCard.className = 'productCard';
        let productTemplate = template.content.cloneNode(true);

        // Populate Image, Name, Description
        productTemplate.querySelector('.productImg img').src = product.productImg || '#';
        productTemplate.querySelector('.productName h1').textContent = product.productName || 'No name available';
        productTemplate.querySelector('.productOverview p').textContent = product.description || 'No description available';

        // Populate About
        if (product.productAbout) {
          let aboutList = productTemplate.querySelector('.aboutList');
          let aboutItems = product.productAbout.split(',').slice(0, 5);
          aboutList.innerHTML = aboutItems.map(item => `<li>${item.trim()}</li>`).join('');
        } else {
          productTemplate.querySelector('.about').remove();
        }

        // Populate What's Included
        if (product.whatsIncluded) {
          let includedList = productTemplate.querySelector('.includedList');
          let includedItems = product.whatsIncluded.split(',').slice(0, 5);
          includedList.innerHTML = includedItems.map(item => `<li>${item.trim()}</li>`).join('');
        } else {
          productTemplate.querySelector('.included').remove();
        }

        // Append the product card to the container
        productCard.appendChild(productTemplate);
        containerDiv.appendChild(productCard);
      });
    } else {
      let messageDiv = document.getElementById("message");
      messageDiv.textContent = "No data found";
    }
  });
});


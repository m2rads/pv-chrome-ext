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
        productTemplate.querySelector('.productName h1').textContent = truncateText(product.productName, 30)  || 'No name available';
        productTemplate.querySelector('.productOverview p').textContent = truncateText(product.description, 100) || 'No description available';

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

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
  } else {
      return text;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let buttonContainer = document.querySelector('.chatButtonContainer')
  if (buttonContainer) {
      buttonContainer.addEventListener('click', (event) => {
          if (event.target && event.target.id === 'chotbot') {
            toggleChatbox();
          }
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Event listener for the close button in the chatbox header
  let chatbox = document.querySelector('#chatbox');
  if (chatbox) {
      chatbox.addEventListener('click', (event) => {
          if (event.target && event.target.id === 'closeChatButton') {
              toggleChatbox();
          }
      });
  }
})

document.addEventListener("DOMContentLoaded", () => {
  // Event listener for the send button in the chatbox input
  let chatboxInput = document.querySelector('.chatbox-input');
  if (chatboxInput) {
      chatboxInput.addEventListener('click', (event) => {
          if (event.target && event.target.id === 'sendButton') {
              // Implement the functionality to send the message
              sendMessage();
          }
      });
  }
})


function toggleChatbox() {
  var chatbox = document.getElementById('chatbox');
  if (chatbox.style.display === "none") {
      chatbox.style.display = "block";
      setTimeout(function(){ chatbox.classList.add('active'); }, 10);
  } else {
      chatbox.classList.remove('active');
      setTimeout(function(){ chatbox.style.display = "none"; }, 300);
  }
}

function sendMessage() {
  var input = document.getElementById('messageInput');
  var message = input.value.trim();

  if (message) {
      appendMessage("You", message);
      fetchChatbotResponse(message);
      input.value = "";
  }
}

function appendMessage(sender, message) {
  var messagesContainer = document.querySelector('.chatbox-messages');
  var messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message');
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function fetchChatbotResponse(message) {
  try {
      let response = await fetch('http://localhost:3000/api/extension', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ chatInput: message })
      });
      let data = await response.json();
      appendMessage("Best Pal", data.response);
  } catch (error) {
      console.error('Error:', error);
      appendMessage("Best Pal", "Sorry, I'm having trouble responding right now.");
  }
}


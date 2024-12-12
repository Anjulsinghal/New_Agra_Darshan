// Fetch and Render Tiffin Service Cards
const API_BASE_URL = "https://new-agra-darshan.onrender.com";
async function fetchTiffinServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tiffin-services`);
        const tiffinServices = await response.json();
        renderCards(tiffinServices);
    } catch (error) {
        console.error("Error fetching tiffin services:", error);
    }
}


// Function to truncate the description to the first 30 words
function truncateDescription(description) {
    const words = description.split(' '); // Split the text into words
    if (words.length > 30) {
        return words.slice(0, 30).join(' ') + '...'; // Take the first 30 words and add '...'
    }
    return description; // If description has 30 or fewer words, return it as is
}

// Render Cards
function renderCards(cards) {
    const food = document.getElementById("food-section");
    const transport = document.getElementById("transport-section");
    const tobacco = document.getElementById("tobacco-section");
    const chaupati = document.getElementById("jail-chaupati-section");
    const bandhu = document.getElementById("jail-bandhu-section");
    food.innerHTML = ""; // Clear existing cards
    transport.innerHTML = ""; // Clear existing cards
    tobacco.innerHTML = ""; // Clear existing cards
    chaupati.innerHTML = ""; // Clear existing cards
    bandhu.innerHTML = ""; // Clear existing cards

    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("blog-card");
        cardElement.innerHTML = `
             <div class="meta">
                 <div class="photo" style="background-image: url('${card.imageUrl}')"></div>
             </div>
             <div class="description">
                 <h1>${card.title}</h1>
                 <h2>${card.name}</h2>
                 <p>${card.tag}</p>
                <p>${truncateDescription(card.description1)}</p>
                 <button onclick="deleteCard('${card._id}')" class="delete-btn">Delete</button>
             </div>
         `;
        if (card.tag == "food") {
            food.appendChild(cardElement);
        }
        if (card.tag == "transport") {
            transport.appendChild(cardElement);
        }
        if (card.tag == "tobacco") {
            tobacco.appendChild(cardElement);
        }
        if (card.tag == "jail-caupati") {
            chaupati.appendChild(cardElement);
        }
        if (card.tag == "jail-bandu") {
            bandhu.appendChild(cardElement);
        }
    });
}

// Delete Card
async function deleteCard(cardId) {
    try {

        const isDelete = confirm("really want to delete this card?");
        if (isDelete) {
            const response = await fetch(
                `${API_BASE_URL}/api/tiffin-services/${cardId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                fetchTiffinServices(); // Refresh the list
            } else {
                console.error("Failed to delete card");
            }
        }

    } catch (error) {
        console.error("Error deleting card:", error);
    }
}

// Form Submission
document
    .getElementById("tiffinServiceForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/tiffin-services`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                // Reset form
                this.reset();
                // Refresh card list
                fetchTiffinServices();
            } else {
                console.error("Failed to submit tiffin service");
            }
        } catch (error) {
            console.error("Error submitting tiffin service:", error);
        }
    });

// Initial fetch of tiffin services
fetchTiffinServices();


// Check authentication status on page load
window.onload = function () {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
        alert('Session expired. Redirecting to login page.');
        window.location.href = 'adminLogin.html'; // Redirect to login page
    }
};

// Logout function
function logout() {
    localStorage.removeItem('isAuthenticated'); // Clear authentication
    window.location.href = 'adminLogin.html'; // Redirect to login page
}

// Ensure the session closes when the user navigates away
window.onbeforeunload = function () {
    localStorage.removeItem('isAuthenticated');
};
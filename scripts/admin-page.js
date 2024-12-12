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
        cardElement.classList.add("bg-white", "shadow-lg", "rounded-lg", "overflow-hidden", "w-full", "max-w-xs", "m-4");

        cardElement.innerHTML = `
            <div class="flex flex-col bg-white rounded-lg overflow-hidden">
                <div class="w-full h-48 bg-cover bg-center" style="background-image: url('${card.imageUrl}')"></div>
                <div class="p-4">
                    <h1 class="text-2xl font-semibold text-gray-800">${card.name}</h1>
                    <h2 class="text-xl text-gray-600">${card.title}</h2>
                    <p class="text-sm text-gray-500">${card.tag}</p>
                    <p class="text-base text-gray-700 mt-2">${truncateDescription(card.description1)}</p>
                    <button onclick="deleteCard('${card._id}')" class="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition duration-300">Delete</button>
                </div>
            </div>
        `;

        // Append the card to the respective section based on its tag
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
    window.location.href = '/index.html'; // Redirect to login page
}

// Ensure the session closes when the user navigates away
window.onbeforeunload = function () {
    localStorage.removeItem('isAuthenticated');
};



//script for gallery photos images

// Configuration
const config = {
    apiUrl: 'http://localhost:3000',
    maxBulkUpload: 5
};

// Utility Functions
const utils = {
    // Handle fetch response with consistent error parsing
    async handleFetchResponse(response) {
        try {
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'An unknown error occurred');
            }

            return result;
        } catch (parseError) {
            // If JSON parsing fails, try to get text and create an error
            const errorText = await response.text();
            throw new Error(`Response parsing error: ${errorText}`);
        }
    },

    // Display toast-like notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add(
            'fixed', 'top-4', 'right-4', 'p-4', 'rounded', 'z-50',
            type === 'success' ? 'bg-green-500' : 'bg-red-500',
            'text-white', 'transition-all', 'duration-300'
        );
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
};

// State Management
const state = {
    currentDeletionPublicId: null
};

// Gallery Management
const gallery = {
    element: document.getElementById('imageGallery'),
    loadingIndicator: document.getElementById('galleryLoadingIndicator'),
    errorMessage: document.getElementById('galleryErrorMessage'),

    async refresh() {
        this.loadingIndicator.classList.remove('hidden');
        this.errorMessage.textContent = '';
        this.element.innerHTML = '';

        try {
            const response = await fetch(`${config.apiUrl}/api/images`);
            const result = await utils.handleFetchResponse(response);

            if (result.images.length === 0) {
                this.element.innerHTML = '<p class="text-center text-gray-500 col-span-full">No images uploaded yet</p>';
                return;
            }

            this.element.innerHTML = result.images.map(img => `
                        <div class="relative bg-gray-100 p-2 rounded overflow-hidden shadow-md">
                            <img 
                                src="${img.url}" 
                                class="w-full h-48 object-cover rounded" 
                                alt="Uploaded Image"
                            />
                            <div class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white">
                                <button 
                                    class="delete-image-btn w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
                                    data-public-id="${img.publicId}"
                                >
                                    Delete
                                </button>
                            </div>
                            <p class="text-xs mt-1 truncate">Public ID: ${img.publicId}</p>
                        </div>
                    `).join('');

            // Attach delete event listeners
            this.element.querySelectorAll('.delete-image-btn').forEach(btn => {
                btn.addEventListener('click', this.showDeleteConfirmation.bind(this));
            });
        } catch (error) {
            this.errorMessage.textContent = `Failed to load gallery: ${error.message}`;
            utils.showNotification(error.message, 'error');
        } finally {
            this.loadingIndicator.classList.add('hidden');
        }
    },

    showDeleteConfirmation(event) {
        const publicId = event.target.getAttribute('data-public-id');
        state.currentDeletionPublicId = publicId;
        document.getElementById('confirmationModal').classList.remove('hidden');
    }
};

// Upload Handlers
const uploads = {
    async singleImage(event) {
        event.preventDefault();
        const fileInput = document.getElementById('singleImage');
        const resultDiv = document.getElementById('singleImageResult');

        if (!fileInput.files.length) {
            resultDiv.innerHTML = '<p class="text-red-500">Please select an image</p>';
            return;
        }

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        try {
            const response = await fetch(`${config.apiUrl}/api/images/upload`, {
                method: 'POST',
                body: formData
            });

            const result = await utils.handleFetchResponse(response);

            resultDiv.innerHTML = `
                        <p class="text-green-500">Upload Successful!</p>
                        <img src="${result.image.url}" class="max-w-full mx-auto mt-2 h-40 object-cover" />
                        <p>Public ID: ${result.image.publicId}</p>
                    `;

            utils.showNotification('Image uploaded successfully');
            gallery.refresh();
            fileInput.value = ''; // Clear file input
        } catch (error) {
            resultDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
            utils.showNotification(error.message, 'error');
        }
    },

    async bulkImages(event) {
        event.preventDefault();
        const fileInput = document.getElementById('bulkImages');
        const resultDiv = document.getElementById('bulkImageResult');

        if (!fileInput.files.length) {
            resultDiv.innerHTML = '<p class="text-red-500">Please select images</p>';
            return;
        }

        const formData = new FormData();
        const filesToUpload = Array.from(fileInput.files).slice(0, config.maxBulkUpload);
        filesToUpload.forEach(file => formData.append('images', file));

        try {
            const response = await fetch(`${config.apiUrl}/api/images/bulk-upload`, {
                method: 'POST',
                body: formData
            });

            const result = await utils.handleFetchResponse(response);

            resultDiv.innerHTML = result.images.map(img => `
                        <div class="bg-gray-100 p-2 rounded">
                            <img 
                                src="${img.url}" 
                                class="w-full h-40 object-cover rounded" 
                                alt="Uploaded Image"
                            />
                            <p class="text-xs mt-1 truncate">Public ID: ${img.publicId}</p>
                        </div>
                    `).join('');

            utils.showNotification(`${result.images.length} images uploaded successfully`);
            gallery.refresh();
            fileInput.value = ''; // Clear file input
        } catch (error) {
            resultDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
            utils.showNotification(error.message, 'error');
        }
    }
};

// Modal Management
const modal = {
    confirmationModal: document.getElementById('confirmationModal'),

    hide() {
        this.confirmationModal.classList.add('hidden');
        state.currentDeletionPublicId = null;
    },

    async confirmDelete() {
        if (!state.currentDeletionPublicId) return;

        try {
            const response = await fetch(`${config.apiUrl}/api/images/${state.currentDeletionPublicId}`, {
                method: 'DELETE'
            });

            await utils.handleFetchResponse(response);

            utils.showNotification('Image deleted successfully');
            gallery.refresh();
            this.hide();
        } catch (error) {
            utils.showNotification(error.message, 'error');
            this.hide();
        }
    }
};

// Event Listeners
document.getElementById('singleImageUploadForm').addEventListener('submit', uploads.singleImage);
document.getElementById('bulkImageUploadForm').addEventListener('submit', uploads.bulkImages);
document.getElementById('refreshGalleryBtn').addEventListener('click', () => gallery.refresh());
document.getElementById('cancelDeleteBtn').addEventListener('click', () => modal.hide());
document.getElementById('confirmDeleteBtn').addEventListener('click', () => modal.confirmDelete());

// Initial Load
gallery.refresh();

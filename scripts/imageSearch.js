/*
    University of Cologne
    BSI2 SoSe 2021
    Project: Brandberg
    Janik Lierfeld
*/

// Variables defined globally
let data = [];
// Cache DOM elements we'll use repeatedly
const outputDIV = document.getElementById('outputDIV');
const guideDIV = document.getElementById('guideDIV');
const modal = document.getElementById("modal");
const modalImg = document.getElementById("img-modal");
const captionText = document.getElementById("caption");
const serverPath = 'https://sandbox.hki.uni-koeln.de/internal/bsi-2021/Gruppen/ATeam/Bildergalerie/';

// Store the current images being displayed and current index
let currentImages = [];
let currentImageIndex = 0;

/*---------- JSON FILE LOADER ----------*/
// Replace XMLHttpRequest with modern fetch API
fetch('data/images.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jsonData => {
        data = jsonData;
    })
    .catch(error => {
        console.error('Error fetching image data:', error);
    });

/*---------- BUTTON EVENT LISTER ----------*/
document.getElementById("filterBtn").addEventListener("click", debounce(() => {
    // Executes filterImages() function
    filterImages(data);

    // Hide Guide DIV
    guideDIV.style.display = "none";
}, 300)); // Add debounce to prevent multiple rapid executions

/*---------- FILTER IMAGES ----------*/
function filterImages(data) {
    // Gorge
    const gorgeSelect = document.getElementById("gorgeSelect").value;

    // Filter - optimize by checking conditions first
    const filteredImages = data.filter(e => e && e.file && typeof e.file === 'string' && e.file.includes(gorgeSelect));

    output(filteredImages);
}

/*---------- OUTPUT ----------*/
function output(filteredImages) {
    // Store the current filtered images for modal navigation
    currentImages = filteredImages;
    
    // Clear output
    outputDIV.innerHTML = "";
    
    // Use DocumentFragment for batch DOM operations
    const fragment = document.createDocumentFragment();
    
    // Cache the length
    const imgArrayLength = filteredImages.length;

    for (let i = 0; i < imgArrayLength; i++) {
        const currentImage = filteredImages[i];
        const imageDIV = document.createElement('div');
        const imageContainer = document.createElement('div');
        const image = document.createElement('img');
        const imageCaption = document.createElement('p');

        // Fill Elements
        image.src = serverPath + currentImage.file;
        image.alt = currentImage.file.slice(0, currentImage.file.indexOf('.'));
        image.id = "image";
        image.loading = "lazy"; 
        image.dataset.index = i; // Store index for event delegation
        
        // Use original slicing method with error handling
        try {
            imageCaption.textContent = currentImage.file.slice(24, currentImage.file.indexOf('-0'));
            if (!imageCaption.textContent) {
                imageCaption.textContent = currentImage.file.split('/').pop();
            }
        } catch (error) {
            imageCaption.textContent = currentImage.file;
        }

        // Add error handling for image load failures
        image.onerror = () => {
            image.src = 'path/to/fallback-image.jpg';
            image.alt = 'Image could not be loaded';
        };

        // Assign Elements
        imageContainer.appendChild(image);
        imageDIV.appendChild(imageContainer);
        imageDIV.appendChild(imageCaption);
        fragment.appendChild(imageDIV);

        // Style
        imageDIV.classList.add('imageDIV');
        imageContainer.classList.add('img-hover-zoom')
    }
    
    // Append all elements at once
    outputDIV.appendChild(fragment);

    setupImageModal();
}

/*---------- IMAGE MODAL ----------*/
function setupImageModal() {
    // Simplified event delegation
    outputDIV.addEventListener('click', event => {
        const image = event.target.closest('img');
        if (image) {
            openModal(parseInt(image.dataset.index));
        }
    });

    // Add navigation buttons to modal if they don't exist
    if (!document.getElementById('prev-button')) {
        const navButtons = `
            <button id="prev-button" class="modal-nav-btn">❮</button>
            <button id="next-button" class="modal-nav-btn">❯</button>
        `;
        modal.insertAdjacentHTML('beforeend', navButtons);
        
        // Add styles via CSS class instead of inline styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-nav-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 2.5em;
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 10px 15px;
                cursor: pointer;
                z-index: 1001;
                transition: background 0.3s, transform 0.2s;
            }
            .modal-nav-btn:hover {
                background: rgba(0,0,0,0.8);
                transform: translateY(-50%) scale(1.05);
            }
            #prev-button { left: 10px; }
            #next-button { right: 10px; }
        `;
        document.head.appendChild(style);
    }

    // Setup event listeners
    document.getElementById('prev-button').onclick = () => navigateImages(-1);
    document.getElementById('next-button').onclick = () => navigateImages(1);
    document.querySelector('.close').onclick = closeModal;
    
    // Combined keyboard event listener
    document.addEventListener('keydown', event => {
        if (modal.style.display !== "block") return;
        
        switch(event.key) {
            case "Escape": closeModal(); break;
            case "ArrowLeft": navigateImages(-1); break;
            case "ArrowRight": navigateImages(1); break;
        }
    });
}

// Open modal with specific image
function openModal(index) {
    currentImageIndex = index;
    modal.style.display = "block";
    updateModalImage();
}

// Close modal
function closeModal() {
    modal.style.display = "none";
}

// Navigate images with direction (-1 for prev, 1 for next)
function navigateImages(direction) {
    if (currentImages.length <= 1) return;
    
    currentImageIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
    updateModalImage();
}

// Update modal image - simplified
function updateModalImage() {
    const currentImage = currentImages[currentImageIndex];
    
    // Fade effect
    modalImg.style.opacity = '0';
    
    // Update image source
    modalImg.src = serverPath + currentImage.file;
    
    // Update caption
    try {
        captionText.innerHTML = currentImage.file.slice(0, currentImage.file.indexOf('.'));
    } catch {
        captionText.innerHTML = currentImage.file;
    }
    
    // Restore opacity after small delay
    setTimeout(() => modalImg.style.opacity = '1', 100);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/*
    University of Cologne
    BSI2 SoSe 2021
    Project: Brandberg
    Janik Lierfeld
*/

// Variables defined globally
var data = [];

/*---------- JSON FILE LOADER ----------*/
var request = new XMLHttpRequest();
request.open('GET', 'data/images.json', true);
request.send();
console.log(request);

request.onload = function () {
    data = JSON.parse(request.response);
    console.log(data);
};

/*---------- BUTTON EVENT LISTER ----------*/
document.getElementById("filterBtn").addEventListener("click", (e) => {
    // Executes filterImages() function
    filterImages(data);

    // Hide Guide DIV
    document.getElementById("guideDIV").style.display = "none";
});

/*---------- FILTER IMAGES ----------*/
function filterImages(data) {
    // Gorge
    var gorgeSelect = document.getElementById("gorgeSelect").value;
    console.log("User has select: " + gorgeSelect);

    // Filter
    filteredImages = data.filter((e) => {
        return (e.file.slice(24, 27).startsWith(gorgeSelect));
    });

    console.log(filteredImages);
    output(filteredImages);
};

/*---------- OUTPUT ----------*/
function output(filteredImages) {
    // Variables
    var imageDIV;
    var image;
    var imageCaption;
    var outputDIV = document.getElementById('outputDIV')
    var serverPath = 'http://sandbox.hki.uni-koeln.de/internal/bsi-2021/Gruppen/ATeam/Bildergalerie/';

    // Clear output
    outputDIV.innerHTML = "";

    // For improved performance
    var imgArray = filteredImages.length

    for (let i = 0; i < imgArray; i++) {
        // Create Elements
        image = document.createElement('img');
        imageCaption = document.createElement('p');
        imageDIV = document.createElement('div');
        imageContainer = document.createElement('div');

        // Fill Elements
        image.src = serverPath + filteredImages[i].file;
        image.alt = filteredImages[i].file.slice(0, filteredImages[i].file.indexOf('.'));
        image.id = "image";
        imageCaption.textContent = filteredImages[i].file.slice(24, filteredImages[i].file.indexOf('-0'));

        // Assign Elements
        imageContainer.appendChild(image);
        imageDIV.appendChild(imageContainer);
        imageDIV.appendChild(imageCaption);
        outputDIV.appendChild(imageDIV);

        // Style
        imageDIV.classList.add('imageDIV');
        imageContainer.classList.add('img-hover-zoom')
    }

    imageModal();
};

/*---------- IMAGE MODAL ----------*/
function imageModal() {
    // Get the modal
    var modal = document.getElementById("modal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementsByTagName('img');
    var modalImg = document.getElementById("img-modal");
    var captionText = document.getElementById("caption");


    Array.from(img).forEach(item => {
        item.addEventListener('click', event => {
            modal.style.display = "block";
            modalImg.src = event.target.src;
            captionText.innerHTML = event.target.alt;
        })
    });

    // Get the <span> element that closes the modal
    var close = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    close.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks the ESC key, close the modal
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
}
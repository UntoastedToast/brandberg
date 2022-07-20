/*
    University of Cologne
    BSI1 WiSe 2020/2021
    Project: Brandberg
    Janik Lierfeld
*/


// Variables defined globally
var tableSites = [];
var arrayForSearch = [];
var filteredData = [];
var section;
var buttonArray = [];
var contentArray = [];


// EventListener that executes the loadDoc() function
// https://developer.mozilla.org/de/docs/Web/API/Window/DOMContentLoaded_event

document.addEventListener("DOMContentLoaded", function (e) {
    console.log("DOM fully loaded and parsed");
    loadDoc();
});


// Function to load the JSON file
function loadDoc() {
    var request = new XMLHttpRequest();
    request.responseType = 'json';

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            doc = request.response;
            console.log("The JSON file has been loaded: " + doc);
            tableSites = doc.TableOfSites.Coll;
            console.log("The array from the JSON file has been loaded: " + tableSites);
        }
    };

    request.open("GET", "data/TableOfSitesKoordinaten.json", true);
    request.send();
}



// Event Listener for filterBtn
document.getElementById("filterBtn").addEventListener("click", (e) => {
    // Clear filteredData
    filteredData.length = [];
    console.log("filteredData was cleared!")

    // Clear value from search box
    document.getElementById("searchBox").value = "";

    // Executes filterData() function
    filterData(tableSites);

    // Hide Guide DIV
    document.getElementById("guideDIV").style.display = "none";

    // Show the search box
    document.querySelector(".search-container").classList.remove("hidden");
});

// Function to filter the JSON file "TableOfSitesKoordinaten"

function filterData(tableSites) {

    /* The values of the selected select boxes are passed to a respective variable */

    // Gorge
    var gorgeSelect = document.getElementById("gorgeSelect").value;

    // Water Availability
    var waterSelect = document.getElementById("waterSelect").value;

    // Open Field
    var openfieldSelect = document.getElementById("openfieldSelect").value;

    // Figure Category
    var figurecategorySelect = document.getElementById("figurecategorySelect").value;


    /*  In this case, the filter() method was used, which creates a new array.
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

        Logical operators were used to ensure the shortest possible notation. This has the advantage that a complex filter system can be built up with little time expenditure.
        https://www.w3schools.com/js/js_comparisons.asp
        
        Explanation:
        !variable evaluates to true if the variable is falsy and false if the variable is truthy.
        variable === variable checks if there is a strict equality.
        !variable || (variable === variable) evaluates to the first truthy operand.
        (a) && (b) evaluates to the first falsy operand */

    // Select Boxes Filter
    filteredData = tableSites.filter((e) => {
        return (!gorgeSelect || e.Gorge === gorgeSelect) &&
            (!waterSelect || e.WaterAvailability === waterSelect) &&
            (!openfieldSelect || e.OpenField === openfieldSelect) &&
            (!figurecategorySelect || e.FigureCategory === figurecategorySelect);
    });

    console.log(filteredData);
    output(filteredData);

    // Var (Array) for search box
    var arrayForSearch = filteredData;

    // Search Box Filter
    document.getElementById("searchBox").addEventListener("keyup", (e) => {

        // The value is converted to lowercase (with toLowerCase();) for non-case sensitive search
        var searchString = e.target.value.toLowerCase();

        console.log("Entered characters in search field: " + searchString);

        filteredData = arrayForSearch.filter((e) => {
            return (e.Gorge.toLowerCase().includes(searchString)) ||
                (e.Site.toLowerCase().includes(searchString)) ||
                (e.ID.toLowerCase().includes(searchString)) ||
                (e.Publication.toLowerCase().includes(searchString)) ||
                (e.Discoverer.toLowerCase().includes(searchString));
        });

        // Pass filteredData to output() function
        output(filteredData);
    });
}



// Function for outputting the results of filtering
function output(filteredData) {

    // Output section
    outputDIV = document.getElementById("outputDIV");

    // Variable stores the hit count of the search
    var resultsCount = 0;

    // The section is emptied before output
    outputDIV.innerHTML = "";

    // filteredData.length; better performance
    var filteredArray = filteredData.length

    // The results of the filter function (the array) is entered into a for-loop
    for (let i = 0; i < filteredArray; i++) {

        // The number of hits in the search results is increased by +1
        resultsCount = resultsCount + 1;


        // HTML elements are created and assigned to a variable
        // This procedure was taken from the example "Ajax_Json_Collection2Beispiel"

        // HTML elements are created, classified by visible and non-visible elements
        /* So that the user is not confronted with too much information during filtering, 
           the elements are assigned to the visible and non-visible sections */
        var visibleElement = document.createElement("article");
        var nonvisibleElement = document.createElement("div");

        // The sections are subordinated to the outputDIV element
        var section = document.createElement("article");
        section.classList.add("resultsSection");

        // All HTML elements

        // Visible Elements
        var hGorgeName = document.createElement("h2");
        var pCoordinates = document.createElement("p");
        // Button
        var btnToggleContent = document.createElement("button");

        // Non-Visible Elements
        var pSiteNickname = document.createElement("p");
        var pDiscoverer = document.createElement("p");
        var pDateOfDiscovery = document.createElement("p");
        var pPublication = document.createElement("p");
        var pNumberofFigures = document.createElement("p");
        var pFigureCategory = document.createElement("p");
        var pPaintingLocation = document.createElement("p");
        var pNextSite = document.createElement("p");
        var pCardinalPoints = document.createElement("p");
        var pWaterAvailability = document.createElement("p");
        var pOpenField = document.createElement("p");
        var pLivingPlace = document.createElement("p");
        var pSpatiality = document.createElement("p");
        var pContext = document.createElement("p");
        var pViewfromSite = document.createElement("p");
        var pVisibility = document.createElement("p");
        var pEvidenceofHumanOccupation = document.createElement("p");
        var pDegradationofPaintings = document.createElement("p");
        var pQuantityofArtefacts = document.createElement("p");
        var pLithics = document.createElement("p");
        var pPottery = document.createElement("p");
        var pOES = document.createElement("p");
        var pBone = document.createElement("p");
        var pCharcoal = document.createElement("p");
        var pGrindingImplements = document.createElement("p");
        var pStoneStructures = document.createElement("p");
        var pMiscellenousArtefact = document.createElement("p");
        var pRemarks = document.createElement("p");



        // The previously created variables are assigned the respective text content from the JSON file

        // Visible Elements
        hGorgeName.textContent = filteredData[i].Site + ": " + filteredData[i].Gorge;
        pCoordinates.textContent = "LongitudeUTM: " + filteredData[i].LongitudeUTM + " Latitude UTM: " + filteredData[i].LatitudeUTM + " Elevation: " + filteredData[i].Elevation;
        btnToggleContent.innerHTML = "Show more";

        // Non-Visible Elements

        /* Where there is often no information in the JSON file,
        it is replaced with an if-else query with "N/A". */
        // Site Nickname
        if (filteredData[i].SiteNickname[0] != null) {
            pSiteNickname.textContent = "Site Nickname: " + filteredData[i].SiteNickname;
        } else {
            "Site Nickname: " + "N/A"
        };
        // Discoverer
        if (filteredData[i].Discoverer[0] != null) {
            pDiscoverer.textContent = "Discoverer: " + filteredData[i].Discoverer;
        } else {
            pDiscoverer.textContent = "Discoverer: " + "N/A";
        };
        // Date of Discovery
        if (filteredData[i].DateofDiscovery[0] != null) {
            pDateOfDiscovery.textContent = "Date of Discovery: " + filteredData[i].DateofDiscovery;
        } else {
            pDateOfDiscovery.textContent = "Date of Discovery: " + "N/A";
        };
        pPublication.textContent = "Publication: " + filteredData[i].Publication + " ISBN: " + filteredData[i].ISBN10;
        pNumberofFigures.textContent = "Number of Figures: " + filteredData[i].NumberofFigures;
        pFigureCategory.textContent = "Figure Category: " + filteredData[i].FigureCategory;
        pPaintingLocation.textContent = "Painting Location: " + filteredData[i].PaintingLocation;
        pNextSite.textContent = "Next Site: " + filteredData[i].NextSite;
        pCardinalPoints.textContent = "Cardinal Points: " + filteredData[i].CardinalPoints;
        pWaterAvailability.textContent = "Water Availability: " + filteredData[i].WaterAvailability;
        pOpenField.textContent = "Open Field: " + filteredData[i].OpenField;
        pLivingPlace.textContent = "Living Place: " + filteredData[i].LivingPlace;
        pSpatiality.textContent = "Spatiality: " + filteredData[i].Spatiality;
        pContext.textContent = "Context: " + filteredData[i].Context;
        pViewfromSite.textContent = "View from Site: " + filteredData[i].ViewfromSite;
        pVisibility.textContent = "Visibility: " + filteredData[i].Visibility;
        pEvidenceofHumanOccupation.textContent = "Evidence of Human Occupation " + filteredData[i].EvidenceofHumanOccupation;
        pDegradationofPaintings.textContent = "Degradation of Paintings: " + filteredData[i].DegradationofPaintings;
        pQuantityofArtefacts.textContent = "Quantity of Artefacts: " + filteredData[i].QuantityofArtefacts;
        pLithics.textContent = "Lithics: " + filteredData[i].Lithics;
        pPottery.textContent = "Pottery: " + filteredData[i].Pottery;
        pOES.textContent = "O.E.S.: " + filteredData[i].OES;
        pBone.textContent = "Bone: " + filteredData[i].Bone;
        pCharcoal.textContent = "Charcoal: " + filteredData[i].Charcoal;
        pGrindingImplements.textContent = "Grinding Implements: " + filteredData[i].GrindingImplements;
        pStoneStructures.textContent = "Stone Structures: " + filteredData[i].StoneStructures;
        pMiscellenousArtefact.textContent = "Miscellenous Artefact: " + filteredData[i].MiscellenousArtefact;
        if (filteredData[i].Remarks[0] != null) {
            pRemarks.textContent = "Remarks: " + filteredData[i].Remarks;
        } else {
            pRemarks.textContent = "Remarks: " + "N/A";
        };

        // Assign elements visibleElement
        visibleElement.appendChild(hGorgeName);
        visibleElement.appendChild(pCoordinates);

        // Assign elements nonvisibleElement
        nonvisibleElement.appendChild(pSiteNickname);
        nonvisibleElement.appendChild(pDiscoverer);
        nonvisibleElement.appendChild(pDateOfDiscovery);
        nonvisibleElement.appendChild(pPublication);
        nonvisibleElement.appendChild(pNumberofFigures);
        nonvisibleElement.appendChild(pFigureCategory);
        nonvisibleElement.appendChild(pPaintingLocation);
        nonvisibleElement.appendChild(pNextSite);
        nonvisibleElement.appendChild(pCardinalPoints);
        nonvisibleElement.appendChild(pWaterAvailability);
        nonvisibleElement.appendChild(pOpenField);
        nonvisibleElement.appendChild(pLivingPlace);
        nonvisibleElement.appendChild(pSpatiality);
        nonvisibleElement.appendChild(pContext);
        nonvisibleElement.appendChild(pViewfromSite);
        nonvisibleElement.appendChild(pVisibility);
        nonvisibleElement.appendChild(pEvidenceofHumanOccupation);
        nonvisibleElement.appendChild(pDegradationofPaintings);
        nonvisibleElement.appendChild(pQuantityofArtefacts);
        nonvisibleElement.appendChild(pLithics);
        nonvisibleElement.appendChild(pPottery);
        nonvisibleElement.appendChild(pOES);
        nonvisibleElement.appendChild(pBone);
        nonvisibleElement.appendChild(pCharcoal);
        nonvisibleElement.appendChild(pGrindingImplements);
        nonvisibleElement.appendChild(pStoneStructures);
        nonvisibleElement.appendChild(pMiscellenousArtefact);
        nonvisibleElement.appendChild(pRemarks);

        // Assign elements section
        section.appendChild(visibleElement);
        section.appendChild(nonvisibleElement);
        section.appendChild(btnToggleContent);

        // Assign section to outputDIV
        outputDIV.appendChild(section);

        // Dispalay = "none" for nonvisibleElement
        nonvisibleElement.style.display = "none";

        // Each button and content is added to the array to be accessed later in the "toggleContent" function
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
        buttonArray.push(btnToggleContent);
        contentArray.push(nonvisibleElement);

    } // for-loop END


    // The hit count of the search
    document.getElementById("resultsCountDIV").innerHTML = "<p>Your search returned " + "<b>" + resultsCount + "</b>" + " results.</p>";

    // Capture the position of btnToggleContent by a for-loop and pass itself to the toggleContent function
    for (let iButton = 0; iButton < buttonArray.length; iButton++) {
        buttonArray[iButton].addEventListener('click', function (iButton) {
            toggleContent(iButton, buttonArray[iButton]);
        }.bind(this, iButton));
    }

} // Output() Function END

// Function to show "nonvisibleElement"
function toggleContent(iCurrentButton, currentButton) {

    // The counter of the "contentArray" is compared with the current "iButton"
    for (let iArray = 0; iArray < contentArray.length; iArray++) {
        if (iArray === iCurrentButton) {
            if (contentArray[iArray].style.display === "none") {
                contentArray[iArray].style.display = "block";
                currentButton.innerHTML = "Show less";
            } else if (contentArray[iArray].style.display === "block") {
                contentArray[iArray].style.display = "none";
                currentButton.innerHTML = "Show more";
            }
        }
    }
}
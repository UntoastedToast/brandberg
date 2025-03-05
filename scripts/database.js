/*
    University of Cologne
    BSI1 WiSe 2020/2021
    Project: Brandberg
    Janik Lierfeld
    Modernized version
*/

// Use an IIFE to avoid global variables
(function() {
    // State variables
    let tableSites = [];
    let filteredData = [];
    const buttonArray = [];
    const contentArray = [];
    
    // DOM elements
    const outputDIV = document.getElementById("outputDIV");
    const resultsCountDIV = document.getElementById("resultsCountDIV");
    const guideDIV = document.getElementById("guideDIV");
    const searchBox = document.getElementById("searchBox");
    const searchContainer = document.querySelector(".search-container");
    const filterBtn = document.getElementById("filterBtn");
    
    // Configuration
    const DATA_URL = "data/TableOfSitesKoordinaten.json";
    const SEARCH_DEBOUNCE_MS = 300;
    
    // Initialize the application when DOM is fully loaded
    document.addEventListener("DOMContentLoaded", init);
    
    function init() {
        console.log("DOM fully loaded and parsed");
        loadData();
        setupEventListeners();
    }
    
    // Load data from JSON file using fetch API
    async function loadData() {
        try {
            showLoading(true);
            const response = await fetch(DATA_URL);
            
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.status}`);
            }
            
            const data = await response.json();
            tableSites = data.TableOfSites.Coll;
            console.log("Data loaded successfully:", tableSites.length, "records");
        } catch (error) {
            console.error("Error loading data:", error);
            showErrorMessage("Failed to load data. Please try again later.");
        } finally {
            showLoading(false);
        }
    }
    
    function setupEventListeners() {
        // Setup filter button
        filterBtn.addEventListener("click", handleFilterButtonClick);
        
        // Setup search with debounce
        searchBox.addEventListener("keyup", debounce(handleSearch, SEARCH_DEBOUNCE_MS));
    }
    
    function handleFilterButtonClick() {
        // Clear filteredData
        filteredData = [];
        
        // Clear search box
        searchBox.value = "";
        
        // Apply filters to data
        applyFilters(tableSites);
        
        // Hide guide and show search
        guideDIV.style.display = "none";
        searchContainer.classList.remove("hidden");
    }
    
    function applyFilters(data) {
        // Get filter values
        const gorgeSelect = document.getElementById("gorgeSelect").value;
        const waterSelect = document.getElementById("waterSelect").value;
        const openfieldSelect = document.getElementById("openfieldSelect").value;
        const figurecategorySelect = document.getElementById("figurecategorySelect").value;
        
        // Filter the data
        filteredData = data.filter(item => 
            (!gorgeSelect || item.Gorge === gorgeSelect) &&
            (!waterSelect || item.WaterAvailability === waterSelect) &&
            (!openfieldSelect || item.OpenField === openfieldSelect) &&
            (!figurecategorySelect || item.FigureCategory === figurecategorySelect)
        );
        
        renderResults(filteredData);
    }
    
    function handleSearch(event) {
        const searchString = event.target.value.toLowerCase();
        console.log("Search term:", searchString);
        
        if (!filteredData.length) return;
        
        const searchResults = filteredData.filter(item => 
            item.Gorge.toLowerCase().includes(searchString) ||
            item.Site.toLowerCase().includes(searchString) ||
            item.ID.toLowerCase().includes(searchString) ||
            item.Publication.toLowerCase().includes(searchString) ||
            item.Discoverer.toLowerCase().includes(searchString)
        );
        
        renderResults(searchResults);
    }
    
    function renderResults(results) {
        // Clear previous results
        outputDIV.innerHTML = "";
        buttonArray.length = 0;
        contentArray.length = 0;
        
        // Update count
        resultsCountDIV.innerHTML = `<p>Your search returned <b>${results.length}</b> results.</p>`;
        
        // Render each result
        results.forEach(item => renderResultItem(item));
        
        // Setup toggle buttons
        setupToggleButtons();
    }
    
    function renderResultItem(item) {
        // Create section elements
        const section = createElement('article', { className: 'resultsSection' });
        const visibleElement = createElement('article');
        const nonvisibleElement = createElement('div', { style: 'display: none' });
        const btnToggleContent = createElement('button', { textContent: 'Show more' });
        
        // Add visible content
        visibleElement.appendChild(createElement('h2', { 
            textContent: `${item.Site}: ${item.Gorge}`
        }));
        visibleElement.appendChild(createElement('p', { 
            textContent: `LongitudeUTM: ${item.LongitudeUTM} Latitude UTM: ${item.LatitudeUTM} Elevation: ${item.Elevation}`
        }));
        
        // Add non-visible content
        addDetailField(nonvisibleElement, "Site Nickname", item.SiteNickname[0]);
        addDetailField(nonvisibleElement, "Discoverer", item.Discoverer[0]);
        addDetailField(nonvisibleElement, "Date of Discovery", item.DateofDiscovery[0]);
        addDetailField(nonvisibleElement, "Publication", `${item.Publication} ISBN: ${item.ISBN10}`);
        addDetailField(nonvisibleElement, "Number of Figures", item.NumberofFigures);
        addDetailField(nonvisibleElement, "Figure Category", item.FigureCategory);
        addDetailField(nonvisibleElement, "Painting Location", item.PaintingLocation);
        addDetailField(nonvisibleElement, "Next Site", item.NextSite);
        addDetailField(nonvisibleElement, "Cardinal Points", item.CardinalPoints);
        addDetailField(nonvisibleElement, "Water Availability", item.WaterAvailability);
        addDetailField(nonvisibleElement, "Open Field", item.OpenField);
        addDetailField(nonvisibleElement, "Living Place", item.LivingPlace);
        addDetailField(nonvisibleElement, "Spatiality", item.Spatiality);
        addDetailField(nonvisibleElement, "Context", item.Context);
        addDetailField(nonvisibleElement, "View from Site", item.ViewfromSite);
        addDetailField(nonvisibleElement, "Visibility", item.Visibility);
        addDetailField(nonvisibleElement, "Evidence of Human Occupation", item.EvidenceofHumanOccupation);
        addDetailField(nonvisibleElement, "Degradation of Paintings", item.DegradationofPaintings);
        addDetailField(nonvisibleElement, "Quantity of Artefacts", item.QuantityofArtefacts);
        addDetailField(nonvisibleElement, "Lithics", item.Lithics);
        addDetailField(nonvisibleElement, "Pottery", item.Pottery);
        addDetailField(nonvisibleElement, "O.E.S.", item.OES);
        addDetailField(nonvisibleElement, "Bone", item.Bone);
        addDetailField(nonvisibleElement, "Charcoal", item.Charcoal);
        addDetailField(nonvisibleElement, "Grinding Implements", item.GrindingImplements);
        addDetailField(nonvisibleElement, "Stone Structures", item.StoneStructures);
        addDetailField(nonvisibleElement, "Miscellenous Artefact", item.MiscellenousArtefact);
        addDetailField(nonvisibleElement, "Remarks", item.Remarks[0]);
        
        // Build section
        section.appendChild(visibleElement);
        section.appendChild(nonvisibleElement);
        section.appendChild(btnToggleContent);
        outputDIV.appendChild(section);
        
        // Track buttons and content for toggle functionality
        buttonArray.push(btnToggleContent);
        contentArray.push(nonvisibleElement);
    }
    
    function setupToggleButtons() {
        for (let i = 0; i < buttonArray.length; i++) {
            buttonArray[i].addEventListener('click', function() {
                toggleContent(i, buttonArray[i]);
            });
        }
    }
    
    function toggleContent(index, button) {
        const content = contentArray[index];
        if (content.style.display === "none") {
            content.style.display = "block";
            button.textContent = "Show less";
        } else {
            content.style.display = "none";
            button.textContent = "Show more";
        }
    }
    
    // Helper functions
    
    function createElement(tag, options = {}) {
        const element = document.createElement(tag);
        Object.entries(options).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element[key] = value;
            }
        });
        return element;
    }
    
    function addDetailField(parent, label, value) {
        const displayValue = value !== null && value !== undefined ? value : "N/A";
        parent.appendChild(createElement('p', { 
            textContent: `${label}: ${displayValue}`
        }));
    }
    
    function showLoading(isLoading) {
        // Implementation would depend on your UI, but could toggle a loading spinner
        console.log(isLoading ? "Loading data..." : "Loading complete");
    }
    
    function showErrorMessage(message) {
        // Display error to user - implementation depends on your UI
        alert(message);
    }
    
    // Debounce utility for search input
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
})();
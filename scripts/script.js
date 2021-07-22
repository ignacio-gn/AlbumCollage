import * as lib from "./helpers.js";
import * as thread from "./thread_local.js";

/* TODO - BEFORE RELEASE
- Implement downloading functionality

TODO - MAYBE
- Fix query loading to match request
- Delete img size input
- Add labels for column and row inputs, relocate them

TODO - OPTIONAL
- Implement random
*/

// Global variables ############################################################
let settings = thread.DEF_SETTINGS;
let img_arr = thread.DEF_IMGARR;
let img_selected;
let dragged;

// Build JS functions ##########################################################
// Main document loading =======================================================
document.addEventListener("DOMContentLoaded", build);
function build() {
    buildSubmitButton();
    buildSearchButton();
    buildTestButton();
    buildImgGrid(thread.DEF_IMGARR, thread.DEF_SETTINGS);
}

// Build Buttons ###############################################################
// Button: Submit settings =====================================================
function buildSubmitButton() {
    let button = document.querySelector("#settings_button");
    button.onclick = () => {
        let new_settings = lib.getSettings();
        if (new_settings) {
            settings = new_settings;
        }
        img_arr = lib.updateImageArray(settings);
        buildImgGrid(img_arr, settings);
    }
}

// Button: Submit search query =====================================================
function buildSearchButton() {
    let button = document.querySelector("#search_btn");
    button.onclick = () => {
        let search_query = lib.getSearchQuery();
        lib.clearImageArray();
        lib.getAlbumCovers(search_query);
        implicitlyWait();
    }
}

// Button: Get mbid's image ====================================================
function buildTestButton() {
    // Local variables
    let url="https://ia801602.us.archive.org/23/items/mbid-f6483d43-aa10-4131-b594-9ce882970130/index.json";
    let callback = function(content) {
        console.log(content.images[0].thumbnails.large);
    }
    let btn = document.querySelector("#test_button");
    // Build button
    btn.onclick = () => {
        //lib.loadXMLDoc(url, callback);
        console.log("global: ", lib.global_image_array);
    }
}


// Build Grid divisions ########################################################
// Grid: Populate image grid ===================================================
function buildImgGrid(imgArray, settings) {
    // Clear previous grid
    let previous_grid = document.querySelectorAll("#image-grid-row");
    previous_grid.forEach(item => item.remove());

    // Define new grid
    let img_grid = document.getElementById("img-grid");

    // Iterate thorugh rows
    for (let row_idx = 0; row_idx < settings.n_rows; row_idx ++) {
        // Define local row and its classes
        let local_row = document.createElement("div");
        local_row.className = "d-flex justify-content-center align-items-center";
        local_row.id = "image-grid-row";

        // Iterate through columns
        for (let col_idx = 0; col_idx < settings.n_cols; col_idx ++) {

            // Define local img and attributes
            let local_img = document.createElement("img");
            local_img.className = "album-cover";
            local_img.style = `width: ${settings.img_size}px; height: ${settings.img_size}px;`;
            local_img.draggable = "true";
            local_img.dataset.toggle = "modal";
            local_img.dataset.target = "#searchModal";
            local_img.onclick = function() {
                img_selected = local_img;
            }

            // Try to define source image
            let src = imgArray[row_idx][col_idx];
            if (!src) {
                src = "static/stock_empty.png";
            }
            local_img.src = src;

            // Append img element to row
            local_row.appendChild(local_img);
        }

        // Append row element to grid
        img_grid.appendChild(local_row);
    }
}

// Query Grid: Populate query grid =============================================
function buildQueryGrid(queryArray) {
    // Clear previous grid
    lib.clearSearchQuery();

    // Define grid
    let query_grid = document.getElementById("query-grid");

    // Iterate thorugh img elements
    for (let row_idx = 0; row_idx < thread.DEF_QUERY.n_rows; row_idx++) {
        // Define local row and its attributes
        let local_row = document.createElement("div");
        local_row.className = "d-flex justify-content-center align-items-center";
        local_row.id = "query-row";

        for (let col_idx = 0; col_idx < thread.DEF_QUERY.n_cols && row_idx * thread.DEF_QUERY.n_cols + col_idx < queryArray.length; col_idx ++) {
            let i = row_idx * thread.DEF_QUERY.n_cols + col_idx;
            // Define local img and attributes
            let local_img = document.createElement("img");
            local_img.className = "query-img";
            local_img.style = `width: ${settings.img_size}px; height: ${settings.img_size}px;`;
            local_img.dataset.dismiss = "modal";
            // Try to define source image
            let src;
            try {
                src = queryArray[i];
            }
            catch (TypeError) {
                src = "static/stock_empty.png";
            }
            local_img.src = src;
            // Add replace functionality
            local_img.onclick = function() {
                // Update src
                img_selected.src = src;
            }

            // Appendimg element to row
            local_row.appendChild(local_img);
        }
        // Append row element to grid
        query_grid.appendChild(local_row);
    }
}

// Build Drag Events ###########################################################
/*
Some functions are taken from this link, even though they are edited to fit my needs
https://developer.mozilla.org/en-US/docs/Web/API/Document/dragstart_event
*/
// Dragstart ===================================================================
document.addEventListener("dragstart",function(event) {
    // Register dragged element
    dragged = event.target;
    // Change element style
    event.target.style.opacity = 0.7;
}, false);

// Dragend =====================================================================
document.addEventListener("dragend", function(event) {
    // Reset element style
    event.target.style.opacity = 1;
    event.target.style.width = `${settings.img_size}px`;
    event.target.style.height = `${settings.img_size}px`;
    event.target.style.padding = "0";
}, false);

// Dragover ====================================================================
document.addEventListener("dragover", function(event) {
    // Prevent default on dragover
    event.preventDefault();
}, false);

// Dragenter ===================================================================
document.addEventListener("dragenter", function(event) {
    // Change cover style when dragged over
    if (event.target.className == "album-cover") {
        event.target.style.padding = "2px";
    }
}, false);

// Dragleave ===================================================================
document.addEventListener("dragleave", function(event) {
    // Reset style of dropzone when exited
    if (event.target.className == "album-cover") {
        event.target.style.padding = "0";
    }
}, false);

// Drop ========================================================================
document.addEventListener("drop", function(event) {
    // Prevent default on drop
    event.preventDefault();
    // Call drop function on album cover
    if (event.target.className == "album-cover") {
        lib.swapOnDrop(event.target, dragged);
    }
})


// Async API response waiting ##################################################
// Check for API response ======================================================
function checkAPIResponse() {
    if (lib.global_image_array.length > 0) {
        console.log("API responded");
        buildQueryGrid(lib.global_image_array)
    }
    else {
        implicitlyWait();
    }
}

// ImplicitlyWait (async) ======================================================
function implicitlyWait() {
    setTimeout(checkAPIResponse, 1000)
}

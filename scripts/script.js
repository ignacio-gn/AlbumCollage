import * as lib from "./helpers.js";
import * as thread from "./thread_local.js";

// Global variables ############################################################
let settings = thread.DEF_SETTINGS;
let img_arr = thread.DEF_IMGARR;
let dragged;

// Build JS functions ##########################################################
// Main document loading =======================================================
document.addEventListener("DOMContentLoaded", build);
function build() {
    buildSubmitButton();
    lib.getAlbumCovers("In A Million Years");
    buildImgGrid(thread.DEF_IMGARR, thread.DEF_SETTINGS);
}

// Build Buttons ###############################################################
// Button: Submit settings =====================================================
function buildSubmitButton() {
    let button = document.querySelector("#settings_button");
    button.onclick = () => {
        let new_settings = lib.getSettings();
        settings = new_settings;
        buildImgGrid(img_arr, settings);
    }
}

// Button: Get mbid's image ====================================================
function buildTestButton() {
    // Local variables
    let url="https://ia800606.us.archive.org/9/items/mbid-5c5f37c6-01c2-36e8-a53d-a7d5be988e7b/index.json";
    let callback = function(content) {
        document.getElementById("outp").src = content.images[0].thumbnails.large;
    }
    let btn = document.querySelector("#test_button")
    // Build button
    btn.onclick = () => {
        lib.loadXMLDoc(url, callback);
    }
}


// Build Grid div ##############################################################
// Grid: Populate image grid ===================================================
function buildImgGrid(imgArray, settings) {
    // Clear previous grid
    let previous_grid = document.querySelectorAll(".album-cover");
    previous_grid.forEach(item => item.remove());

    // Define new grid
    let img_grid = document.getElementById("img-grid");

    // Iterate thorugh rows
    for (let row_idx = 0; row_idx < settings.n_rows; row_idx ++) {
        // Define local row and its classes
        let local_row = document.createElement("div");
        local_row.className = "d-flex justify-content-center align-items-center";

        // Iterate through columns
        for (let col_idx = 0; col_idx < settings.n_cols; col_idx ++) {
            // Define local img and attributes
            let local_img = document.createElement("img");
            local_img.className = "album-cover";
            local_img.style = `width: ${settings.img_size}px; height: ${settings.img_size}px;`;
            local_img.draggable = "true";
            local_img.ondragstart = "alert(event)";
            // Try to define source image
            let src = imgArray[row_idx][col_idx];
            if (!src) {
                src = "static/stock_empty.png";
            }
            local_img.src = src;

            // Append image element to row
            local_row.appendChild(local_img);
        }

        // Append row element to grid
        img_grid.appendChild(local_row);

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

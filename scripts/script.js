import * as lib from "./helpers.js";
import * as thread from "./thread_local.js";

// ################ Global variables ################
let settings = thread.DEF_SETTINGS;
let img_arr = thread.DEF_IMGARR;

// ############### Build JS functions ###############
// Main document loading
document.addEventListener("DOMContentLoaded", build);
function build() {
    buildSubmitButton();
    lib.getAlbumCovers("In A Million Years");
    buildImgGrid(thread.DEF_IMGARR, thread.DEF_SETTINGS);
}

// Button: Submit settings
function buildSubmitButton() {
    let button = document.querySelector("#settings_button");
    button.onclick = () => {
        let new_settings = lib.getSettings();
        settings = new_settings;
        alert(settings.n_rows);
        buildImgGrid(img_arr, settings);
    }
}

// Button: Get mbid's image
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



// Grid: Populate image grid
function buildImgGrid(imgArray, settings) {
    // Define grid
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
            local_img.src = imgArray[row_idx][col_idx];
            local_img.className = "album-cover";
            local_img.style = `width: ${settings.img_size}px; height: ${settings.img_size}px;`;
            // Append image element to row
            local_row.appendChild(local_img);
        }
        // Append row element to grid
        img_grid.appendChild(local_row);

    }
}

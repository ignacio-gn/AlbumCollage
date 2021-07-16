import * as lib from "./helpers.js";

// ############### Build JS functions ###############
// Main document loading
document.addEventListener("DOMContentLoaded", build);
function build() {
    buildSubmitButton();
    buildTestButton();
    lib.getAlbumCovers("In A Million Years");
}

// Button: Submit settings
function buildSubmitButton() {
    let button = document.querySelector("#settings_button");
    button.onclick = () => {
        let settings = lib.getSettings();
        alert(settings.n_rows);
    }
}

// Button: Get mbid's image
function buildTestButton() {
    // Local variables
    let url="https://ia601802.us.archive.org/29/items/mbid-7c0a7da8-2210-40b7-a03e-9bd3b460c6ac/index.json";
    let callback = function(content) {
        document.getElementById("outp").src = content.images[0].image;
    }
    let btn = document.querySelector("#test_button")
    // Build button
    btn.onclick = () => {
        lib.loadXMLDoc(url, callback);
    }
}


/*
// Grid: Populate image grid
function buildImgGrid(imgArray) {
    for (let row_idx = 0; row_idx < imgArray.length; row_idx ++) {
        for (let col_idx = 0; col_idx < imgArray[0].length; col_idx ++) {

        }
    }
}
*/

import * as thread from "./thread_local.js";

// Global variables ############################################################
export let global_image_array = [];


// Button functionality ########################################################
// Get settings ================================================================
export function getSettings() {
    let outp = {
        "n_rows": document.querySelector("#n_rows").value,
        "n_cols": document.querySelector("#n_cols").value,
        "img_size": document.querySelector("#img_size").value
    };

    // Check for invalid inputs
    for (let key in outp) {
        if (outp[key] < 1) {
            alert("Invalid settings");
            return false;
        }
    }
    return outp;
}


// Get search query ============================================================
export function getSearchQuery() {
    let outp = document.querySelector("#search_query").value;
    return outp;
}


// Music Query #################################################################
// Load XML response as JSON ===================================================
export function loadXMLDoc(url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            let responseText = this.responseText;
            let responseJSON = JSON.parse(responseText);
            callback(responseJSON);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}


// Get URL's response as XML from query ========================================
export function getAlbumCovers(str) {
    // Preprocess query
    let query = str.replace(' ', '_');

    // Local varibales
    let mbids = [];
    let limit = thread.DEF_QUERY.n_rows * thread.DEF_QUERY.n_cols;

    // Get URL response
    const query_url = `https://musicbrainz.org/ws/2/release?query=${query}&limit=${limit}`;
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Execute function on successfull request
            mbids = getMBIDs(this);
            return getImgSources(mbids)
        }
    };
    // Send request
    xhttp.open("GET", query_url, true);
    xhttp.send();
}


// Get list of mdIDs from xml object ===========================================
export function getMBIDs(xml) {
    // Local variables
    let xmlDoc = xml.responseXML;
    let mbids = xmlDoc.getElementsByTagName("release");
    let outp = [];

    // Iterate through each mbid, populate output
    for (let i = 0; i < mbids.length; i ++) {
        let local_mbid = mbids[i];
        outp.push(local_mbid.id);
    }

    return outp;
}

// Get image sources from array ================================================
function getImgSources(mbids) {
    // Local variables
    let callback = function(content) {
        global_image_array.push(content.images[0].thumbnails.large);
    }

    // Populate output
    for (let i = 0; i < mbids.length; i ++) {
        let local_id = mbids[i];
        let local_url = `https://coverartarchive.org/release/${local_id}`;
        loadXMLDoc(local_url, callback)
    }
}


// Image grid functionality ####################################################
// Drop: Swap items ============================================================
export function swapOnDrop(item1, item2) {
    let src1 = item1.src;
    let src2 = item2.src;
    // Switch
    item1.src = src2;
    item2.src = src1;
    // Reset style
    item1.style.padding = "0";
    item2.style.padding = "0";
}

// Get location of item in 2-dimensional array
export function updateImageArray(settings) {
    // Local Variables
    let n_cols = Number(settings.n_cols);
    let n_rows = Number(settings.n_rows);
    let img_rows = document.querySelectorAll("#image-grid-row");
    let outp = [];

    // Populate new array
    for (let row_idx = 0; row_idx < n_rows; row_idx ++) {
        // Define local rows
        let outp_row = [];
        let local_row;
        try {
            local_row = [...img_rows[row_idx].querySelectorAll(".album-cover")]
                .map(item => item.src);
        }
        catch (TypeError) {
            local_row = [];
        }

        for (let col_idx = 0; col_idx < n_cols; col_idx ++) {
            // Define local image
            let local_img = local_row[col_idx];
            if (!local_img) {
                local_img = "static/stock_empty.png";
            }
            // Append img to row
            outp_row.push(local_img);
        }
        // Append row to output
        outp.push(outp_row);
    }
    return outp;
}


// Search Query functionality ####################################################
// Clear image array
export function clearImageArray() {
    global_image_array = [];
}

// Clear search query
export function clearSearchQuery() {
    let previous_rows = document.querySelectorAll("#query-row");
    previous_rows.forEach(item => item.remove());

}

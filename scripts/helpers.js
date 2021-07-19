import * as thread from "./thread_local.js";
let global_image_array = [];
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
            return outp = {
                n_rows: thread.DEF_ROWS,
                n_cols: thread.DEF_COLS,
                img_size: thread.DEF_IMGSIZE
            };
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

function getImgSources(mbids) {
    // Local variables
    let callback = function(content) {
        global_image_array.push(content.images[0].thumbnails.large);
        console.log("imgsources: ", global_image_array)
    }

    // Populate output
    for (let i = 0; i < mbids.length; i ++) {
        let local_id = mbids[i];
        let local_url = `https://coverartarchive.org/release/${local_id}`;
        loadXMLDoc(local_url, callback)
    }
}

// Grid functionality ##########################################################
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

// Search query
// Clear search query
export function clearSearchQuery() {
    let previous_grid = document.querySelectorAll(".query-img");
    previous_grid.forEach(item => item.remove());
}

export function clearImageArray() {
    global_image_array = [];
}

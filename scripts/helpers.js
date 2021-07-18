import * as thread from "./thread_local.js";

// ########################### Button functionality ############################
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

// ################################ Music Query ################################
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

    // Get URL response
    const query_url = `https://musicbrainz.org/ws/2/release?query=${query}&limit=10`;
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Execute function on successfull request
            getMBIDs(this);
        }
    };
    // Send request
    xhttp.open("GET", query_url, true);
    xhttp.send();
}

// Get list of mdIDs from xml object ===========================================
function getMBIDs(xml) {
    // Local variables
    let xmlDoc = xml.responseXML;
    let mbids = xmlDoc.getElementsByTagName("release");
    let outp = [];

    // Iterate through each mbid, populate output
    for (let i = 0; i < mbids.length; i ++) {
        let local_mbid = mbids[i];
        outp.push(local_mbid.id);
    }

    // Return output
    console.log(outp);
}

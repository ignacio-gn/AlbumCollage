

// ############### Button functionality ###############
// Get settings
export function getSettings() {
    let outp = {
        "n_rows": document.querySelector("#n_rows").value,
        "n_cols": document.querySelector("#n_cols").value,
        "img_size": document.querySelector("#img_size").value
    };
    return outp;
}

// MUSIC QUERY
// Load XML response as JSON
export function loadXMLDoc(url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            let responseText = this.responseText;
            let responseJSON = JSON.parse(responseText)
            callback(responseJSON);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

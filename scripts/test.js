function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
function callback(text) {
    console.log(text)
}
let URL = "https://ia601802.us.archive.org/29/items/mbid-7c0a7da8-2210-40b7-a03e-9bd3b460c6ac/index.json"
httpGetAsync(URL, callback)

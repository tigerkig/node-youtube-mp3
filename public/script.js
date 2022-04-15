var browser = browser || chrome;

// local deployment endpoints
// const server_endpoint = 'https://tracktiger.herokuapp.com/'
// const download_endpoint = 'https://tracktiger.herokuapp.com/download/'
// const get_info_endpoint = 'https://tracktiger.herokuapp.com/getInfo/'

const server_endpoint = 'http://localhost:3000/'
const download_endpoint = 'http://localhost:3000/download/'
const get_info_endpoint = 'http://localhost:3000/getInfo/'
const url_text_input = document.getElementById("url-text-input");

window.onload = () => {
    var form = document.querySelector("form");
    form.addEventListener("submit", getSongInfo, false);
};

/**
 * Sends song url to backend and in response gets song info (title, thumbnail, author) and displays it onto UI
 * @param {Event} e
 */
async function getSongInfo(e) {
    e.preventDefault();

    const full_url = get_info_endpoint + "?" + new URLSearchParams({ url: url_text_input.value });

    let res = await fetch(full_url);
    let data = await res.json();

    var link = document.createElement("a");
    link.download = "";
    link.target = "_blank";

    // Construct the URI
    link.href = `${server_endpoint}${data.songPath}`;
    document.body.appendChild(link);
    link.click();

    // Cleanup the DOM
    document.body.removeChild(link);

}
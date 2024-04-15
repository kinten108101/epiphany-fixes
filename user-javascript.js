const hostname2css = {
    "developer.mozilla.org": "developer-mozilla",
    "www.youtube.com": "youtube",
    "developer.apple.com": "developer-apple",
    "docs.rs": "rust-docs",
    "react.dev": "react-dev"
};

const { hostname, href } = window.location;

function run() {
    const classname = hostname2css[hostname];
    if (classname === undefined) return;
    const body = document.getElementsByTagName("body")[0];
    if (!body) return;
    body.classList.add([classname]);
}

function run_archive_box() {
    if (!href.includes("archive")) return;
    const body = document.getElementsByTagName("body")[0];
    if (!body) return;
    body.classList.add(["archive-box"]);
}

run();
run_archive_box();

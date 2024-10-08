import { fromHTML } from "./utils.js";
import * as origins from "./origins/index.js";
import "./index.scss";

const hostname2init = {};

for (const xkey in origins) {
    const x = origins[xkey];
    const name = String(x.initName).replaceAll("_dot_", ".");
    hostname2init[name] = x;
}

const registerWithInitMap = (func) => {
    if (!("name" in func) || typeof func["name"] !== "string") throw new Error;
    const { name } = func;
    if (!name.includes("init_")) throw new Error;
    const hostname = name.substring(5).replaceAll("_dot_", ".");
    hostname2init[hostname] = func;
};

 const dialogAbout = fromHTML(`
    <dialog style="position: fixed; top: calc(50vh - 50%);">
        <p>Wtf??</p>
    </dialog>
`);

const onabout = () => {
    dialogAbout.showModal();
};

const attachBanner = () => {
    const body = document.getElementsByTagName("body")[0];
    if (!body) return;
    const collision = fromHTML(`
        <div style="display: block; min-height: 64px;"></div>
    `);
    body.prepend(collision);
    
    body.prepend(dialogAbout);
    
    const banner = fromHTML(`
        <div class="bg-accent" style="z-index: 9999; position: fixed; top: 0px; min-width: 100vw; min-height: 64px; display: grid; grid-template-rows: 1fr; grid-template-columns: 1fr max-content;">
            <div style="grid-row-start: 1; grid-column-start: 1; grid-column: 1 / -1; display: flex; justify-content: center; align-items: center;">
                <span class="text-accent" style="font-weight: 600; font-size: 1em; font-family: Cantarell;">Web page may use extensive resources</span>
            </div>
            <div style="grid-row-start: 1; grid-column-start: 2; display: flex; justify-content: center; align-items: center;">
                <gtk-button onclick="onabout()" style="margin-right: 8px;"></gtk-button>
            </div>
        </div>
    `);
    body.appendChild(banner);
};

registerWithInitMap(function init_harelang_dot_org() {
    attachBanner();
});

registerWithInitMap(function init_www_dot_youtube_dot_com() {
    attachBanner();
});

registerWithInitMap(function init_discord_dot_com() {
    attachBanner();
});

registerWithInitMap(function init_www_dot_messenger_dot_com() {
    attachBanner();
});

window.customElements.define("gtk-button", class C extends HTMLElement {
    static template = (() => {
        const element = document.createElement('template');
        element.innerHTML = `
            <button class="bg-button" style="border: none; border-radius: 6px; padding-left: 16px; padding-right: 16px;">
                <span class="text-accent" style="font-weight: bold; font-size: 1em; font-family: Cantarell;">Exit</span>
            </button>
        `;
        return element.content;
    })();
    
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(C.template.cloneNode(true));
    }
});

const { hostname, href } = window.location;

const reduce = (x) => {
    if (x.indexOf("VitePress") !== -1) return "VitePress";
    return "";
};

function run() {
    const body = document.getElementsByTagName("body")[0];
    if (!body) return;
    (() => {
        const classname = hostname;
        if (classname === undefined) return;
        body.classList.add([classname]);
    })();
    (() => {
        const SSGenerator = document.getElementsByTagName("meta")?.namedItem("generator")?.content;
        if (typeof SSGenerator !== "string") return;
        const classname = (() => {
            switch (reduce(SSGenerator)) {
                case "VitePress":
                    return "vitepress";
                default:
                    console.log("generator not found")
                    return "";
            }
        })();
        if (classname === "") return;
        body.classList.add([classname]);
    })();
    (() => {
        const init = hostname2init[hostname];
        if (init === undefined) return;
        init();
    })();
}

function run_archive_box() {
    if (!href.includes("archive")) return;
    const body = document.getElementsByTagName("body")[0];
    if (!body) return;
    body.classList.add(["archive-box"]);
}

run();

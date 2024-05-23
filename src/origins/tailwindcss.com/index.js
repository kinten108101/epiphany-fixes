export default function() {
    (() => {
        const updateBubble = Array.from(document.querySelectorAll("a:has(> strong)"))
            .find(x => x.getAttribute("href").includes("/blog/tailwindcss"));
        if (updateBubble === undefined) return;
        updateBubble.classList.add(["truncate"]);
    })();
}

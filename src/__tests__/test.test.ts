const { fetchText } = require("../../dist/Util");

(async () => {
    const a = await fetchText("https://soundcloud.com/search?q=nwantiti");
    const func = (v) => a.split("<noscript><ul>")[v];
    for (let i = 0; i < a.split("<li><h2><a href=").length; i++) {
        console.log(func(i).split("</ul><ul>")[1].split("</ul></noscript>")[0]);
    }
})();

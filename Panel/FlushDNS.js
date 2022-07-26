/*
[Script]
flushDNS = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/flushDNS.js
// use "title" or "icon" or "color" or "server" in "argument":
// flushDNS = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/asset/flushDNS.js,argument=title=DNS FLush&icon=arrow.clockwise&color=#3d3d5b&server=true

[Panel]
flushDNS = script-name=flushDNS,update-interval=600
*/

!(async () => {
    let panel = { title: "𝗗𝗡𝗦 𝗦𝗲𝗿𝘃𝗲𝗿" },
        showServer = true,
        dnsCache;
    if (typeof $argument != "undefined") {
        let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=")));
        if (arg.title) panel.title = arg.title;
        if (arg.icon) panel.icon = arg.icon;
        if (arg.color) panel["icon-color"] = arg.color;
        if (arg.server == "false") showServer = false;
    }
    if (showServer) {
        dnsCache = (await httpAPI("/v1/dns", "GET")).dnsCache;
        dnsCache = [...new Set(dnsCache.map((d) => d.server))].toString().replace(/,/g, "\n");
    }
    if (console.log(dnsCache.indexOf("adguard-dns.com/dns-query") != -1)) {
        dnsCache = Availabal
    } else {
        dnsCache = Unavailabal
    }
    if ($trigger == "button") await httpAPI("/v1/dns/flush");
    // let delay = ((await httpAPI("/v1/test/dns_delay")).delay * 1000).toFixed(0);
    panel.content = `DoH Server is ${dnsCache}`;
    $done(panel);
})();

function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}
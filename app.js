// =========
// 1) Set your DexScreener pair URLs here (for AU79 + SLVr)
// =========
// Example of what to paste:
// https://dexscreener.com/solana/<PAIR_OR_TOKEN_PATH>
const DEXSCREENERS = {
  AU79: "",  // <-- paste AU79 DexScreener pair url
  SLVr: "",  // <-- paste SLVr DexScreener pair url
};

// =========
// 2) TradingView symbols we’ll embed
// =========
// Confirmed TradingView pages exist for these:
// - PAXGUSDT  :contentReference[oaicite:2]{index=2}
// - XAUUSDT.P :contentReference[oaicite:3]{index=3}
// - XAGUSDT.P :contentReference[oaicite:4]{index=4}
//
// For $GOLD: using GOLDUSDT.P (exchange-specific listing exists on TradingView). :contentReference[oaicite:5]{index=5}
const TV = [
  { container: "tv_paxg",     symbol: "PAXGUSDT" },
  { container: "tv_xauusdt",  symbol: "BINANCE:XAUUSDT.P" },
  { container: "tv_xagusdt",  symbol: "BINANCE:XAGUSDT.P" },
  { container: "tv_gold",     symbol: "GOLDUSDT.P" },
];

function setFooterMeta() {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastUpdated").textContent = `Updated: ${new Date().toLocaleString()}`;
}

function setDexEmbeds() {
  const au = document.getElementById("dex_au79");
  const sl = document.getElementById("dex_slvr");

  // DexScreener supports viewing a live chart on their site; we embed the page.
  // If blank, we show a friendly placeholder.
  if (DEXSCREENERS.AU79) au.src = DEXSCREENERS.AU79;
  else au.srcdoc = `<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#a6b3c2;font-family:system-ui;padding:14px;text-align:center;">
    Paste AU79 DexScreener pair URL in <b>app.js</b> → <code>DEXSCREENERS.AU79</code>
  </div>`;

  if (DEXSCREENERS.SLVr) sl.src = DEXSCREENERS.SLVr;
  else sl.srcdoc = `<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#a6b3c2;font-family:system-ui;padding:14px;text-align:center;">
    Paste SLVr DexScreener pair URL in <b>app.js</b> → <code>DEXSCREENERS.SLVr</code>
  </div>`;
}

// TradingView embed script loader (one-time)
function loadTradingViewScript() {
  return new Promise((resolve) => {
    if (window.TradingView) return resolve();

    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/tv.js";
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

function mountTVWidget(containerId, symbol) {
  // Advanced Chart widget. No API key needed.
  // If you want a different look, we can switch to Symbol Overview widgets later.
  new window.TradingView.widget({
    autosize: true,
    symbol,
    interval: "30",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    enable_publishing: false,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    container_id: containerId,
  });
}

async function init() {
  setFooterMeta();
  setDexEmbeds();

  await loadTradingViewScript();
  TV.forEach(({ container, symbol }) => mountTVWidget(container, symbol));
}

init();

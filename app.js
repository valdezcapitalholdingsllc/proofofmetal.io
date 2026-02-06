document.addEventListener("DOMContentLoaded", async () => {
  const TV_WIDGETS = [
    // PAXG spot chart
    { container: "tv_paxg", symbol: "PAXGUSDT" },

    // Metals perps
    { container: "tv_xauusdt", symbol: "BINANCE:XAUUSDT.P" },
    { container: "tv_xagusdt", symbol: "BINANCE:XAGUSDT.P" },

    // $GOLD (still placeholder until we wire your token source)
    { container: "tv_gold", symbol: "GOLDUSDT.P" },

    // Added tickers
    { container: "tv_kau", symbol: "KAUUSD" },
    { container: "tv_cgo", symbol: "CGOUSD" },
    { container: "tv_kag", symbol: "KAGUSD" },
  ];

  function el(id) { return document.getElementById(id); }

  function setMeta() {
    const y = el("year");
    const u = el("lastUpdated");
    if (y) y.textContent = new Date().getFullYear();
    if (u) u.textContent = `Loaded: ${new Date().toLocaleString()}`;
  }

  function loadTradingViewScript() {
    return new Promise((resolve, reject) => {
      if (window.TradingView) return resolve();
      const s = document.createElement("script");
      s.src = "https://s3.tradingview.com/tv.js";
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function mountTV(containerId, symbol) {
    const target = el(containerId);
    if (!target) {
      console.warn("Missing container:", containerId);
      return;
    }

    new window.TradingView.widget({
      autosize: true,
      symbol: symbol,
      interval: "30",
      timezone: "Etc/UTC",
      theme: "dark",      // darker charts on a light site
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: containerId,
    });
  }

  setMeta();
  await loadTradingViewScript();

  TV_WIDGETS.forEach(({ container, symbol }) => {
    try { mountTV(container, symbol); }
    catch (e) { console.warn("TradingView mount failed:", symbol, e); }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Meta
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const updated = document.getElementById("lastUpdated");
  if (updated) updated.textContent = `Loaded: ${new Date().toLocaleString()}`;

  // TradingView mounts
  const TV_WIDGETS = [
    { container: "tv_paxg", symbol: "PAXGUSDT" },
    { container: "tv_xaut", symbol: "XAUTUSD" },
    { container: "tv_xauusdt", symbol: "BINANCE:XAUUSDT.P" },
    { container: "tv_xagusdt", symbol: "BINANCE:XAGUSDT.P" },
    { container: "tv_kau", symbol: "KAUUSD" },
    { container: "tv_cgo", symbol: "CGOUSD" },
    { container: "tv_kag", symbol: "KAGUSD" },

    // $GOLD = placeholder proxy until we wire DexScreener/CMC by contract
    { container: "tv_gold", symbol: "GOLDUSDT.P" },
  ];

  function loadTV() {
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

  function mount(containerId, symbol) {
    const el = document.getElementById(containerId);
    if (!el) return console.warn("Missing chart container:", containerId);

    try {
      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: "30",
        timezone: "Etc/UTC",
        theme: "light",   // professional, not too dark
        style: "1",
        locale: "en",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: containerId,
      });
    } catch (e) {
      console.warn("TV mount failed:", symbol, e);
    }
  }

  loadTV()
    .then(() => TV_WIDGETS.forEach(w => mount(w.container, w.symbol)))
    .catch(err => console.error("TradingView failed to load:", err));
});
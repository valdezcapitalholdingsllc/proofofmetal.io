(function () {
  "use strict";

  const tvReady = () =>
    new Promise((resolve, reject) => {
      let tries = 0;

      function check() {
        if (window.TradingView && typeof window.TradingView.widget === "function") {
          resolve();
          return;
        }

        tries += 1;
        if (tries > 100) {
          reject(new Error("TradingView library failed to load."));
          return;
        }

        window.setTimeout(check, 100);
      }

      check();
    });

  function createWidget(config) {
    const container = document.getElementById(config.container_id);
    if (!container) return;

    container.innerHTML = "";

    try {
      new TradingView.widget(config);
    } catch (error) {
      container.innerHTML = `
        <div style="
          min-height:${config.height || 300}px;
          display:grid;
          place-items:center;
          border:1px dashed rgba(255,255,255,0.16);
          border-radius:16px;
          color:#a5b0c0;
          background:rgba(255,255,255,0.02);
          padding:20px;
          text-align:center;">
          Widget failed to load for ${config.symbol || config.container_id}
        </div>
      `;
      console.error(error);
    }
  }

  function symbolOverviewConfig(containerId, symbol, height = 320) {
    return {
      container_id: containerId,
      width: "100%",
      height,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "3",
      locale: "en",
      toolbar_bg: "#0b0f14",
      hide_top_toolbar: true,
      hide_legend: false,
      withdateranges: true,
      allow_symbol_change: false,
      save_image: false,
      details: true,
      hotlist: false,
      calendar: false
    };
  }

  function advancedChartConfig(containerId, symbol, height = 520) {
    return {
      container_id: containerId,
      width: "100%",
      height,
      symbol,
      interval: "240",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#0b0f14",
      enable_publishing: false,
      allow_symbol_change: false,
      hide_top_toolbar: false,
      hide_legend: false,
      withdateranges: true,
      range: "12M",
      studies: [],
      details: false,
      hotlist: false,
      calendar: false,
      support_host: "https://www.tradingview.com"
    };
  }

  function tickerTapeConfig() {
    return {
      container_id: "tickerTapeWidget",
      width: "100%",
      height: 64,
      symbols: [
        { proName: "OANDA:XAUUSD", title: "Gold Spot" },
        { proName: "OANDA:XAGUSD", title: "Silver Spot" },
        { proName: "CRYPTO:PAXGUSD", title: "PAXG" },
        { proName: "CRYPTO:XAUTUSD", title: "XAUT" },
        { proName: "CRYPTO:KAUUSD", title: "KAU" },
        { proName: "CRYPTO:KAGUSD", title: "KAG" }
      ],
      showSymbolLogo: false,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en"
    };
  }

  function initCoreWidgets() {
    createWidget(tickerTapeConfig());

    createWidget(symbolOverviewConfig("heroOverviewWidget", "OANDA:XAUUSD", 290));

    createWidget(symbolOverviewConfig("spotGoldWidget", "OANDA:XAUUSD", 220));
    createWidget(symbolOverviewConfig("spotSilverWidget", "OANDA:XAGUSD", 220));
    createWidget(symbolOverviewConfig("paxgCardWidget", "CRYPTO:PAXGUSD", 220));
    createWidget(symbolOverviewConfig("xautCardWidget", "CRYPTO:XAUTUSD", 220));
    createWidget(symbolOverviewConfig("kauCardWidget", "CRYPTO:KAUUSD", 220));
    createWidget(symbolOverviewConfig("kagCardWidget", "CRYPTO:KAGUSD", 220));

    createWidget(symbolOverviewConfig("paxgOverviewWidget", "CRYPTO:PAXGUSD", 360));
    createWidget(symbolOverviewConfig("xautOverviewWidget", "CRYPTO:XAUTUSD", 360));
    createWidget(symbolOverviewConfig("kauOverviewWidget", "CRYPTO:KAUUSD", 360));
    createWidget(symbolOverviewConfig("kagOverviewWidget", "CRYPTO:KAGUSD", 360));
  }

  function benchmarkFor(symbol) {
    if (symbol === "CRYPTO:KAGUSD") return "OANDA:XAGUSD";
    return "OANDA:XAUUSD";
  }

  function shortLabel(symbol) {
    const map = {
      "CRYPTO:PAXGUSD": "PAXG",
      "CRYPTO:XAUTUSD": "XAUT",
      "CRYPTO:KAUUSD": "KAU",
      "CRYPTO:KAGUSD": "KAG",
      "OANDA:XAUUSD": "Gold Spot",
      "OANDA:XAGUSD": "Silver Spot"
    };

    return map[symbol] || symbol;
  }

  function updateCompare(symbol, titleText) {
    const benchmark = benchmarkFor(symbol);

    const leftTitle = document.getElementById("compareLeftTitle");
    const rightTitle = document.getElementById("compareRightTitle");
    const mainTitle = document.getElementById("compareMainTitle");

    if (leftTitle) leftTitle.textContent = shortLabel(symbol);
    if (rightTitle) rightTitle.textContent = shortLabel(benchmark);
    if (mainTitle) mainTitle.textContent = titleText;

    createWidget(symbolOverviewConfig("compareLeftWidget", symbol, 320));
    createWidget(symbolOverviewConfig("compareRightWidget", benchmark, 320));
    createWidget(advancedChartConfig("compareMainWidget", symbol, 520));
  }

  function initCompareTabs() {
    const tabs = document.querySelectorAll(".compare-tab");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((btn) => btn.classList.remove("active"));
        tab.classList.add("active");

        const symbol = tab.dataset.symbol;
        const title = tab.dataset.title || shortLabel(symbol);
        updateCompare(symbol, title);
      });
    });

    const active = document.querySelector(".compare-tab.active");
    if (active) {
      updateCompare(active.dataset.symbol, active.dataset.title || shortLabel(active.dataset.symbol));
    }
  }

  function initNav() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("siteNav");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  async function init() {
    initNav();

    try {
      await tvReady();
      initCoreWidgets();
      initCompareTabs();
    } catch (error) {
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
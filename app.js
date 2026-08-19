/* =========================================================
   PROOF OF METAL
   MARKET DASHBOARD JAVASCRIPT
========================================================= */

(function () {

  "use strict";


  /* =======================================================
     TRADINGVIEW
  ======================================================= */

  function createTradingViewWidget(
    containerId,
    symbol,
    height = 150
  ) {

    const container =
      document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    if (
      !window.TradingView ||
      typeof window.TradingView.widget !== "function"
    ) {

      container.innerHTML = `
        <div class="widget-error">
          Market data unavailable
        </div>
      `;

      return;
    }


    try {

      new TradingView.widget({

        container_id:
          containerId,

        autosize:
          true,

        width:
          "100%",

        height:
          height,

        symbol:
          symbol,

        interval:
          "D",

        timezone:
          "Etc/UTC",

        theme:
          "dark",

        style:
          "3",

        locale:
          "en",

        toolbar_bg:
          "#080c12",

        enable_publishing:
          false,

        hide_top_toolbar:
          true,

        hide_legend:
          false,

        allow_symbol_change:
          false,

        save_image:
          false,

        hide_side_toolbar:
          true,

        details:
          false,

        calendar:
          false,

        hotlist:
          false,

        studies: [],

        support_host:
          "https://www.tradingview.com"

      });

    }

    catch (error) {

      console.error(
        "TradingView error:",
        error
      );

      container.innerHTML = `
        <div class="widget-error">
          Unable to load ${symbol}
        </div>
      `;
    }
  }


  /* =======================================================
     MARKET WIDGETS
  ======================================================= */

  function initializeMarketWidgets() {

    createTradingViewWidget(
      "goldWidget",
      "OANDA:XAUUSD",
      150
    );

    createTradingViewWidget(
      "silverWidget",
      "OANDA:XAGUSD",
      150
    );

    createTradingViewWidget(
      "paxgWidget",
      "CRYPTO:PAXGUSD",
      150
    );

    createTradingViewWidget(
      "xautWidget",
      "CRYPTO:XAUTUSD",
      150
    );

    createTradingViewWidget(
      "kauWidget",
      "CRYPTO:KAUUSD",
      150
    );

    createTradingViewWidget(
      "kagWidget",
      "CRYPTO:KAGUSD",
      150
    );
  }


  /* =======================================================
     COMPARISON
  ======================================================= */

  const comparisonData = {

    "CRYPTO:PAXGUSD": {

      label:
        "PAXG",

      benchmark:
        "Gold Spot",

      benchmarkSymbol:
        "OANDA:XAUUSD",

      title:
        "PAXG vs Gold Spot",

      spread:
        "+0.06%"

    },


    "CRYPTO:XAUTUSD": {

      label:
        "XAUT",

      benchmark:
        "Gold Spot",

      benchmarkSymbol:
        "OANDA:XAUUSD",

      title:
        "XAUT vs Gold Spot",

      spread:
        "+0.02%"

    },


    "CRYPTO:KAUUSD": {

      label:
        "KAU",

      benchmark:
        "Gold Spot",

      benchmarkSymbol:
        "OANDA:XAUUSD",

      title:
        "KAU vs Gold Spot",

      spread:
        "+0.31%"

    },


    "CRYPTO:KAGUSD": {

      label:
        "KAG",

      benchmark:
        "Silver Spot",

      benchmarkSymbol:
        "OANDA:XAGUSD",

      title:
        "KAG vs Silver Spot",

      spread:
        "+0.45%"

    }

  };


  function updateComparison(symbol) {

    const data =
      comparisonData[symbol];

    if (!data) return;


    const tokenLabel =
      document.getElementById(
        "compareTokenLabel"
      );

    const benchmarkLabel =
      document.getElementById(
        "compareBenchmarkLabel"
      );

    const title =
      document.getElementById(
        "compareTitle"
      );

    const spread =
      document.getElementById(
        "spreadValue"
      );


    if (tokenLabel)
      tokenLabel.textContent =
        data.label;


    if (benchmarkLabel)
      benchmarkLabel.textContent =
        data.benchmark;


    if (title)
      title.textContent =
        data.title;


    if (spread)
      spread.textContent =
        data.spread;


    createTradingViewWidget(

      "compareTokenWidget",

      symbol,

      280

    );


    createTradingViewWidget(

      "compareBenchmarkWidget",

      data.benchmarkSymbol,

      280

    );

  }


  function initializeComparisonTabs() {

    const tabs =
      document.querySelectorAll(
        ".compare-tab"
      );

    tabs.forEach(tab => {

      tab.addEventListener(
        "click",
        function () {

          tabs.forEach(
            button =>
              button.classList.remove(
                "active"
              )
          );

          this.classList.add(
            "active"
          );

          const symbol =
            this.dataset.symbol;

          updateComparison(
            symbol
          );

        }
      );

    });


    const first =
      document.querySelector(
        ".compare-tab.active"
      );

    if (first) {

      updateComparison(
        first.dataset.symbol
      );

    }

  }


  /* =======================================================
     TOKEN COMPARE BUTTONS
  ======================================================= */

  function initializeTokenCompareButtons() {

    const buttons =
      document.querySelectorAll(
        ".compare-token"
      );

    buttons.forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const symbol =
            this.dataset.symbol;

          const compareTab =
            document.querySelector(
              `.compare-tab[data-symbol="${symbol}"]`
            );

          if (compareTab) {

            compareTab.click();

          }

          const compareSection =
            document.getElementById(
              "compare"
            );

          if (compareSection) {

            compareSection.scrollIntoView({
              behavior: "smooth"
            });

          }

        }
      );

    });

  }


  /* =======================================================
     NAVIGATION
  ======================================================= */

  function initializeNavigation() {

    const toggle =
      document.getElementById(
        "navToggle"
      );

    const nav =
      document.getElementById(
        "siteNav"
      );

    if (!toggle || !nav)
      return;


    toggle.addEventListener(
      "click",
      function () {

        const open =
          nav.classList.toggle(
            "open"
          );

        toggle.setAttribute(
          "aria-expanded",
          String(open)
        );

      }
    );


    nav.querySelectorAll(
      "a"
    ).forEach(link => {

      link.addEventListener(
        "click",
        function () {

          nav.classList.remove(
            "open"
          );

          toggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

  }


  /* =======================================================
     LAST UPDATED
  ======================================================= */

  function updateTimestamp() {

    const element =
      document.getElementById(
        "lastUpdated"
      );

    if (!element)
      return;


    const now =
      new Date();


    element.textContent =
      "Last updated: " +
      now.toLocaleTimeString(
        "en-US",
        {
          hour:
            "2-digit",

          minute:
            "2-digit",

          second:
            "2-digit",

          timeZoneName:
            "short"
        }
      );

  }


  /* =======================================================
     DETAIL MODALS
  ======================================================= */

  const tokenDetails = {

    PAXG: {

      title:
        "PAXG — PAX Gold",

      text:
        "PAXG is a tokenized gold asset designed to represent ownership of physical gold. Proof Of Metal tracks its market behavior against the gold spot benchmark while evaluating backing, custody, and redemption characteristics."

    },


    XAUT: {

      title:
        "XAUT — Tether Gold",

      text:
        "XAUT is a gold-backed digital asset. Proof Of Metal evaluates its relationship to physical gold, market premium or discount, custody structure, and redemption characteristics."

    },


    KAU: {

      title:
        "KAU — Kinesis Gold",

      text:
        "KAU is a gold-linked digital unit within the Kinesis ecosystem. Proof Of Metal tracks its relationship to gold and evaluates its utility, metal linkage, custody, and redemption characteristics."

    },


    KAG: {

      title:
        "KAG — Kinesis Silver",

      text:
        "KAG is a silver-linked digital unit within the Kinesis ecosystem. Proof Of Metal tracks its relationship to silver and evaluates its utility, metal linkage, custody, and redemption characteristics."

    }

  };


  function initializeDetailModals() {

    const modal =
      document.getElementById(
        "detailModal"
      );

    const modalTitle =
      document.getElementById(
        "modalTitle"
      );

    const modalContent =
      document.getElementById(
        "modalContent"
      );

    const close =
      document.getElementById(
        "modalClose"
      );

    const overlay =
      document.querySelector(
        ".modal-overlay"
      );


    document.querySelectorAll(
      "[data-detail]"
    ).forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const token =
            this.dataset.detail;

          const data =
            tokenDetails[token];

          if (!data)
            return;


          modalTitle.textContent =
            data.title;


          modalContent.innerHTML = `
            <p>
              ${data.text}
            </p>

            <p>
              <strong>
                Proof Of Metal framework:
              </strong>
              Price + backing + custody +
              redemption + transparency.
            </p>
          `;


          modal.classList.add(
            "open"
          );

          modal.setAttribute(
            "aria-hidden",
            "false"
          );

        }
      );

    });


    function closeModal() {

      modal.classList.remove(
        "open"
      );

      modal.setAttribute(
        "aria-hidden",
        "true"
      );

    }


    if (close)
      close.addEventListener(
        "click",
        closeModal
      );


    if (overlay)
      overlay.addEventListener(
        "click",
        closeModal
      );


    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape"
        ) {

          closeModal();

        }

      }
    );

  }


  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  function initializeScrollNavigation() {

    const sections =
      document.querySelectorAll(
        "main section[id]"
      );

    const links =
      document.querySelectorAll(
        ".site-nav a"
      );


    window.addEventListener(
      "scroll",
      function () {

        let current = "top";


        sections.forEach(
          section => {

            const top =
              section.offsetTop - 160;

            if (
              window.scrollY >= top
            ) {

              current =
                section.id;

            }

          }
        );


        links.forEach(
          link => {

            link.classList.remove(
              "active"
            );


            const href =
              link.getAttribute(
                "href"
              );


            if (
              href ===
              "#" + current
            ) {

              link.classList.add(
                "active"
              );

            }

          }
        );

      }
    );

  }


  /* =======================================================
     INITIALIZE
  ======================================================= */

  function initialize() {

    initializeNavigation();

    initializeMarketWidgets();

    initializeComparisonTabs();

    initializeTokenCompareButtons();

    initializeDetailModals();

    initializeScrollNavigation();

    updateTimestamp();

    setInterval(
      updateTimestamp,
      1000
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );

  } else {

    initialize();

  }

})();
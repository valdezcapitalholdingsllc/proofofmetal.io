(function () {
  "use strict";

  /*
   * =========================================================
   * PROOF OF METAL
   * app.js
   *
   * Handles:
   * - TradingView market widgets
   * - Token/metal comparisons
   * - Navigation
   * - Mobile navigation
   * - Scroll spy
   * - Asset detail modal
   * - Last updated timestamp
   * =========================================================
   */


  /* =========================================================
     TRADINGVIEW READY CHECK
  ========================================================= */

  function waitForTradingView() {
    return new Promise(function (resolve, reject) {

      var attempts = 0;
      var maxAttempts = 100;

      function check() {

        if (
          window.TradingView &&
          typeof window.TradingView.widget === "function"
        ) {
          resolve();
          return;
        }

        attempts++;

        if (attempts >= maxAttempts) {
          reject(
            new Error("TradingView library failed to load.")
          );
          return;
        }

        window.setTimeout(check, 100);
      }

      check();
    });
  }


  /* =========================================================
     TRADINGVIEW WIDGET CREATOR
  ========================================================= */

  function createTradingViewWidget(
    containerId,
    symbol,
    height,
    advanced
  ) {

    var container =
      document.getElementById(containerId);

    if (!container) {
      console.warn(
        "Proof Of Metal: container not found:",
        containerId
      );
      return;
    }

    container.innerHTML = "";

    var config = {
      container_id: containerId,

      width: "100%",

      height: height || 300,

      symbol: symbol,

      interval: advanced ? "240" : "D",

      timezone: "Etc/UTC",

      theme: "dark",

      style: advanced ? "1" : "3",

      locale: "en",

      toolbar_bg: "#080b10",

      enable_publishing: false,

      allow_symbol_change: false,

      hide_top_toolbar: !advanced,

      hide_legend: !advanced,

      withdateranges: true,

      save_image: false,

      details: false,

      hotlist: false,

      calendar: false,

      studies: [],

      support_host:
        "https://www.tradingview.com"
    };


    try {

      new window.TradingView.widget(config);

    } catch (error) {

      console.error(
        "Proof Of Metal TradingView error:",
        error
      );

      container.innerHTML = `
        <div class="widget-error">
          <strong>Market data unavailable</strong>
          <span>Please try again shortly.</span>
        </div>
      `;
    }
  }


  /* =========================================================
     MARKET WIDGETS
  ========================================================= */

  function initMarketWidgets() {

    createTradingViewWidget(
      "goldWidget",
      "OANDA:XAUUSD",
      260,
      false
    );


    createTradingViewWidget(
      "silverWidget",
      "OANDA:XAGUSD",
      260,
      false
    );


    createTradingViewWidget(
      "paxgWidget",
      "CRYPTO:PAXGUSD",
      210,
      false
    );


    createTradingViewWidget(
      "xautWidget",
      "CRYPTO:XAUTUSD",
      210,
      false
    );


    createTradingViewWidget(
      "kauWidget",
      "CRYPTO:KAUUSD",
      210,
      false
    );


    createTradingViewWidget(
      "kagWidget",
      "CRYPTO:KAGUSD",
      210,
      false
    );
  }


  /* =========================================================
     COMPARISON DATA
  ========================================================= */

  var tokenLabels = {

    "CRYPTO:PAXGUSD": "PAXG",

    "CRYPTO:XAUTUSD": "XAUT",

    "CRYPTO:KAUUSD": "KAU",

    "CRYPTO:KAGUSD": "KAG"
  };


  function getBenchmark(symbol) {

    if (symbol === "CRYPTO:KAGUSD") {
      return "OANDA:XAGUSD";
    }

    return "OANDA:XAUUSD";
  }


  function getBenchmarkName(symbol) {

    if (symbol === "OANDA:XAGUSD") {
      return "SILVER SPOT";
    }

    return "GOLD SPOT";
  }


  function getBenchmarkShortName(symbol) {

    if (symbol === "OANDA:XAGUSD") {
      return "XAG / USD";
    }

    return "XAU / USD";
  }


  /* =========================================================
     UPDATE COMPARISON
  ========================================================= */

  function updateComparison(symbol, title) {

    if (!symbol) {
      return;
    }

    var benchmark =
      getBenchmark(symbol);


    var tokenLabel =
      document.getElementById(
        "compareTokenLabel"
      );


    var benchmarkLabel =
      document.getElementById(
        "compareBenchmarkLabel"
      );


    var compareTitle =
      document.getElementById(
        "compareTitle"
      );


    var benchmarkShort =
      document.getElementById(
        "compareBenchmarkShort"
      );


    if (tokenLabel) {

      tokenLabel.textContent =
        tokenLabels[symbol] || symbol;
    }


    if (benchmarkLabel) {

      benchmarkLabel.textContent =
        getBenchmarkName(benchmark);
    }


    if (compareTitle) {

      compareTitle.textContent =
        title || (
          tokenLabels[symbol] +
          " vs " +
          getBenchmarkName(benchmark)
        );
    }


    if (benchmarkShort) {

      benchmarkShort.textContent =
        getBenchmarkShortName(benchmark);
    }


    /*
     * Main comparison chart.
     *
     * The chart displays the selected token.
     * The benchmark information is displayed
     * alongside it in the comparison interface.
     */

    createTradingViewWidget(
      "compareMainWidget",
      symbol,
      520,
      true
    );
  }


  /* =========================================================
     COMPARISON TABS
  ========================================================= */

  function initComparisonTabs() {

    var tabs =
      document.querySelectorAll(
        ".compare-tab"
      );


    if (!tabs.length) {
      return;
    }


    tabs.forEach(function (tab) {

      tab.addEventListener(
        "click",
        function () {

          tabs.forEach(
            function (button) {
              button.classList.remove(
                "active"
              );
            }
          );


          tab.classList.add(
            "active"
          );


          updateComparison(
            tab.dataset.symbol,
            tab.dataset.title
          );

        }
      );

    });


    /*
     * Load the currently active comparison
     * when the page first opens.
     */

    var activeTab =
      document.querySelector(
        ".compare-tab.active"
      );


    if (activeTab) {

      updateComparison(
        activeTab.dataset.symbol,
        activeTab.dataset.title
      );

    }
  }


  /* =========================================================
     TOKEN COMPARE BUTTONS
  ========================================================= */

  function initTokenCompareButtons() {

    var buttons =
      document.querySelectorAll(
        ".compare-token"
      );


    if (!buttons.length) {
      return;
    }


    buttons.forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          var symbol =
            button.dataset.symbol;

          var title =
            button.dataset.title;


          var compareSection =
            document.getElementById(
              "compare"
            );


          /*
           * Scroll to comparison section.
           */

          if (compareSection) {

            compareSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }


          /*
           * Give the browser a moment to
           * finish the scroll before changing
           * the active comparison.
           */

          window.setTimeout(
            function () {

              var tabs =
                document.querySelectorAll(
                  ".compare-tab"
                );


              tabs.forEach(
                function (tab) {

                  tab.classList.remove(
                    "active"
                  );


                  if (
                    tab.dataset.symbol ===
                    symbol
                  ) {

                    tab.classList.add(
                      "active"
                    );

                  }
                }
              );


              updateComparison(
                symbol,
                title
              );

            },
            450
          );

        }
      );

    });
  }


  /* =========================================================
     MOBILE NAVIGATION
  ========================================================= */

  function initNavigation() {

    var toggle =
      document.getElementById(
        "navToggle"
      );


    var nav =
      document.getElementById(
        "siteNav"
      );


    if (!toggle || !nav) {
      return;
    }


    toggle.addEventListener(
      "click",
      function () {

        var expanded =
          toggle.getAttribute(
            "aria-expanded"
          ) === "true";


        toggle.setAttribute(
          "aria-expanded",
          String(!expanded)
        );


        nav.classList.toggle(
          "open"
        );

      }
    );


    /*
     * Close mobile menu after
     * selecting a navigation link.
     */

    nav.querySelectorAll(
      "a"
    ).forEach(function (link) {

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


  /* =========================================================
     ACTIVE NAVIGATION / SCROLL SPY
  ========================================================= */

  function initScrollSpy() {

    var links =
      document.querySelectorAll(
        ".site-nav a"
      );


    var sections =
      document.querySelectorAll(
        "main section[id]"
      );


    if (
      !links.length ||
      !sections.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }


    var observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (!entry.isIntersecting) {
                return;
              }


              var targetId =
                entry.target.id;


              links.forEach(
                function (link) {

                  var href =
                    link.getAttribute(
                      "href"
                    );


                  link.classList.remove(
                    "active"
                  );


                  if (
                    href ===
                    "#" + targetId
                  ) {

                    link.classList.add(
                      "active"
                    );

                  }

                }
              );

            }
          );

        },
        {
          rootMargin:
            "-35% 0px -55% 0px"
        }
      );


    sections.forEach(
      function (section) {
        observer.observe(section);
      }
    );
  }


  /* =========================================================
     ASSET DETAILS
  ========================================================= */

  var assetDetails = {

    PAXG: {
      title: "PAXG — PAX Gold",

      text:
        "PAXG is a digital gold asset designed to represent ownership of physical gold. Proof Of Metal tracks its market behavior alongside the XAU/USD physical gold benchmark."
    },


    XAUT: {
      title: "XAUT — Tether Gold",

      text:
        "XAUT is a digital asset linked to physical gold. Proof Of Metal tracks its price behavior and evaluates the characteristics of the underlying digital-to-physical relationship."
    },


    KAU: {
      title: "KAU — Kinesis Gold",

      text:
        "KAU is a gold-linked digital asset within the Kinesis ecosystem. Proof Of Metal tracks its market price relative to physical gold."
    },


    KAG: {
      title: "KAG — Kinesis Silver",

      text:
        "KAG is a silver-linked digital asset within the Kinesis ecosystem. Proof Of Metal compares its market behavior against the physical silver benchmark."
    }
  };


  /* =========================================================
     DETAIL MODAL
  ========================================================= */

  function initDetailModal() {

    var modal =
      document.getElementById(
        "detailModal"
      );


    if (!modal) {
      return;
    }


    var closeButton =
      document.getElementById(
        "modalClose"
      );


    var modalTitle =
      document.getElementById(
        "modalTitle"
      );


    var modalContent =
      document.getElementById(
        "modalContent"
      );


    var detailButtons =
      document.querySelectorAll(
        "[data-detail]"
      );


    function openModal(asset) {

      var data =
        assetDetails[asset];


      if (!data) {
        return;
      }


      if (modalTitle) {

        modalTitle.textContent =
          data.title;

      }


      if (modalContent) {

        modalContent.innerHTML = `
          <p>${data.text}</p>
        `;

      }


      modal.classList.add(
        "open"
      );


      modal.setAttribute(
        "aria-hidden",
        "false"
      );


      document.body.classList.add(
        "modal-open"
      );

    }


    function closeModal() {

      modal.classList.remove(
        "open"
      );


      modal.setAttribute(
        "aria-hidden",
        "true"
      );


      document.body.classList.remove(
        "modal-open"
      );

    }


    detailButtons.forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            openModal(
              button.dataset.detail
            );

          }
        );

      }
    );


    if (closeButton) {

      closeButton.addEventListener(
        "click",
        closeModal
      );

    }


    var overlay =
      modal.querySelector(
        ".modal-overlay"
      );


    if (overlay) {

      overlay.addEventListener(
        "click",
        closeModal
      );

    }


    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape" &&
          modal.classList.contains("open")
        ) {

          closeModal();

        }

      }
    );
  }


  /* =========================================================
     LAST UPDATED
  ========================================================= */

  function initTimestamp() {

    var element =
      document.getElementById(
        "lastUpdated"
      );


    if (!element) {
      return;
    }


    function updateTimestamp() {

      var now =
        new Date();


      element.textContent =
        "Updated " +
        now.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        );
    }


    updateTimestamp();


    window.setInterval(
      updateTimestamp,
      60000
    );
  }


  /* =========================================================
     SMOOTH INTERNAL LINKS
  ========================================================= */

  function initSmoothLinks() {

    document.querySelectorAll(
      'a[href^="#"]'
    ).forEach(function (link) {

      link.addEventListener(
        "click",
        function (event) {

          var targetId =
            link.getAttribute(
              "href"
            );


          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }


          var target =
            document.querySelector(
              targetId
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });


          /*
           * Update the URL hash without
           * causing another jump.
           */

          if (
            window.history &&
            window.history.replaceState
          ) {

            window.history.replaceState(
              null,
              "",
              targetId
            );

          }

        }
      );

    });
  }


  /* =========================================================
     TRADINGVIEW ERROR FALLBACK
  ========================================================= */

  function addWidgetErrorStyles() {

    if (
      document.getElementById(
        "proofOfMetalWidgetStyles"
      )
    ) {
      return;
    }


    var style =
      document.createElement(
        "style"
      );


    style.id =
      "proofOfMetalWidgetStyles";


    style.textContent = `
      .widget-error {
        min-height: 160px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 20px;
        text-align: center;
        color: #8b949e;
        background: rgba(255,255,255,0.02);
        border: 1px dashed rgba(255,255,255,0.10);
        font-size: 12px;
      }

      .widget-error strong {
        color: #d9a928;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .widget-error span {
        color: #8b949e;
        font-size: 10px;
      }

      body.modal-open {
        overflow: hidden;
      }
    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================================
     INITIALIZATION
  ========================================================= */

  async function initializeProofOfMetal() {

    /*
     * These don't depend on TradingView,
     * so initialize them immediately.
     */

    initNavigation();

    initScrollSpy();

    initTokenCompareButtons();

    initDetailModal();

    initTimestamp();

    initSmoothLinks();

    addWidgetErrorStyles();


    /*
     * TradingView-dependent functionality.
     */

    try {

      await waitForTradingView();


      initMarketWidgets();

      initComparisonTabs();

    } catch (error) {

      console.error(
        "Proof Of Metal initialization error:",
        error
      );

    }
  }


  /* =========================================================
     START
  ========================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeProofOfMetal
    );

  } else {

    initializeProofOfMetal();

  }

})();
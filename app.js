(function () {

  "use strict";


  /* =========================================================
     TRADINGVIEW
  ========================================================= */

  function tvReady() {

    return new Promise((resolve, reject) => {

      let attempts = 0;

      function check() {

        if (
          window.TradingView &&
          typeof window.TradingView.widget === "function"
        ) {
          resolve();
          return;
        }

        attempts++;

        if (attempts > 100) {
          reject(
            new Error("TradingView failed to load.")
          );

          return;
        }

        setTimeout(check, 100);
      }

      check();

    });

  }


  /* =========================================================
     WIDGET CREATOR
  ========================================================= */

  function createWidget(
    containerId,
    symbol,
    height = 300,
    advanced = false
  ) {

    const container =
      document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    const config = {

      container_id: containerId,

      width: "100%",

      height: height,

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

      new TradingView.widget(config);

    } catch (error) {

      console.error(error);

      container.innerHTML = `

        <div class="widget-error">

          Market data unavailable.

        </div>

      `;

    }

  }


  /* =========================================================
     CORE MARKET WIDGETS
  ========================================================= */

  function initMarketWidgets() {

    createWidget(
      "goldWidget",
      "OANDA:XAUUSD",
      260
    );


    createWidget(
      "silverWidget",
      "OANDA:XAGUSD",
      260
    );


    createWidget(
      "paxgWidget",
      "CRYPTO:PAXGUSD",
      210
    );


    createWidget(
      "xautWidget",
      "CRYPTO:XAUTUSD",
      210
    );


    createWidget(
      "kauWidget",
      "CRYPTO:KAUUSD",
      210
    );


    createWidget(
      "kagWidget",
      "CRYPTO:KAGUSD",
      210
    );

  }


  /* =========================================================
     COMPARISON
  ========================================================= */

  const labels = {

    "CRYPTO:PAXGUSD":
      "PAXG",

    "CRYPTO:XAUTUSD":
      "XAUT",

    "CRYPTO:KAUUSD":
      "KAU",

    "CRYPTO:KAGUSD":
      "KAG"

  };


  function benchmarkFor(symbol) {

    if (
      symbol ===
      "CRYPTO:KAGUSD"
    ) {

      return "OANDA:XAGUSD";

    }

    return "OANDA:XAUUSD";

  }


  function benchmarkName(symbol) {

    if (
      symbol ===
      "OANDA:XAGUSD"
    ) {

      return "SILVER SPOT";

    }

    return "GOLD SPOT";

  }


  function updateComparison(
    symbol,
    title
  ) {

    const benchmark =
      benchmarkFor(symbol);


    const tokenLabel =
      document.getElementById(
        "compareTokenLabel"
      );

    const benchmarkLabel =
      document.getElementById(
        "compareBenchmarkLabel"
      );

    const compareTitle =
      document.getElementById(
        "compareTitle"
      );

    const benchmarkShort =
      document.getElementById(
        "compareBenchmarkShort"
      );


    if (tokenLabel) {

      tokenLabel.textContent =
        labels[symbol] || symbol;

    }


    if (benchmarkLabel) {

      benchmarkLabel.textContent =
        benchmarkName(benchmark);

    }


    if (compareTitle) {

      compareTitle.textContent =
        title;

    }


    if (benchmarkShort) {

      benchmarkShort.textContent =
        benchmark === "OANDA:XAGUSD"
          ? "XAG / USD"
          : "XAU / USD";

    }


    createWidget(
      "compareMainWidget",
      symbol,
      520,
      true
    );

  }


  function initComparison() {

    const tabs =
      document.querySelectorAll(
        ".compare-tab"
      );


    if (!tabs.length) return;


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


    const active =
      document.querySelector(
        ".compare-tab.active"
      );


    if (active) {

      updateComparison(
        active.dataset.symbol,
        active.dataset.title
      );

    }

  }


  /* =========================================================
     COMPARE BUTTONS
  ========================================================= */

  function initCompareButtons() {

    const buttons =
      document.querySelectorAll(
        ".compare-token"
      );


    buttons.forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const symbol =
            button.dataset.symbol;

          const title =
            button.dataset.title;


          const compareSection =
            document.getElementById(
              "compare"
            );


          if (compareSection) {

            compareSection.scrollIntoView({
              behavior: "smooth"
            });

          }


          setTimeout(() => {

            const tabs =
              document.querySelectorAll(
                ".compare-tab"
              );


            tabs.forEach(tab => {

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

            });


            updateComparison(
              symbol,
              title
            );

          }, 400);

        }
      );

    });

  }


  /* =========================================================
     NAVIGATION
  ========================================================= */

  function initNavigation() {

    const toggle =
      document.getElementById(
        "navToggle"
      );

    const nav =
      document.getElementById(
        "siteNav"
      );


    if (!toggle || !nav) return;


    toggle.addEventListener(
      "click",
      function () {

        const expanded =
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


  /* =========================================================
     ACTIVE NAV
  ========================================================= */

  function initScrollSpy() {

    const links =
      document.querySelectorAll(
        ".site-nav a"
      );


    const sections =
      document.querySelectorAll(
        "main section[id]"
      );


    if (!sections.length) return;


    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting)
              return;


            links.forEach(link => {

              link.classList.remove(
                "active"
              );


              if (
                link.getAttribute(
                  "href"
                ) ===
                "#" + entry.target.id
              ) {

                link.classList.add(
                  "active"
                );

              }

            });

          });

        },
        {
          rootMargin:
            "-35% 0px -55% 0px"
        }
      );


    sections.forEach(section =>
      observer.observe(section)
    );

  }


  /* =========================================================
     DETAIL MODAL
  ========================================================= */

  const details = {

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


  function initModal() {

    const modal =
      document.getElementById(
        "detailModal"
      );

    const close =
      document.getElementById(
        "modalClose"
      );

    const title =
      document.getElementById(
        "modalTitle"
      );

    const content =
      document.getElementById(
        "modalContent"
      );


    const buttons =
      document.querySelectorAll(
        "[data-detail]"
      );


    if (!modal) return;


    function openModal(asset) {

      const data =
        details[asset];


      if (!data) return;


      title.textContent =
        data.title;


      content.innerHTML = `

        <p>
          ${data.text}
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


    function closeModal() {

      modal.classList.remove(
        "open"
      );


      modal.setAttribute(
        "aria-hidden",
        "true"
      );

    }


    buttons.forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openModal(
            button.dataset.detail
          );

        }
      );

    });


    close?.addEventListener(
      "click",
      closeModal
    );


    modal
      .querySelector(".modal-overlay")
      ?.addEventListener(
        "click",
        closeModal
      );


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
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

    const element =
      document.getElementById(
        "lastUpdated"
      );


    if (!element) return;


    function update() {

      const now =
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


    update();


    setInterval(
      update,
      60000
    );

  }


  /* =========================================================
     INITIALIZATION
  ========================================================= */

  async function init() {

    initNavigation();

    initScrollSpy();

    initCompareButtons();

    initModal();

    initTimestamp();


    try {

      await tvReady();

      initMarketWidgets();

      initComparison();

    } catch (error) {

      console.error(
        "Proof Of Metal initialization error:",
        error
      );

    }

  }


  document.addEventListener(
    "DOMContentLoaded",
    init
  );

})();

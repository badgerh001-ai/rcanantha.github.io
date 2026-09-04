const $ = (selector, context = document) =>
  context.querySelector(selector);

const $$ = (selector, context = document) =>
  [...context.querySelectorAll(selector)];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// ==========================================================
// STICKY HEADER
// ==========================================================

const header = $("#header");

const updateHeader = () => {
  header?.classList.toggle(
    "scrolled",
    window.scrollY > 20
  );
};

updateHeader();

window.addEventListener(
  "scroll",
  updateHeader,
  {
    passive: true
  }
);


// ==========================================================
// MOBILE MENU
// ==========================================================

const menuButton = $("#menuButton");
const mobileMenu = $("#mobileMenu");

function closeMenu() {
  menuButton?.classList.remove("active");
  mobileMenu?.classList.remove("open");

  menuButton?.setAttribute(
    "aria-expanded",
    "false"
  );

  document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  const open =
    !mobileMenu.classList.contains("open");

  menuButton.classList.toggle(
    "active",
    open
  );

  mobileMenu.classList.toggle(
    "open",
    open
  );

  menuButton.setAttribute(
    "aria-expanded",
    String(open)
  );

  document.body.classList.toggle(
    "menu-open",
    open
  );
});

$$("a", mobileMenu).forEach((link) => {
  link.addEventListener(
    "click",
    closeMenu
  );
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});


// ==========================================================
// SCROLL REVEAL
// ==========================================================

const revealItems = $$(".reveal");

if (
  reducedMotion ||
  !("IntersectionObserver" in window)
) {
  revealItems.forEach((item) => {
    item.classList.add("visible");
  });
} else {
  const revealObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "visible"
          );

          revealObserver.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px"
      }
    );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay =
      `${Math.min(index % 4, 3) * 60}ms`;

    revealObserver.observe(item);
  });
}


// ==========================================================
// SERVICE FILTERS
// ==========================================================

const filterButtons = $$(".filter");
const serviceCards = $$(".service-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const selected =
      button.dataset.filter;

    serviceCards.forEach((card) => {
      const visible =
        selected === "all" ||
        card.dataset.category === selected;

      card.classList.toggle(
        "hidden",
        !visible
      );

      if (
        visible &&
        !reducedMotion
      ) {
        card.animate(
          [
            {
              opacity: 0,
              transform: "translateY(12px)"
            },
            {
              opacity: 1,
              transform: "translateY(0)"
            }
          ],
          {
            duration: 300,
            easing: "ease-out"
          }
        );
      }
    });
  });
});


// ==========================================================
// FAQ ACCORDION
// ==========================================================

$$(".faq-item").forEach((item) => {
  const button = $("button", item);

  button?.addEventListener(
    "click",
    () => {
      const shouldOpen =
        !item.classList.contains("open");

      $$(".faq-item").forEach(
        (other) => {
          other.classList.remove("open");

          $("button", other)?.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );

      if (shouldOpen) {
        item.classList.add("open");

        button.setAttribute(
          "aria-expanded",
          "true"
        );
      }
    }
  );
});


// ==========================================================
// COMING-SOON NOTIFICATION
// ==========================================================

const toast = $("#toast");
let toastTimer;

$$("[data-coming-soon]").forEach(
  (link) => {
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();

        toast?.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(
          () => {
            toast?.classList.remove(
              "show"
            );
          },
          2400
        );
      }
    );
  }
);


// ==========================================================
// AUTOMATIC COPYRIGHT YEAR
// ==========================================================

const year = $("#year");

if (year) {
  year.textContent =
    new Date().getFullYear();
}
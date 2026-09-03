const $ = (selector, context = document) =>
  context.querySelector(selector);

const $$ = (selector, context = document) =>
  [...context.querySelectorAll(selector)];

const reduced = matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// ==========================================================
// HEADER AND MOBILE NAVIGATION
// ==========================================================

const header = $("#siteHeader");
const toggle = $("#menuToggle");
const panel = $("#mobilePanel");

const closeMenu = () => {
  toggle?.classList.remove("active");
  panel?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

toggle?.addEventListener("click", () => {
  const open = !panel.classList.contains("open");

  toggle.classList.toggle("active", open);
  panel.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

$$("a", panel).forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 780) {
    closeMenu();
  }
});

const setHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

setHeader();

window.addEventListener("scroll", setHeader, {
  passive: true
});


// ==========================================================
// ANIMATED HERO PHRASE
// ==========================================================

const cycle = $("#cycleWord");

const phrases = [
  "convert.",
  "automate.",
  "perform.",
  "scale.",
  "grow."
];

let phrase = 0;

if (cycle && !reduced) {
  setInterval(() => {
    cycle
      .animate(
        [
          {
            opacity: 1,
            transform: "translateY(0)"
          },
          {
            opacity: 0,
            transform: "translateY(-14px)"
          }
        ],
        {
          duration: 220,
          fill: "forwards"
        }
      )
      .finished.then(() => {
        phrase = (phrase + 1) % phrases.length;
        cycle.textContent = phrases[phrase];

        cycle.animate(
          [
            {
              opacity: 0,
              transform: "translateY(14px)"
            },
            {
              opacity: 1,
              transform: "translateY(0)"
            }
          ],
          {
            duration: 280,
            fill: "forwards"
          }
        );
      });
  }, 2400);
}


// ==========================================================
// CURSOR AURA AND HERO ORB PARALLAX
// ==========================================================

const aura = $("#cursorAura");
const hero = $("#home");
const orb = $("#heroOrb");

if (
  !reduced &&
  matchMedia("(hover: hover)").matches
) {
  window.addEventListener(
    "pointermove",
    (event) => {
      aura?.classList.add("visible");

      if (aura) {
        aura.style.left = `${event.clientX}px`;
        aura.style.top = `${event.clientY}px`;
      }
    },
    {
      passive: true
    }
  );

  document.addEventListener("mouseleave", () => {
    aura?.classList.remove("visible");
  });

  hero?.addEventListener(
    "pointermove",
    (event) => {
      const rect = hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      if (orb) {
        orb.style.margin =
          `${y * 12}px ${x * 14}px 0 0`;
      }
    },
    {
      passive: true
    }
  );

  hero?.addEventListener("pointerleave", () => {
    if (orb) {
      orb.style.margin = "0";
    }
  });
}


// ==========================================================
// NEURAL PARTICLE CANVAS
// ==========================================================

(() => {
  const canvas = $("#neuralCanvas");

  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let nodes = [];
  let animationFrame;
  let resizeTimer;

  const resizeCanvas = () => {
    const rectangle = canvas.getBoundingClientRect();

    pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    width = rectangle.width;
    height = rectangle.height;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    const count = Math.min(
      68,
      Math.max(
        28,
        Math.floor((width * height) / 22000)
      )
    );

    nodes = Array.from(
      {
        length: count
      },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.3 + 0.5
      })
    );
  };

  const drawCanvas = () => {
    context.clearRect(0, 0, width, height);

    for (const node of nodes) {
      if (!reduced) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
        }

        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
        }
      }

      context.beginPath();

      context.arc(
        node.x,
        node.y,
        node.radius,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        "rgba(99, 239, 255, 0.65)";

      context.fill();
    }

    for (let first = 0; first < nodes.length; first++) {
      for (
        let second = first + 1;
        second < nodes.length;
        second++
      ) {
        const nodeA = nodes[first];
        const nodeB = nodes[second];

        const distanceX = nodeA.x - nodeB.x;
        const distanceY = nodeA.y - nodeB.y;

        const distance = Math.hypot(
          distanceX,
          distanceY
        );

        if (distance < 125) {
          context.beginPath();

          context.moveTo(
            nodeA.x,
            nodeA.y
          );

          context.lineTo(
            nodeB.x,
            nodeB.y
          );

          context.strokeStyle =
            `rgba(48, 130, 255, ${
              0.15 * (1 - distance / 125)
            })`;

          context.stroke();
        }
      }
    }

    if (!reduced) {
      animationFrame =
        requestAnimationFrame(drawCanvas);
    }
  };

  resizeCanvas();
  drawCanvas();

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        resizeCanvas();
        drawCanvas();
      }, 120);
    },
    {
      passive: true
    }
  );
})();


// ==========================================================
// SCROLL REVEAL ANIMATIONS
// ==========================================================

const revealElements = $$(".reveal");

if (reduced) {
  revealElements.forEach((element) => {
    element.classList.add("in-view");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px"
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay =
      `${Math.min(index % 4, 3) * 55}ms`;

    revealObserver.observe(element);
  });
}


// ==========================================================
// ANIMATED METRIC COUNTERS
// ==========================================================

const counters = $$("[data-count]");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      counterObserver.unobserve(entry.target);

      const element = entry.target;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";

      if (reduced) {
        element.textContent = target + suffix;
        return;
      }

      const startTime = performance.now();
      const duration = 1300;

      const updateCounter = (currentTime) => {
        const progress = Math.min(
          (currentTime - startTime) / duration,
          1
        );

        const easedProgress =
          1 - Math.pow(1 - progress, 3);

        const value = Math.floor(
          target * easedProgress
        );

        element.textContent = value + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  },
  {
    threshold: 0.5
  }
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});


// ==========================================================
// SERVICE CATEGORY FILTERING
// ==========================================================

const filters = $$(".filter");
const serviceCards = $$(".service-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filterButton) => {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");

    const selectedFilter = button.dataset.filter;

    serviceCards.forEach((card) => {
      const shouldShow =
        selectedFilter === "all" ||
        card.dataset.category === selectedFilter;

      card.classList.toggle(
        "hidden",
        !shouldShow
      );

      if (shouldShow && !reduced) {
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
            duration: 320,
            easing: "ease-out"
          }
        );
      }
    });
  });
});


// ==========================================================
// SERVICE CARD TILT EFFECT
// ==========================================================

if (
  !reduced &&
  matchMedia("(hover: hover)").matches
) {
  $$("[data-tilt]").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rectangle =
          card.getBoundingClientRect();

        const x =
          (event.clientX - rectangle.left) /
            rectangle.width -
          0.5;

        const y =
          (event.clientY - rectangle.top) /
            rectangle.height -
          0.5;

        card.style.transform =
          `perspective(850px) ` +
          `rotateX(${-y * 4}deg) ` +
          `rotateY(${x * 4}deg) ` +
          `translateY(-3px)`;
      }
    );

    card.addEventListener(
      "pointerleave",
      () => {
        card.style.transform = "";
      }
    );
  });
}


// ==========================================================
// FAQ ACCORDION
// ==========================================================

$$(".faq-item").forEach((item) => {
  const button = $("button", item);

  button?.addEventListener("click", () => {
    const shouldOpen =
      !item.classList.contains("open");

    $$(".faq-item").forEach((otherItem) => {
      otherItem.classList.remove("open");

      $("button", otherItem)?.setAttribute(
        "aria-expanded",
        "false"
      );
    });

    if (shouldOpen) {
      item.classList.add("open");

      button.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  });
});


// ==========================================================
// COMING-SOON NOTIFICATION
// ==========================================================

const toast = $("#toast");
let toastTimer;

$$("[data-coming-soon]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    toast?.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast?.classList.remove("show");
    }, 2400);
  });
});


// ==========================================================
// AUTOMATIC COPYRIGHT YEAR
// ==========================================================

const year = $("#year");

if (year) {
  year.textContent =
    new Date().getFullYear();
}
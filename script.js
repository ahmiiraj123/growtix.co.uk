const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

const tabs = document.querySelectorAll(".tab");
const items = document.querySelectorAll(".portfolio-item");

if (tabs.length && items.length) {
  const filterItems = (filter) => {
    items.forEach(item => {
      const show = filter === "all" || item.dataset.category === filter;
      item.style.display = show ? "block" : "none";
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      filterItems(tab.dataset.filter);
    });
  });

  const param = new URLSearchParams(window.location.search).get("tab");
  const start = param || "all";
  const activeTab = [...tabs].find(t => t.dataset.filter === start) || tabs[0];
  activeTab.click();
}

function initSmoothTilt(card, options = {}) {
  const maxRotate = options.maxRotate ?? 12;
  const maxLift = options.maxLift ?? 10;
  const speed = options.speed ?? 0.08;

  const state = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    currentShadowX: 0,
    currentShadowY: 0,
    targetShadowX: 0,
    targetShadowY: 0,
    active: false,
    raf: null
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const render = () => {
    state.currentX += (state.targetX - state.currentX) * speed;
    state.currentY += (state.targetY - state.currentY) * speed;
    state.currentShadowX += (state.targetShadowX - state.currentShadowX) * speed;
    state.currentShadowY += (state.targetShadowY - state.currentShadowY) * speed;

    card.style.transform = `
      rotateX(${state.currentX}deg)
      rotateY(${state.currentY}deg)
      translate3d(0, 0, 0)
    `;

    card.style.boxShadow = `
      ${state.currentShadowX}px ${state.currentShadowY}px 90px rgba(0,0,0,.38)
    `;

    const done =
      Math.abs(state.targetX - state.currentX) < 0.02 &&
      Math.abs(state.targetY - state.currentY) < 0.02 &&
      Math.abs(state.targetShadowX - state.currentShadowX) < 0.02 &&
      Math.abs(state.targetShadowY - state.currentShadowY) < 0.02;

    if (state.active || !done) {
      state.raf = requestAnimationFrame(render);
    } else {
      state.raf = null;
    }
  };

  const start = () => {
    if (!state.raf) state.raf = requestAnimationFrame(render);
  };

  const updateTargets = (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));

    state.targetX = (0.5 - clampedY) * 2 * maxRotate;
    state.targetY = (clampedX - 0.5) * 2 * maxRotate;

    state.targetShadowX = (clampedX - 0.5) * -maxLift;
    state.targetShadowY = (clampedY - 0.5) * -maxLift;

    start();
  };

  card.addEventListener("pointerenter", (e) => {
    state.active = true;
    updateTargets(e);
  });

  card.addEventListener("pointermove", updateTargets);

  card.addEventListener("pointerleave", () => {
    state.active = false;
    state.targetX = 0;
    state.targetY = 0;
    state.targetShadowX = 0;
    state.targetShadowY = 0;
    start();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const heroTilt = document.getElementById("heroTilt");
  if (heroTilt) {
    initSmoothTilt(heroTilt, {
      maxRotate: 13,
      maxLift: 12,
      speed: 0.07
    });
  }
});

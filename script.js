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
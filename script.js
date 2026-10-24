// ========== THEME TOGGLE ==========
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function getSavedTheme() {
  try { return localStorage.getItem("theme"); } catch { return null; }
}

const initialTheme =
  getSavedTheme() ||
  (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
root.setAttribute("data-theme", initialTheme);

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch {}
});

// ========== MOBILE MENU ==========
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    burger.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

// ========== TYPING EFFECT ==========
const words = ["web apps.", "clean APIs.", "Next.js frontends.", "Laravel backends.", "automations."];
const typedEl = document.getElementById("typed");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const word = words[wordIndex];
  typedEl.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1600);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 300);
  }
}
type();

// ========== NAV: SCROLL STATE + ACTIVE LINK + BACK TO TOP ==========
const nav = document.getElementById("nav");
const toTop = document.getElementById("toTop");
const sections = document.querySelectorAll("main section[id]");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 600);

  let current = "";
  sections.forEach((s) => {
    if (y >= s.offsetTop - 120) current = s.id;
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`)
  );
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ========== REVEAL ON SCROLL + STAT COUNTERS ==========
function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ========== PROJECT FILTERS ==========
const filterButtons = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.filter;
    projects.forEach((p) => {
      p.classList.toggle("hidden", cat !== "all" && p.dataset.cat !== cat);
    });
  })
);

// ========== CONTACT FORM (mailto, no backend needed) ==========
const CONTACT_EMAIL = "fahim52510@gmail.com";

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = encodeURIComponent(`Portfolio message from ${data.get("name")}`);
  const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

// ========== NEWSLETTER SIGNUP (static-friendly form service) ==========
// TODO(issue #2): replace with the real endpoint once the provider is chosen,
// e.g. Formspree: "https://formspree.io/f/<form-id>". Until then nothing is sent.
const NEWSLETTER_ENDPOINT = "REPLACE_WITH_NEWSLETTER_ENDPOINT";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterStatus = document.getElementById("newsletterStatus");
const newsletterButton = newsletterForm.querySelector("button[type=submit]");

function setNewsletterStatus(message, type) {
  newsletterStatus.textContent = message;
  newsletterStatus.className = `newsletter__status${type ? ` is-${type}` : ""}`;
  newsletterEmail.setAttribute("aria-invalid", type === "error" ? "true" : "false");
}

newsletterEmail.addEventListener("input", () => {
  if (newsletterStatus.classList.contains("is-error")) setNewsletterStatus("", null);
});

newsletterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = newsletterEmail.value.trim();

  if (!email) return setNewsletterStatus("Please enter your email address.", "error");
  if (!EMAIL_PATTERN.test(email)) return setNewsletterStatus("That email doesn't look right. Try name@example.com.", "error");
  if (!NEWSLETTER_ENDPOINT.startsWith("https://")) {
    return setNewsletterStatus("Signups aren't open yet. Please check back soon.", "error");
  }

  newsletterButton.disabled = true;
  newsletterButton.textContent = "Subscribing…";
  setNewsletterStatus("", null);

  try {
    const res = await fetch(NEWSLETTER_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(newsletterForm),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    newsletterForm.reset();
    setNewsletterStatus("You're in! Thanks for subscribing.", "success");
  } catch {
    setNewsletterStatus("Something went wrong. Please try again in a moment.", "error");
  } finally {
    newsletterButton.disabled = false;
    newsletterButton.textContent = "Subscribe";
  }
});

// ========== FOOTER YEAR ==========
document.getElementById("year").textContent = new Date().getFullYear();

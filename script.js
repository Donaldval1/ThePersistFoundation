document.documentElement.classList.add("js");

// Mobile navigation
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function setNav(open) {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNav(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

// Reveal-on-scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Highlight the current section in the nav
const navLinks = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

// Donation amount picker — submits to PayPal's donate page
const donateForm = document.getElementById("donate-form");
const donateTotal = document.getElementById("donate-total");
const donateNote = document.getElementById("donate-note");
const donateOther = document.getElementById("donate-other");
const donateAmount = document.getElementById("donate-amount");
const presets = donateForm.querySelectorAll('input[name="preset"]');

function currentAmount() {
  const other = parseFloat(donateOther.value);
  if (other > 0) return Math.round(other * 100) / 100;
  const picked = donateForm.querySelector('input[name="preset"]:checked');
  return picked ? parseInt(picked.value, 10) : 0;
}

function updateTotal() {
  const amount = currentAmount();
  donateTotal.textContent = amount ? "$" + amount.toLocaleString() : "";
}

presets.forEach((r) => r.addEventListener("change", () => { donateOther.value = ""; updateTotal(); }));
donateOther.addEventListener("input", () => {
  if (donateOther.value) presets.forEach((r) => (r.checked = false));
  updateTotal();
});

donateForm.addEventListener("submit", (e) => {
  const amount = currentAmount();
  if (!amount) {
    e.preventDefault();
    donateNote.textContent = "Please choose or enter an amount.";
    donateNote.className = "form-note error";
    return;
  }
  donateAmount.value = amount.toFixed(2);
  donateNote.textContent = "Opening PayPal in a new tab… Thank you for your support!";
  donateNote.className = "form-note success";
});

// Contact form (client-side validation; opens the visitor's email app)
const contactForm = document.getElementById("contact-form");
const contactNote = document.getElementById("contact-note");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  contactForm.querySelectorAll("[required]").forEach((input) => {
    const ok = input.checkValidity() && input.value.trim() !== "";
    input.closest(".field").classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    contactNote.textContent = "Please fill in your name, a valid email and a message.";
    contactNote.className = "form-note error";
    return;
  }

  const { name, email, interest, message } = contactForm;
  const subject = encodeURIComponent(`${interest.value} — ${name.value}`);
  const body = encodeURIComponent(`${message.value}\n\nFrom: ${name.value} <${email.value}>`);
  window.location.href = `mailto:thepersistfoundation@gmail.com?subject=${subject}&body=${body}`;

  contactNote.textContent = "Thanks! Your email app should open to send the message.";
  contactNote.className = "form-note success";
  contactForm.reset();
});

// "Get Involved" links preselect the matching topic in the contact form
document.querySelectorAll("[data-interest]").forEach((link) => {
  link.addEventListener("click", () => {
    contactForm.interest.value = link.dataset.interest;
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

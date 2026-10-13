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

// Donation amount picker
const donateForm = document.getElementById("donate-form");
const donateTotal = document.getElementById("donate-total");
const donateNote = document.getElementById("donate-note");

function currentAmount() {
  const custom = parseInt(donateForm.custom.value, 10);
  if (custom > 0) return custom;
  const picked = donateForm.querySelector('input[name="amount"]:checked');
  return picked ? parseInt(picked.value, 10) : 0;
}

donateForm.addEventListener("input", (e) => {
  if (e.target.name === "amount") donateForm.custom.value = "";
  if (e.target.name === "custom" && e.target.value) {
    donateForm.querySelectorAll('input[name="amount"]').forEach((r) => (r.checked = false));
  }
  donateTotal.textContent = "$" + currentAmount().toLocaleString();
});

donateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = currentAmount();
  if (!amount) {
    donateNote.textContent = "Please choose or enter an amount.";
    donateNote.className = "form-note error";
    return;
  }
  // TODO: connect to a payment provider (e.g. Stripe, PayPal, Givebutter).
  donateNote.textContent = `Thank you! Online giving of $${amount.toLocaleString()} will be available soon.`;
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
  window.location.href = `mailto:info@thepersistfoundation.org?subject=${subject}&body=${body}`;

  contactNote.textContent = "Thanks! Your email app should open to send the message.";
  contactNote.className = "form-note success";
  contactForm.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();

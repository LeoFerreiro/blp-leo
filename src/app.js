const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const modal = document.querySelector("[data-modal]");
const toast = document.querySelector("[data-toast]");

navToggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a, .header-cta, .hero-actions a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}, { passive: true });

document.querySelectorAll("[data-services] .service-row").forEach((row) => {
  row.addEventListener("click", () => {
    document.querySelectorAll("[data-services] .service-row").forEach((item) => item.classList.remove("is-active"));
    row.classList.add("is-active");
  });
});

document.querySelectorAll("[data-steps] .step").forEach((step) => {
  step.addEventListener("click", () => {
    document.querySelectorAll("[data-steps] .step").forEach((item) => item.classList.remove("is-active"));
    step.classList.add("is-active");
  });
});

document.querySelector("[data-modal-open]")?.addEventListener("click", () => modal?.showModal());
document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => modal?.close());
});

document.querySelector("[data-download]")?.addEventListener("click", () => {
  toast?.classList.add("is-visible");
  window.setTimeout(() => toast?.classList.remove("is-visible"), 2600);
});

const form = document.querySelector("[data-form]");
const status = document.querySelector("[data-form-status]");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, select, textarea")];
  const invalid = fields.filter((field) => field.hasAttribute("required") && !field.value.trim());

  fields.forEach((field) => field.closest("label")?.classList.toggle("has-error", invalid.includes(field)));

  if (invalid.length) {
    status.textContent = "Completa los campos obligatorios para enviar la consulta.";
    invalid[0].focus();
    return;
  }

  status.textContent = "Mensaje enviado. Te contactaremos para coordinar el diagnostico.";
  form.reset();
});

const counters = document.querySelectorAll("[data-count]");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const finalValue = Number(target.getAttribute("data-count"));
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      target.textContent = String(Math.round(finalValue * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    observer.unobserve(target);
  });
}, { threshold: 0.6 });

counters.forEach((counter) => observer.observe(counter));

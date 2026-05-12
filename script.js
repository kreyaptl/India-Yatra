/* ============================================================
   IndiaYatra · script.js  (Multi-Page Edition)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ── STICKY HEADER ─────────────────────────────────────────
  const header      = document.getElementById("header");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", () => {
    if (header)      header.classList.toggle("scrolled", window.scrollY > 20);
    if (scrollTopBtn) scrollTopBtn.classList.toggle("show", window.scrollY > 400);
  });

  // ── HAMBURGER ─────────────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const nav       = document.getElementById("nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => nav.classList.toggle("open"));
    document.querySelectorAll(".nav-link, .btn-nav").forEach(link =>
      link.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // ── SCROLL TO TOP ─────────────────────────────────────────
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // ── SEARCH WIDGET TABS (home) ─────────────────────────────
  document.querySelectorAll(".stab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".stab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // ── SWAP BUTTON (home search) ────────────────────────────
  const swapBtn = document.querySelector(".swap-btn");
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".sf-input[type='text']");
      if (inputs.length >= 2) {
        const tmp = inputs[0].value;
        inputs[0].value = inputs[1].value;
        inputs[1].value = tmp;
      }
    });
  }

  // ── SERVICE FILTER (services page) ───────────────────────
  const filterInput = document.getElementById("filterInput");
  if (filterInput) {
    filterInput.addEventListener("input", () => {
      const val = filterInput.value.trim().toLowerCase();
      document.querySelectorAll(".vehicle-card").forEach(card => {
        const name = card.dataset.name || "";
        card.style.display = name.includes(val) ? "" : "none";
      });
    });
  }

  // ── FARE CALCULATOR ───────────────────────────────────────
  const rates = { bus:5, cab:12, auto:10, metro:4, train:6, plane:20 };
  const baseFares = { bus:25, cab:50, auto:25, metro:10, train:15, plane:500 };
  const labels = {
    bus:   "State bus — affordable & frequent",
    cab:   "Door-to-door convenience",
    auto:  "Short trips — meter-based",
    metro: "Urban transit — fastest in city",
    train: "Long-distance comfort",
    plane: "Cross-country — book early for best fares"
  };

  const calcBtn    = document.getElementById("calcFareBtn");
  const fareDisplay = document.getElementById("fareDisplay");
  const fareNote    = document.getElementById("fareNote");

  if (calcBtn && fareDisplay) {
    calcBtn.addEventListener("click", () => {
      const type = document.getElementById("vehicleType").value;
      const dist = parseFloat(document.getElementById("distKm").value);
      if (!dist || dist <= 0) { showToast("Please enter a valid distance!"); return; }

      const fare = Math.round(dist * rates[type] + (baseFares[type] || 0));
      fareDisplay.textContent = "₹ " + fare.toLocaleString("en-IN");
      if (fareNote) fareNote.textContent = labels[type] || "";

      // Breakdown (calculator page)
      const baseFareEl = document.getElementById("baseFare");
      const perKmEl    = document.getElementById("perKm");
      const distOutEl  = document.getElementById("distOut");
      if (baseFareEl) baseFareEl.textContent = "₹" + (baseFares[type] || 0);
      if (perKmEl)    perKmEl.textContent    = "₹" + rates[type] + "/km";
      if (distOutEl)  distOutEl.textContent  = dist + " km";

      fareDisplay.style.transform = "scale(1.15)";
      setTimeout(() => (fareDisplay.style.transform = "scale(1)"), 300);
    });
  }

  // ── STAR RATING ───────────────────────────────────────────
  const stars       = document.querySelectorAll("#stars i");
  const starCaption = document.getElementById("starCaption");
  let selectedRating = 0;
  const captions = ["", "Poor", "Fair", "Good", "Very Good", "Excellent! ⭐"];

  stars.forEach((star, i) => {
    star.addEventListener("mouseenter", () => fillStars(i + 1, true));
    star.addEventListener("mouseleave", () => fillStars(selectedRating, false));
    star.addEventListener("click", () => {
      selectedRating = i + 1;
      fillStars(selectedRating, false);
      if (starCaption) starCaption.textContent = captions[selectedRating];
    });
  });

  function fillStars(count, hover) {
    stars.forEach((s, i) => {
      s.className = i < count ? "fas fa-star active" : "far fa-star";
    });
  }

  // ── FEEDBACK SUBMIT ───────────────────────────────────────
  const fbSubmit  = document.getElementById("fbSubmit");
  const fbSuccess = document.getElementById("fbSuccess");

  if (fbSubmit) {
    fbSubmit.addEventListener("click", () => {
      const name = document.getElementById("fbName")?.value.trim();
      const msg  = document.getElementById("fbMsg")?.value.trim();

      if (!selectedRating)  { showToast("Please select a star rating!"); return; }
      if (!name)             { showToast("Please enter your name!"); return; }
      if (!msg)              { showToast("Please write a message!"); return; }

      if (fbSuccess) fbSuccess.classList.add("show");
      fbSubmit.disabled = true;
      fbSubmit.style.opacity = "0.6";

      setTimeout(() => {
        if (fbSuccess) fbSuccess.classList.remove("show");
        if (document.getElementById("fbName")) document.getElementById("fbName").value = "";
        if (document.getElementById("fbMsg"))  document.getElementById("fbMsg").value  = "";
        selectedRating = 0;
        fillStars(0, false);
        if (starCaption) starCaption.textContent = "Tap a star to rate";
        fbSubmit.disabled = false;
        fbSubmit.style.opacity = "";
      }, 4000);
    });
  }

  // ── BOOKING DEMO (services page) ─────────────────────────
  const bookBtn     = document.getElementById("bookBtn");
  const bookSuccess = document.getElementById("bookSuccess");
  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      const name = document.getElementById("passName")?.value.trim();
      const date = document.getElementById("tripDate")?.value;
      if (!name) { showToast("Please enter passenger name!"); return; }
      if (!date) { showToast("Please select a travel date!"); return; }
      if (bookSuccess) bookSuccess.classList.add("show");
      bookBtn.disabled = true;
      setTimeout(() => {
        if (bookSuccess) bookSuccess.classList.remove("show");
        bookBtn.disabled = false;
      }, 4000);
    });
  }

  // ── HELP DESK (services page) ────────────────────────────
  const helpBtn     = document.getElementById("helpBtn");
  const helpSuccess = document.getElementById("helpSuccess");
  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      const name = document.getElementById("helpName")?.value.trim();
      const msg  = document.getElementById("helpMsg")?.value.trim();
      if (!name) { showToast("Please enter your name!"); return; }
      if (!msg)  { showToast("Please write your message!"); return; }
      if (helpSuccess) helpSuccess.classList.add("show");
      helpBtn.disabled = true;
      setTimeout(() => {
        if (helpSuccess) helpSuccess.classList.remove("show");
        helpBtn.disabled = false;
      }, 4000);
    });
  }

  // ── AUTH TABS ─────────────────────────────────────────────
  const authTabs = document.querySelectorAll(".auth-tab");
  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      authTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
      const target = document.getElementById(tab.dataset.tab + "Form");
      if (target) target.classList.add("active");
    });
  });

  // ── LOGIN ─────────────────────────────────────────────────
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("loginEmail")?.value.trim();
      const pass  = document.getElementById("loginPass")?.value;
      if (!email || !pass) { showToast("Please fill in all fields!"); return; }
      if (!isValidEmail(email)) { showToast("Enter a valid email address!"); return; }
      showToast("Login successful! Welcome back ✅", "success");
    });
  }

  // ── REGISTER ─────────────────────────────────────────────
  const registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      const name    = document.getElementById("regName")?.value.trim();
      const email   = document.getElementById("regEmail")?.value.trim();
      const pass    = document.getElementById("regPass")?.value;
      const confirm = document.getElementById("regConfirm")?.value;
      if (!name || !email || !pass || !confirm) { showToast("Please fill in all fields!"); return; }
      if (!isValidEmail(email))  { showToast("Enter a valid email address!"); return; }
      if (pass.length < 6)       { showToast("Password must be at least 6 characters!"); return; }
      if (pass !== confirm)       { showToast("Passwords do not match ❌"); return; }
      showToast("Account created! Welcome to IndiaYatra ✅", "success");
    });
  }

  // ── CARD ENTRANCE ANIMATION ───────────────────────────────
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".card, .vehicle-card, .dest-card, .testimonial-card, .rate-card, .team-card, .extra-card").forEach((el, i) => {
    el.style.opacity    = "0";
    el.style.transform  = "translateY(28px)";
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s, box-shadow 0.3s`;
    cardObserver.observe(el);
  });

  // ── HELPERS ───────────────────────────────────────────────
  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  function showToast(msg, type = "error") {
    const old = document.querySelector(".toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    toast.style.background = type === "success" ? "#4A7C59" : "#C97C5B";

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(10px)";
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

});
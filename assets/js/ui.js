/*==================================================
  UI JS - Modals, Toasts, Confetti & Scroll Helpers
==================================================*/

/*========== DARK / LIGHT THEME TOGGLE ==========*/
export const initThemeToggle = () => {
  const themeButton = document.getElementById("theme-button");
  const themeIcon = document.getElementById("theme-icon");
  const themeKey = "steakhouse_theme";

  const setTheme = (theme) => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
      if (themeIcon) {
        themeIcon.classList.remove("ri-sun-line");
        themeIcon.classList.add("ri-moon-line");
      }
    } else {
      document.body.classList.remove("light-theme");
      if (themeIcon) {
        themeIcon.classList.remove("ri-moon-line");
        themeIcon.classList.add("ri-sun-line");
      }
    }
  };

  // Check saved preference
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme) {
    setTheme(savedTheme);
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light-theme");
      const current = isLight ? "light" : "dark";
      localStorage.setItem(themeKey, current);
      setTheme(current);
    });
  }
};

/*========== MODAL & SCROLL LOCK HELPERS ==========*/
export const openModal = (modalEl) => {
  if (!modalEl) return;
  modalEl.hidden = false;
  requestAnimationFrame(() => {
    modalEl.classList.add("modal--show");
  });
  document.body.classList.add("lock-scroll");
};

export const closeModal = (modalEl) => {
  if (!modalEl) return;
  modalEl.classList.remove("modal--show");
  setTimeout(() => {
    modalEl.hidden = true;
    checkLockScroll();
  }, 350);
};

export const checkLockScroll = () => {
  const openModals = document.querySelectorAll(".modal_backdrop.modal--show");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOpen = cartDrawer && cartDrawer.classList.contains("cart--show");
  if (openModals.length === 0 && !cartOpen) {
    document.body.classList.remove("lock-scroll");
  }
};

/*========== RAINBOW CONFETTI (LIGHTWEIGHT CANVAS) ==========*/
export const launchRainbowConfetti = () => {
  // Respect user preference for reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Prevent multiple overlapping canvases
  const existing = document.getElementById("confetti-canvas");
  if (existing) existing.remove();

  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  // Vibrant rainbow palette: red, orange, yellow, green, blue, purple, pink
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#3b82f6", // blue
    "#a855f7", // purple
    "#ec4899", // pink
  ];

  const particleCount = 75;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * (0.35 + Math.random() * 0.3),
      y: height * 0.45,
      w: Math.random() * 8 + 5,
      h: Math.random() * 12 + 6,
      vx: (Math.random() - 0.5) * 16,
      vy: -(Math.random() * 14 + 6),
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      gravity: 0.32,
      drag: 0.98,
    });
  }

  let animationFrameId;
  const startTime = performance.now();
  const maxDuration = 2800; // 2.8s total celebration

  const render = (currentTime) => {
    const elapsed = currentTime - startTime;
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.rot += p.vRot;

      if (elapsed > 1600) {
        p.opacity = Math.max(0, 1 - (elapsed - 1600) / 1200);
      }

      if (p.opacity > 0 && p.y < height + 50) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (elapsed < maxDuration && activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  };

  animationFrameId = requestAnimationFrame(render);
};

/*========== TOAST NOTIFICATION ==========*/
export const showToast = ({ image, title, message, quantity = 1, status }) => {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const statusText =
    status ||
    (title === "Table Reserved"
      ? "Reservation Confirmed"
      : title === "Order Placed"
      ? "Order Confirmed"
      : "Added to Cart");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <img src="${image}" alt="${title}" class="toast_img" />
    <div class="toast_body">
      <div class="toast_header">
        <i class="ri-checkbox-circle-fill toast_icon"></i>
        <span class="toast_status">${statusText}</span>
      </div>
      <div class="toast_title">${title} ${quantity > 1 ? `(&times;${quantity})` : ""}</div>
      <div class="toast_detail">${message}</div>
    </div>
    <button type="button" class="toast_close" aria-label="Dismiss toast">
      <i class="ri-close-line"></i>
    </button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("toast--show");
  });

  const dismiss = () => {
    toast.classList.remove("toast--show");
    setTimeout(() => toast.remove(), 350);
  };

  const closeBtn = toast.querySelector(".toast_close");
  if (closeBtn) {
    closeBtn.addEventListener("click", dismiss);
  }

  setTimeout(dismiss, 3500);
};

/*========== SCROLL PROGRESS INDICATOR ==========*/
export const initScrollProgress = () => {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  const updateProgress = () => {
    const totalScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
};

/*========== SCROLL UP BUTTON ==========*/
export const initScrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  if (!scrollUp) return;

  const handleScroll = () => {
    window.scrollY >= 350
      ? scrollUp.classList.add("show-scroll")
      : scrollUp.classList.remove("show-scroll");
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
};

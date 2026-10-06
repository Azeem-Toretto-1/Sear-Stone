/*==================================================
  SEAR & STONE - SCRIPT JS
  Modular, accessible & vanilla JavaScript
==================================================*/

/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* Show menu */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* Hide menu */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MOBILE MENU ===============*/
const navLink = document.querySelectorAll(".nav_link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu) {
    navMenu.classList.remove("show-menu");
  }
};

navLink.forEach((n) => n.addEventListener("click", linkAction));

/*=============== CHANGE HEADER STYLES ===============*/
const scrollHeader = () => {
  const header = document.getElementById("header");
  if (!header) return;
  window.scrollY >= 50
    ? header.classList.add("scroll-header")
    : header.classList.remove("scroll-header");
};

window.addEventListener("scroll", scrollHeader);

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  if (!scrollUp) return;
  window.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const id = section.id,
      top = section.offsetTop - 50,
      height = section.offsetHeight,
      link = document.querySelector(".nav_menu a[href*=" + id + "]");

    if (!link) return;

    link.classList.toggle(
      "active-link",
      scrollY > top && scrollY <= top + height,
    );
  });
};
window.addEventListener("scroll", scrollActive);

/*==================================================
  FEATURE 16: WEBSITE INITIAL LOADER
==================================================*/
const initPageLoader = () => {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  const hideLoader = () => {
    if (!loader.classList.contains("loader-hidden")) {
      loader.classList.add("loader-hidden");
      document.body.classList.remove("lock-scroll");
    }
  };

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 350);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hideLoader, 350);
    });
  }

  // Fallback so the loader is guaranteed to never be stuck
  setTimeout(hideLoader, 2500);
};

/*==================================================
  FEATURE 14: DARK / LIGHT THEME TOGGLE
==================================================*/
const initThemeToggle = () => {
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

/*==================================================
  FEATURE 15: SCROLL PROGRESS INDICATOR
==================================================*/
const initScrollProgress = () => {
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

/*==================================================
  FEATURE 11: DYNAMIC OPENING HOURS STATUS
==================================================*/
const initOpeningStatus = () => {
  const statusContainer = document.getElementById("footer-status");
  if (!statusContainer) return;

  const calculateStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMins = hours * 60 + minutes;

    const openMins = 9 * 60; // 9:00 AM
    const closeMins = (day === 0 ? 18 : 20) * 60; // Sun: 6 PM (18:00), Mon-Sat: 8 PM (20:00)

    const isOpen = currentMins >= openMins && currentMins < closeMins;

    if (isOpen) {
      const closingTime = day === 0 ? "6:00 PM" : "8:00 PM";
      statusContainer.innerHTML = `
        <span class="status_badge status--open" title="Restaurant is open">
          <span class="status_dot"></span>
          <span>Open Now &bull; Closes at ${closingTime}</span>
        </span>
      `;
    } else {
      let nextNotice = "Opens tomorrow at 9:00 AM";
      if (currentMins < openMins) {
        nextNotice = "Opens today at 9:00 AM";
      }
      statusContainer.innerHTML = `
        <span class="status_badge status--closed" title="Restaurant is currently closed">
          <span class="status_dot"></span>
          <span>Closed &bull; ${nextNotice}</span>
        </span>
      `;
    }
  };

  calculateStatus();
  setInterval(calculateStatus, 60000);
};

/*==================================================
  FEATURE 12: EVENTS COUNTDOWN TIMER
==================================================*/
const initEventCountdown = () => {
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minsEl = document.getElementById("countdown-minutes");
  const secsEl = document.getElementById("countdown-seconds");
  const container = document.getElementById("events-countdown");

  if (!container || !daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Upcoming Event: Barbecue Party on October 26, 2026 at 12:30 PM
  const eventTarget = new Date("2026-10-26T12:30:00").getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const diff = eventTarget - now;

    if (diff <= 0) {
      container.innerHTML = `
        <div class="countdown_ended">
          <span>Event Started! Welcome to our Barbecue Party.</span>
        </div>
      `;
      return true;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
    return false;
  };

  const isFinished = updateCountdown();
  if (!isFinished) {
    const timerId = setInterval(() => {
      if (updateCountdown()) {
        clearInterval(timerId);
      }
    }, 1000);
  }
};

/*==================================================
  FEATURE 13: TESTIMONIALS SECTION CAROUSEL
==================================================*/
const initTestimonialsCarousel = () => {
  const track = document.getElementById("testimonials-track");
  const prevBtn = document.getElementById("testimonials-prev");
  const nextBtn = document.getElementById("testimonials-next");
  const dotsContainer = document.getElementById("testimonials-dots");
  const carouselEl = document.getElementById("testimonials-carousel");

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll(".testimonial_card");
  const count = slides.length;
  if (count === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Create indicator dots
  dotsContainer.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = `testimonial_dot ${i === 0 ? "active" : ""}`;
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Review slide ${i + 1}`);
    dot.addEventListener("click", () => {
      goTo(i);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll(".testimonial_dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  };

  const goTo = (index) => {
    currentIndex = (index + count) % count;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  prevBtn.addEventListener("click", () => {
    goTo(currentIndex - 1);
    resetAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    goTo(currentIndex + 1);
    resetAutoplay();
  });

  // Keyboard accessibility
  if (carouselEl) {
    carouselEl.setAttribute("tabindex", "0");
    carouselEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        goTo(currentIndex - 1);
        resetAutoplay();
      } else if (e.key === "ArrowRight") {
        goTo(currentIndex + 1);
        resetAutoplay();
      }
    });

    // Pause on hover
    carouselEl.addEventListener("mouseenter", () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
    });
    carouselEl.addEventListener("mouseleave", () => {
      startAutoplay();
    });
  }

  const startAutoplay = () => {
    autoplayTimer = setInterval(() => {
      goTo(currentIndex + 1);
    }, 7000);
  };

  const resetAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
    startAutoplay();
  };

  startAutoplay();
};

/*==================================================
  FEATURE 1: RAINBOW CONFETTI (LIGHTWEIGHT CANVAS)
==================================================*/
const launchRainbowConfetti = () => {
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

/*==================================================
  MODAL & SCROLL LOCK HELPERS
==================================================*/
const openModal = (modalEl) => {
  if (!modalEl) return;
  modalEl.hidden = false;
  requestAnimationFrame(() => {
    modalEl.classList.add("modal--show");
  });
  document.body.classList.add("lock-scroll");
};

const closeModal = (modalEl) => {
  if (!modalEl) return;
  modalEl.classList.remove("modal--show");
  setTimeout(() => {
    modalEl.hidden = true;
    checkLockScroll();
  }, 350);
};

const checkLockScroll = () => {
  const openModals = document.querySelectorAll(".modal_backdrop.modal--show");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOpen = cartDrawer && cartDrawer.classList.contains("cart--show");
  if (openModals.length === 0 && !cartOpen) {
    document.body.classList.remove("lock-scroll");
  }
};

/*==================================================
  FEATURE 7: BEAUTIFUL ADD-TO-CART TOAST NOTIFICATION
==================================================*/
const showToast = ({ image, title, message, quantity = 1 }) => {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <img src="${image}" alt="${title}" class="toast_img" />
    <div class="toast_body">
      <div class="toast_header">
        <i class="ri-checkbox-circle-fill toast_icon"></i>
        <span class="toast_status">Added to Cart</span>
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

/*==================================================
  FEATURE 4, 5, 6: ORDERING & CART SYSTEM
==================================================*/
const CART_STORAGE_KEY = "steakhouse_cart";

const CartManager = {
  getCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse cart data", e);
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    this.updateCartBadge();
    renderCartDrawer();
  },

  addItem(item) {
    const cart = this.getCart();
    // Unique key distinguishes customizations
    const existingIndex = cart.findIndex((i) => i.key === item.key);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    this.saveCart(cart);

    // Show toast notification
    const customSummary = [item.doneness, item.side, item.sauce]
      .filter(Boolean)
      .join(" &bull; ");

    showToast({
      image: item.image,
      title: item.name,
      message: customSummary || "Item added to your order",
      quantity: item.quantity,
    });
  },

  updateQuantity(key, delta) {
    let cart = this.getCart();
    const item = cart.find((i) => i.key === key);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.key !== key);
    }
    this.saveCart(cart);
  },

  removeItem(key) {
    const cart = this.getCart().filter((i) => i.key !== key);
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart([]);
  },

  getTotals() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax
    const grandTotal = subtotal + tax;
    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    return { subtotal, tax, grandTotal, totalCount };
  },

  updateCartBadge() {
    const badge = document.getElementById("cart-count");
    const cartBtn = document.getElementById("cart-button");
    if (!badge) return;
    const { totalCount } = this.getTotals();
    badge.textContent = totalCount;

    badge.classList.remove("badge-bump");
    void badge.offsetWidth;
    badge.classList.add("badge-bump");
    setTimeout(() => badge.classList.remove("badge-bump"), 300);

    if (cartBtn) {
      cartBtn.classList.remove("cart-icon-bump");
      void cartBtn.offsetWidth;
      cartBtn.classList.add("cart-icon-bump");
      setTimeout(() => cartBtn.classList.remove("cart-icon-bump"), 400);
    }
  },
};

/*========== Cart Drawer UI Rendering ==========*/
const renderCartDrawer = () => {
  const container = document.getElementById("cart-items-container");
  const footer = document.getElementById("cart-footer");
  if (!container || !footer) return;

  const cart = CartManager.getCart();
  const { subtotal, tax, grandTotal } = CartManager.getTotals();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart_empty_state">
        <i class="ri-shopping-basket-line cart_empty_icon"></i>
        <h3 class="cart_empty_title">Your cart is empty</h3>
        <p class="cart_empty_desc">Select your favorite prime steaks and dishes to start your order.</p>
        <button type="button" class="button" id="cart-empty-explore-btn">
          Explore Menu
        </button>
      </div>
    `;

    footer.innerHTML = "";

    const exploreBtn = document.getElementById("cart-empty-explore-btn");
    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        closeCartDrawer();
        const menuSection = document.getElementById("menu");
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
    return;
  }

  // Render cart items
  container.innerHTML = cart
    .map((item) => {
      const customs = [item.doneness, item.side, item.sauce]
        .filter(Boolean)
        .join(" &bull; ");
      const itemSubtotal = (item.price * item.quantity).toFixed(2);

      return `
        <article class="cart_item_card" data-key="${item.key}">
          <img src="${item.image}" alt="${item.name}" class="cart_item_img" />
          <div class="cart_item_info">
            <div class="cart_item_top">
              <h4 class="cart_item_name">${item.name}</h4>
              <button type="button" class="cart_item_delete" data-action="delete" data-key="${item.key}" aria-label="Remove ${item.name}">
                <i class="ri-delete-bin-line"></i>
              </button>
            </div>
            ${customs ? `<span class="cart_item_customs">${customs}</span>` : ""}
            <div class="cart_item_meta">
              <span class="cart_item_price_unit">$${item.price.toFixed(2)}</span>
              <div class="cart_item_qty_ctrl">
                <button type="button" class="cart_item_btn" data-action="decrease" data-key="${item.key}" aria-label="Decrease quantity">
                  <i class="ri-subtract-line"></i>
                </button>
                <span class="cart_item_qty_num">${item.quantity}</span>
                <button type="button" class="cart_item_btn" data-action="increase" data-key="${item.key}" aria-label="Increase quantity">
                  <i class="ri-add-line"></i>
                </button>
              </div>
              <span class="cart_item_subtotal">$${itemSubtotal}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  // Render footer totals and checkout buttons
  footer.innerHTML = `
    <div class="cart_totals_table">
      <div class="cart_total_line">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="cart_total_line">
        <span>Tax (10%)</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="cart_total_line cart_total_line--grand">
        <span>Grand Total</span>
        <span>$${grandTotal.toFixed(2)}</span>
      </div>
    </div>
    <div class="cart_footer_actions">
      <button type="button" class="button btn_clear_cart" id="btn-clear-cart">
        Clear Cart
      </button>
      <button type="button" class="button btn_checkout_cart" id="btn-open-checkout">
        Checkout
      </button>
    </div>
  `;

  // Attach event listeners for item quantity/delete actions with micro-interactions
  container.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const key = btn.dataset.key;
      const card = btn.closest(".cart_item_card");

      if (action === "increase" || action === "decrease") {
        const qtyNum = card ? card.querySelector(".cart_item_qty_num") : null;
        if (qtyNum) {
          qtyNum.classList.remove("qty-bump");
          void qtyNum.offsetWidth;
          qtyNum.classList.add("qty-bump");
          setTimeout(() => qtyNum.classList.remove("qty-bump"), 200);
        }
        CartManager.updateQuantity(key, action === "increase" ? 1 : -1);
      } else if (action === "delete") {
        if (card) {
          card.classList.add("item-removing");
          setTimeout(() => {
            CartManager.removeItem(key);
          }, 280);
        } else {
          CartManager.removeItem(key);
        }
      }
    });
  });

  const clearBtn = document.getElementById("btn-clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      CartManager.clearCart();
    });
  }

  const checkoutBtn = document.getElementById("btn-open-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      closeCartDrawer();
      openCheckoutModal();
    });
  }
};

/*========== Open & Close Cart Drawer ==========*/
const openCartDrawer = () => {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer || !overlay) return;

  renderCartDrawer();
  drawer.hidden = false;
  overlay.hidden = false;

  requestAnimationFrame(() => {
    drawer.classList.add("cart--show");
    overlay.classList.add("cart--show");
  });

  document.body.classList.add("lock-scroll");
};

const closeCartDrawer = () => {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer || !overlay) return;

  drawer.classList.remove("cart--show");
  overlay.classList.remove("cart--show");

  setTimeout(() => {
    drawer.hidden = true;
    overlay.hidden = true;
    checkLockScroll();
  }, 350);
};

/*==================================================
  FEATURE 1, 2, 3: MENU DATA & DETAIL MODAL
==================================================*/
const MENU_DATA = {
  1: {
    id: 1,
    name: "Bruschetta",
    subName: "Artisanal Starter",
    category: "Starter",
    price: 14.0,
    image: "./assets/img/menu-dish-1.png",
    summary: "Start with our fresh baked bread with an egg and basil on top.",
    description:
      "Crisp artisanal toasted baguette topped with creamy burrata, farm-fresh egg, heirloom cherry tomatoes, aromatic wild basil, and drizzled with 18-year aged Modena balsamic glaze.",
    isSteak: false,
  },
  2: {
    id: 2,
    name: "Main Dish",
    subName: "Prime Dry-Aged Ribeye Steak",
    category: "Signature Cut",
    price: 38.0,
    image: "./assets/img/menu-dish-2.png",
    summary:
      "Our juicy, freshly grilled steak is served to satisfy your appetite.",
    description:
      "16oz USDA Prime Black Angus ribeye, dry-aged for 35 days and flame-seared over white oak embers. Finished with smoked sea salt and infused with rosemary and black garlic.",
    isSteak: true,
    donenessOptions: [
      "Rare",
      "Medium Rare",
      "Medium",
      "Medium Well",
      "Well Done",
    ],
    sideOptions: [
      "French Fries",
      "Mashed Potatoes",
      "Grilled Vegetables",
      "Caesar Salad",
    ],
    sauceOptions: [
      "Peppercorn",
      "Mushroom",
      "Garlic Butter",
      "Chimichurri",
    ],
  },
  3: {
    id: 3,
    name: "Salad Dish",
    subName: "Seared Wagyu Flank Salad",
    category: "Gourmet Salad",
    price: 18.0,
    image: "./assets/img/menu-dish-3.png",
    summary:
      "Accompany your steak with a healthy salad mixed with sliced lean meat.",
    description:
      "Thinly sliced seared Wagyu flank steak served over tender baby arugula, roasted pine nuts, shaved 24-month Parmigiano-Reggiano, and house-crafted citrus herb vinaigrette.",
    isSteak: false,
  },
  4: {
    id: 4,
    name: "Dessert",
    subName: "Valrhona Chocolate Fondant",
    category: "Artisan Dessert",
    price: 12.0,
    image: "./assets/img/menu-dish-4.png",
    summary:
      "End your culinary experience with a cake to cleanse your palate.",
    description:
      "Warm dark molten Valrhona chocolate fondant with a velvety liquid center, paired with house-churned Madagascar vanilla bean gelato and dusted with golden cocoa powder.",
    isSteak: false,
  },
};

const openMenuModal = (dishId) => {
  const dish = MENU_DATA[dishId];
  if (!dish) return;

  const modal = document.getElementById("menu-modal");
  const modalBody = document.getElementById("menu-modal-body");
  if (!modal || !modalBody) return;

  let currentQty = 1;
  let selectedDoneness = dish.isSteak ? "Medium Rare" : null;
  let selectedSide = dish.isSteak ? "French Fries" : null;
  let selectedSauce = dish.isSteak ? "Garlic Butter" : null;

  const renderModalContent = () => {
    modalBody.innerHTML = `
      <div class="modal_dish_preview">
        <img src="${dish.image}" alt="${dish.name}" class="modal_dish_img" />
      </div>

      <div class="modal_dish_header">
        <span class="modal_dish_tag">${dish.category}</span>
        <h2 class="modal_dish_title" id="modal-dish-name">${dish.name}</h2>
        <span class="modal_dish_subtitle">${dish.subName}</span>
      </div>

      <p class="modal_dish_desc">${dish.description}</p>

      <div class="modal_dish_price_row">
        <span class="modal_dish_price_label">Unit Price</span>
        <span class="modal_dish_price_val">$${dish.price.toFixed(2)}</span>
      </div>

      ${
        dish.isSteak
          ? `
        <div class="custom_sections">
          <!-- Doneness -->
          <div class="custom_group">
            <div class="custom_header">
              <span class="custom_title">Doneness</span>
              <span class="custom_required">Required</span>
            </div>
            <div class="custom_chips" id="doneness-chips">
              ${dish.donenessOptions
                .map(
                  (d) => `
                <button type="button" class="custom_chip ${d === selectedDoneness ? "chip-active" : ""}" data-type="doneness" data-val="${d}">
                  ${d}
                </button>
              `,
                )
                .join("")}
            </div>
          </div>

          <!-- Side -->
          <div class="custom_group">
            <div class="custom_header">
              <span class="custom_title">Choice of Side</span>
              <span class="custom_required">Required</span>
            </div>
            <div class="custom_chips" id="side-chips">
              ${dish.sideOptions
                .map(
                  (s) => `
                <button type="button" class="custom_chip ${s === selectedSide ? "chip-active" : ""}" data-type="side" data-val="${s}">
                  ${s}
                </button>
              `,
                )
                .join("")}
            </div>
          </div>

          <!-- Sauce -->
          <div class="custom_group">
            <div class="custom_header">
              <span class="custom_title">Signature Sauce</span>
              <span class="custom_required">Required</span>
            </div>
            <div class="custom_chips" id="sauce-chips">
              ${dish.sauceOptions
                .map(
                  (sc) => `
                <button type="button" class="custom_chip ${sc === selectedSauce ? "chip-active" : ""}" data-type="sauce" data-val="${sc}">
                  ${sc}
                </button>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>
      `
          : ""
      }

      <div class="modal_actions">
        <div class="qty_selector_wrap">
          <button type="button" class="qty_btn" id="modal-qty-minus" aria-label="Decrease quantity">
            <i class="ri-subtract-line"></i>
          </button>
          <span class="qty_count" id="modal-qty-val">${currentQty}</span>
          <button type="button" class="qty_btn" id="modal-qty-plus" aria-label="Increase quantity">
            <i class="ri-add-line"></i>
          </button>
        </div>

        <button type="button" class="button btn_modal_submit" id="modal-add-to-cart">
          Add to Cart &bull; $${(dish.price * currentQty).toFixed(2)}
        </button>
      </div>
    `;

    // Handle Customization chips click
    modalBody.querySelectorAll(".custom_chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const type = chip.dataset.type;
        const val = chip.dataset.val;
        if (type === "doneness") selectedDoneness = val;
        if (type === "side") selectedSide = val;
        if (type === "sauce") selectedSauce = val;
        renderModalContent();
      });
    });

    // Handle Quantity selectors
    const minusBtn = document.getElementById("modal-qty-minus");
    const plusBtn = document.getElementById("modal-qty-plus");
    const submitBtn = document.getElementById("modal-add-to-cart");

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        if (currentQty > 1) {
          currentQty--;
          document.getElementById("modal-qty-val").textContent = currentQty;
          submitBtn.innerHTML = `Add to Cart &bull; $${(dish.price * currentQty).toFixed(2)}`;
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        currentQty++;
        document.getElementById("modal-qty-val").textContent = currentQty;
        submitBtn.innerHTML = `Add to Cart &bull; $${(dish.price * currentQty).toFixed(2)}`;
      });
    }

    // Handle Add to Cart with tactile button micro-interaction
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        // Build composite key
        const keyParts = [dish.id];
        if (dish.isSteak) {
          keyParts.push(selectedDoneness, selectedSide, selectedSauce);
        }
        const key = keyParts.join("-").replace(/\s+/g, "_");

        const cartItem = {
          key,
          dishId: dish.id,
          name: dish.name,
          image: dish.image,
          price: dish.price,
          quantity: currentQty,
          doneness: selectedDoneness,
          side: selectedSide,
          sauce: selectedSauce,
        };

        // Immediate tactile micro-interaction on button
        submitBtn.classList.add("btn--added");
        submitBtn.innerHTML = `<i class="ri-check-line"></i> Added to Cart!`;

        setTimeout(() => {
          CartManager.addItem(cartItem);
          closeModal(modal);
        }, 300);
      });
    }
  };

  renderModalContent();
  openModal(modal);
};

/*==================================================
  FEATURE 8 & 9: RESERVATION FORM & CONFIRMATION
==================================================*/
const openReservationModal = () => {
  const modal = document.getElementById("reservation-modal");
  const modalBody = document.getElementById("reservation-modal-body");
  if (!modal || !modalBody) return;

  // Format today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  const renderForm = () => {
    modalBody.innerHTML = `
      <div class="form_header">
        <span class="form_badge">Reserve a Table</span>
        <h2 class="form_title" id="reservation-modal-title">Book Your Dining Experience</h2>
      </div>

      <form id="reservation-form" novalidate>
        <div class="form_grid form_grid--two">
          <div class="form_group">
            <label for="res-name" class="form_label">Full Name *</label>
            <input type="text" id="res-name" class="form_input" placeholder="e.g. Azeem Toretto" required />
            <span class="form_error_text" id="res-name-err">Please enter your full name (at least 2 characters).</span>
          </div>

          <div class="form_group">
            <label for="res-email" class="form_label">Email Address *</label>
            <input type="email" id="res-email" class="form_input" placeholder="e.g. azeem@example.com" required />
            <span class="form_error_text" id="res-email-err">Please enter a valid email address.</span>
          </div>

          <div class="form_group">
            <label for="res-phone" class="form_label">Phone Number *</label>
            <input type="tel" id="res-phone" class="form_input" placeholder="e.g. +1 555-0192" required />
            <span class="form_error_text" id="res-phone-err">Please enter a valid phone number.</span>
          </div>

          <div class="form_group">
            <label for="res-guests" class="form_label">Number of Guests *</label>
            <select id="res-guests" class="form_select" required>
              <option value="1">1 Guest</option>
              <option value="2" selected>2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5 Guests</option>
              <option value="6">6 Guests</option>
              <option value="7">7 Guests</option>
              <option value="8">8+ Guests (Large Party)</option>
            </select>
          </div>

          <div class="form_group">
            <label for="res-date" class="form_label">Reservation Date *</label>
            <input type="date" id="res-date" class="form_input" min="${today}" required />
            <span class="form_error_text" id="res-date-err">Date must be today or in the future.</span>
          </div>

          <div class="form_group">
            <label for="res-time" class="form_label">Preferred Time *</label>
            <select id="res-time" class="form_select" required>
              <option value="12:00 PM">12:00 PM (Lunch)</option>
              <option value="1:00 PM">1:00 PM (Lunch)</option>
              <option value="2:00 PM">2:00 PM (Lunch)</option>
              <option value="5:30 PM">5:30 PM (Dinner)</option>
              <option value="6:30 PM">6:30 PM (Dinner)</option>
              <option value="7:30 PM" selected>7:30 PM (Prime Dinner)</option>
              <option value="8:30 PM">8:30 PM (Dinner)</option>
              <option value="9:30 PM">9:30 PM (Late Dinner)</option>
            </select>
          </div>

          <div class="form_group form_group--full">
            <label for="res-seating" class="form_label">Seating Preference</label>
            <select id="res-seating" class="form_select">
              <option value="Standard Table">Standard Dining Table</option>
              <option value="Window View">Window View</option>
              <option value="Romantic Booth">Romantic Booth</option>
              <option value="Outdoor Terrace">Outdoor Terrace</option>
              <option value="Chef's Grill Counter">Chef's Grill Counter</option>
            </select>
          </div>

          <div class="form_group form_group--full">
            <label for="res-notes" class="form_label">Special Requests (Optional)</label>
            <textarea id="res-notes" class="form_textarea" placeholder="Dietary restrictions, anniversary celebration, high chair..."></textarea>
          </div>
        </div>

        <div class="form_actions">
          <button type="submit" class="button btn_form_submit">
            Confirm Reservation
          </button>
        </div>
      </form>
    `;

    const form = document.getElementById("reservation-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        validateAndSubmitReservation();
      });
    }
  };

  const validateAndSubmitReservation = () => {
    const nameInput = document.getElementById("res-name");
    const emailInput = document.getElementById("res-email");
    const phoneInput = document.getElementById("res-phone");
    const dateInput = document.getElementById("res-date");
    const timeSelect = document.getElementById("res-time");
    const guestsSelect = document.getElementById("res-guests");
    const seatingSelect = document.getElementById("res-seating");

    let isValid = true;

    // Name validation
    const nameVal = nameInput.value.trim();
    const nameErr = document.getElementById("res-name-err");
    if (nameVal.length < 2) {
      nameInput.classList.add("has-error");
      nameErr.classList.add("show-error");
      isValid = false;
    } else {
      nameInput.classList.remove("has-error");
      nameErr.classList.remove("show-error");
    }

    // Email validation
    const emailVal = emailInput.value.trim();
    const emailErr = document.getElementById("res-email-err");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      emailInput.classList.add("has-error");
      emailErr.classList.add("show-error");
      isValid = false;
    } else {
      emailInput.classList.remove("has-error");
      emailErr.classList.remove("show-error");
    }

    // Phone validation
    const phoneVal = phoneInput.value.trim();
    const phoneErr = document.getElementById("res-phone-err");
    const digitsOnly = phoneVal.replace(/\D/g, "");
    if (digitsOnly.length < 7) {
      phoneInput.classList.add("has-error");
      phoneErr.classList.add("show-error");
      isValid = false;
    } else {
      phoneInput.classList.remove("has-error");
      phoneErr.classList.remove("show-error");
    }

    // Date validation
    const dateVal = dateInput.value;
    const dateErr = document.getElementById("res-date-err");
    if (!dateVal || dateVal < today) {
      dateInput.classList.add("has-error");
      dateErr.classList.add("show-error");
      isValid = false;
    } else {
      dateInput.classList.remove("has-error");
      dateErr.classList.remove("show-error");
    }

    if (!isValid) return;

    // Button loading state micro-interaction
    const submitBtn = modalBody.querySelector(".btn_form_submit");
    if (submitBtn) {
      submitBtn.classList.add("btn--loading");
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="btn_spinner"></span> Confirming Reservation...`;
    }

    setTimeout(() => {
      // Format date nicely
      const dateObj = new Date(dateVal + "T00:00:00");
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const resRef = `#RES-${Math.floor(1000 + Math.random() * 9000)}`;

      // Show Confirmation State Card with smooth entrance
      modalBody.innerHTML = `
        <div class="confirmation_state">
          <div class="confirmation_badge">
            <i class="ri-check-line"></i>
          </div>
          <h2 class="confirmation_title">Reservation Confirmed</h2>
          <span class="confirmation_ref">Booking Ref: ${resRef}</span>

          <div class="confirmation_box">
            <div class="confirmation_row">
              <span class="confirmation_row_label">Guest Name</span>
              <span class="confirmation_row_val">${nameVal}</span>
            </div>
            <div class="confirmation_row">
              <span class="confirmation_row_label">Date</span>
              <span class="confirmation_row_val">${formattedDate}</span>
            </div>
            <div class="confirmation_row">
              <span class="confirmation_row_label">Time</span>
              <span class="confirmation_row_val">${timeSelect.value}</span>
            </div>
            <div class="confirmation_row">
              <span class="confirmation_row_label">Party Size</span>
              <span class="confirmation_row_val">${guestsSelect.value} Guests</span>
            </div>
            <div class="confirmation_row">
              <span class="confirmation_row_label">Seating</span>
              <span class="confirmation_row_val">${seatingSelect.value}</span>
            </div>
            <div class="confirmation_row">
              <span class="confirmation_row_label">Status</span>
              <span class="confirmation_row_val" style="color: hsl(140, 75%, 60%); font-weight: bold;">
                &check; Request Successfully Submitted
              </span>
            </div>
          </div>

          <p class="confirmation_msg">
            Thank you, ${nameVal}. Your table reservation request at Sear &amp; Stone has been received. Our maître d' has noted your request.
          </p>

          <button type="button" class="button btn_confirmation_done" id="res-done-btn">
            Done &bull; Return to Menu
          </button>
        </div>
      `;

      // Trigger Rainbow Confetti celebration!
      launchRainbowConfetti();

      // Toast notification
      showToast({
        image: "./assets/img/favicon.png",
        title: "Table Reserved",
        message: `Confirmed for ${nameVal} on ${formattedDate}`,
        quantity: parseInt(guestsSelect.value, 10),
      });

      const doneBtn = document.getElementById("res-done-btn");
      if (doneBtn) {
        doneBtn.addEventListener("click", () => {
          closeModal(modal);
        });
      }
    }, 650);
  };

  renderForm();
  openModal(modal);
};

/*==================================================
  FEATURE 10: CHECKOUT & ORDER FLOW
==================================================*/
const openCheckoutModal = () => {
  const modal = document.getElementById("checkout-modal");
  const modalBody = document.getElementById("checkout-modal-body");
  if (!modal || !modalBody) return;

  const { grandTotal, totalCount } = CartManager.getTotals();
  let deliveryType = "delivery"; // 'delivery' or 'pickup'

  const renderCheckoutForm = () => {
    modalBody.innerHTML = `
      <div class="form_header">
        <span class="form_badge">Checkout</span>
        <h2 class="form_title" id="checkout-modal-title">Complete Your Order</h2>
      </div>

      <div style="background-color: hsla(30, 32%, 56%, 0.1); border: 1px solid hsla(30, 32%, 56%, 0.25); padding: 0.85rem 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.9rem; font-weight: 600;">Items in Order: ${totalCount}</span>
        <span style="font-size: 1.2rem; font-weight: 700; color: var(--first-color);">Total: $${grandTotal.toFixed(2)}</span>
      </div>

      <form id="checkout-form" novalidate>
        <div class="form_grid form_grid--two">
          <div class="form_group form_group--full">
            <label class="form_label">Fulfillment Method</label>
            <div class="delivery_toggle_wrap">
              <button type="button" class="delivery_toggle_btn ${deliveryType === "delivery" ? "active" : ""}" data-type="delivery">
                <i class="ri-e-bike-2-line"></i> Delivery
              </button>
              <button type="button" class="delivery_toggle_btn ${deliveryType === "pickup" ? "active" : ""}" data-type="pickup">
                <i class="ri-store-2-line"></i> Curbside Pickup
              </button>
            </div>
          </div>

          <div class="form_group">
            <label for="chk-name" class="form_label">Full Name *</label>
            <input type="text" id="chk-name" class="form_input" placeholder="e.g. Azeem Toretto" required />
            <span class="form_error_text" id="chk-name-err">Please enter your name.</span>
          </div>

          <div class="form_group">
            <label for="chk-phone" class="form_label">Phone Number *</label>
            <input type="tel" id="chk-phone" class="form_input" placeholder="e.g. +1 555-0192" required />
            <span class="form_error_text" id="chk-phone-err">Please enter a valid phone number.</span>
          </div>

          <div class="form_group form_group--full">
            <label for="chk-email" class="form_label">Email Address *</label>
            <input type="email" id="chk-email" class="form_input" placeholder="e.g. azeem@example.com" required />
            <span class="form_error_text" id="chk-email-err">Please enter a valid email address.</span>
          </div>

          ${
            deliveryType === "delivery"
              ? `
            <div class="form_group form_group--full" id="chk-address-group">
              <label for="chk-address" class="form_label">Delivery Address *</label>
              <input type="text" id="chk-address" class="form_input" placeholder="e.g. 128th Street Avenue, Miraflores, Lima" required />
              <span class="form_error_text" id="chk-address-err">Delivery address is required.</span>
            </div>
          `
              : ""
          }

          <div class="form_group form_group--full">
            <label for="chk-notes" class="form_label">Order Notes (Optional)</label>
            <textarea id="chk-notes" class="form_textarea" placeholder="Utensils requested, gate access code, extra napkins..."></textarea>
          </div>
        </div>

        <div class="form_actions">
          <button type="submit" class="button btn_form_submit">
            Place Order &bull; $${grandTotal.toFixed(2)}
          </button>
        </div>
      </form>
    `;

    // Toggle delivery / pickup
    modalBody.querySelectorAll(".delivery_toggle_btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        deliveryType = btn.dataset.type;
        renderCheckoutForm();
      });
    });

    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        validateAndPlaceOrder();
      });
    }
  };

  const validateAndPlaceOrder = () => {
    const nameInput = document.getElementById("chk-name");
    const phoneInput = document.getElementById("chk-phone");
    const emailInput = document.getElementById("chk-email");
    const addressInput = document.getElementById("chk-address");

    let isValid = true;

    // Name
    const nameVal = nameInput.value.trim();
    const nameErr = document.getElementById("chk-name-err");
    if (nameVal.length < 2) {
      nameInput.classList.add("has-error");
      nameErr.classList.add("show-error");
      isValid = false;
    } else {
      nameInput.classList.remove("has-error");
      nameErr.classList.remove("show-error");
    }

    // Phone
    const phoneVal = phoneInput.value.trim();
    const phoneErr = document.getElementById("chk-phone-err");
    const digitsOnly = phoneVal.replace(/\D/g, "");
    if (digitsOnly.length < 7) {
      phoneInput.classList.add("has-error");
      phoneErr.classList.add("show-error");
      isValid = false;
    } else {
      phoneInput.classList.remove("has-error");
      phoneErr.classList.remove("show-error");
    }

    // Email
    const emailVal = emailInput.value.trim();
    const emailErr = document.getElementById("chk-email-err");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      emailInput.classList.add("has-error");
      emailErr.classList.add("show-error");
      isValid = false;
    } else {
      emailInput.classList.remove("has-error");
      emailErr.classList.remove("show-error");
    }

    // Address if delivery
    let addressVal = "";
    if (deliveryType === "delivery" && addressInput) {
      addressVal = addressInput.value.trim();
      const addrErr = document.getElementById("chk-address-err");
      if (addressVal.length < 5) {
        addressInput.classList.add("has-error");
        addrErr.classList.add("show-error");
        isValid = false;
      } else {
        addressInput.classList.remove("has-error");
        addrErr.classList.remove("show-error");
      }
    }

    if (!isValid) return;

    // Button loading state micro-interaction
    const submitBtn = modalBody.querySelector(".btn_form_submit");
    if (submitBtn) {
      submitBtn.classList.add("btn--loading");
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="btn_spinner"></span> Placing Order...`;
    }

    setTimeout(() => {
      const orderNum = `#SNS-${Math.floor(1000 + Math.random() * 9000)}`;

      // Clear cart upon completion
      CartManager.clearCart();

      // Render Order Success State with smooth entrance
      modalBody.innerHTML = `
        <div class="confirmation_state">
          <div class="confirmation_badge">
            <i class="ri-check-line"></i>
          </div>
          <h2 class="confirmation_title">Order Placed Successfully</h2>
          <span class="confirmation_ref">Order ID: ${orderNum}</span>

          <div class="confirmation_box">
            <div class="confirmation_row">
              <span class="confirmation_row_label">Customer</span>
              <span class="confirmation_row_val">${nameVal}</span>
            </div>
            <div class="confirmation_row">
              <span class="confirmation_row_label">Method</span>
              <span class="confirmation_row_val">${deliveryType === "delivery" ? "Direct Delivery" : "Curbside Pickup"}</span>
            </div>
            ${
              deliveryType === "delivery"
                ? `
              <div class="confirmation_row">
                <span class="confirmation_row_label">Address</span>
                <span class="confirmation_row_val">${addressVal}</span>
              </div>
            `
                : ""
            }
            <div class="confirmation_row">
              <span class="confirmation_row_label">Estimated Time</span>
              <span class="confirmation_row_val">35 &ndash; 45 Minutes</span>
            </div>
            <div class="confirmation_row">
              <span class="confirmation_row_label">Total Charged</span>
              <span class="confirmation_row_val" style="color: var(--first-color); font-weight: bold;">$${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <p class="confirmation_msg">
            Thank you for your order at Sear &amp; Stone, ${nameVal}. Our chefs are searing your cuts with care. You will receive an SMS update at ${phoneVal}.
          </p>

          <button type="button" class="button btn_confirmation_done" id="chk-done-btn">
            Back to Restaurant
          </button>
        </div>
      `;

      // Trigger Rainbow Confetti celebration!
      launchRainbowConfetti();

      showToast({
        image: "./assets/img/menu-dish-2.png",
        title: "Order Placed",
        message: `${orderNum} confirmed for ${nameVal}`,
        quantity: 1,
      });

      const doneBtn = document.getElementById("chk-done-btn");
      if (doneBtn) {
        doneBtn.addEventListener("click", () => {
          closeModal(modal);
        });
      }
    }, 650);
  };

  renderCheckoutForm();
  openModal(modal);
};

/*==================================================
  GLOBAL EVENT BINDINGS
==================================================*/
document.addEventListener("DOMContentLoaded", () => {
  // Initialize loader
  initPageLoader();

  // Initialize theme
  initThemeToggle();

  // Initialize scroll progress
  initScrollProgress();

  // Initialize opening status
  initOpeningStatus();

  // Initialize countdown
  initEventCountdown();

  // Initialize testimonials
  initTestimonialsCarousel();

  // Restore cart count badge
  CartManager.updateCartBadge();

  // Cart button in header
  const cartBtn = document.getElementById("cart-button");
  if (cartBtn) {
    cartBtn.addEventListener("click", openCartDrawer);
  }

  // Cart close button
  const cartCloseBtn = document.getElementById("cart-close");
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", closeCartDrawer);
  }

  // Cart overlay click
  const cartOverlay = document.getElementById("cart-overlay");
  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCartDrawer);
  }

  // Menu cards & order buttons click
  document.querySelectorAll(".menu_card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const dishId = card.dataset.dishId;
      if (dishId) openMenuModal(dishId);
    });

    // Keyboard enter / space support for menu card
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const dishId = card.dataset.dishId;
        if (dishId) openMenuModal(dishId);
      }
    });
  });

  document.querySelectorAll(".menu_action").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dishId = btn.dataset.dishId;
      if (dishId) openMenuModal(dishId);
    });
  });

  // Modal close buttons
  const menuModalClose = document.getElementById("menu-modal-close");
  if (menuModalClose) {
    menuModalClose.addEventListener("click", () => {
      closeModal(document.getElementById("menu-modal"));
    });
  }

  const resModalClose = document.getElementById("reservation-modal-close");
  if (resModalClose) {
    resModalClose.addEventListener("click", () => {
      closeModal(document.getElementById("reservation-modal"));
    });
  }

  const chkModalClose = document.getElementById("checkout-modal-close");
  if (chkModalClose) {
    chkModalClose.addEventListener("click", () => {
      closeModal(document.getElementById("checkout-modal"));
    });
  }

  // Close modals on clicking backdrop
  document.querySelectorAll(".modal_backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // Global Escape key support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal_backdrop.modal--show").forEach((m) => {
        closeModal(m);
      });
      closeCartDrawer();
    }
  });

  // Reservation CTA buttons
  const openResBtn = document.getElementById("open-reservation-btn");
  if (openResBtn) {
    openResBtn.addEventListener("click", openReservationModal);
  }

  const homeBookBtn = document.getElementById("home-book-btn");
  if (homeBookBtn) {
    homeBookBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openReservationModal();
    });
  }
});

/*==================================================
  SCROLL REVEAL ANIMATION (PRESERVED)
==================================================*/
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "bottom",
    distance: "60px",
    duration: 1500,
    delay: 300,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  });

  sr.reveal(`.home_title`, { origin: "top" });
  sr.reveal(`.home_button`, { delay: 600, origin: "top" });
  sr.reveal(`.home_fryingpan`, { delay: 600, rotate: { z: 60 } });
  sr.reveal(`.home_rosemary-1`, { delay: 1200, origin: "right", rotate: { z: -60 } });
  sr.reveal(`.home_rosemary-2`, { delay: 1200, origin: "left", rotate: { z: -60 } });
  sr.reveal(`.home_tomato`, { delay: 1200, origin: "right", rotate: { z: -60 } });
  sr.reveal(`.home_spoon`, { delay: 1200, origin: "bottom" });
  sr.reveal(`.home_onion`, { delay: 1200, origin: "right", rotate: { z: -60 } });
  sr.reveal(`.home_pepper`, { delay: 1200, origin: "top", distance: "120px" });
  sr.reveal(`.home_salt-1`, { delay: 1200, origin: "left", distance: "120px" });
  sr.reveal(`.home_salt-2`, { delay: 1200, origin: "right", distance: "120px" });

  sr.reveal(`.about_data > *`, { origin: "top" });
  sr.reveal(`.about_flour`, { delay: 900 });
  sr.reveal(`.about_rosemary`, { delay: 1200, origin: "bottom" });

  sr.reveal(`.menu_header`);
  sr.reveal(`.menu_dish-1, .menu_dish-2, .menu_dish-3, .menu_dish-4`, {
    distance: 0,
    duration: 2000,
    rotate: { z: -30 },
  });
  sr.reveal(`.menu_rosemary, .menu_flour-2, .menu_tomato, .menu_flour-4`, {
    delay: 600,
  });
  sr.reveal(`.menu_flour-1, .menu_pepper, .menu_flour-3`, { delay: 900 });
  sr.reveal(`.menu_info`, { delay: 600, origin: "left" });

  sr.reveal(`.events_data > *`, { origin: "top" });
  sr.reveal(`.events_flour`, { delay: 900 });
  sr.reveal(`.events_spoon`, { delay: 1200, origin: "bottom" });

  sr.reveal(`.ingredients_data`);
  sr.reveal(`.ingredients_images > img`, {
    delay: 1200,
    distance: "0",
    scale: 0.1,
  });
  sr.reveal(`.ingredients_img-1`, { delay: 600, distance: "0", scale: 1.5 });

  sr.reveal(`.testimonials_container`);

  sr.reveal(`.contact_map`, { origin: "left" });
  sr.reveal(`.contact_content`, { origin: "right" });

  sr.reveal(`.reservation_content, .footer_container`);
}
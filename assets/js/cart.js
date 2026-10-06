/*==================================================
  CART JS - Cart Manager, State, Drawer & Actions
==================================================*/

import { showToast, checkLockScroll } from "./ui.js";
import { openCheckoutModal } from "./checkout.js";

const CART_STORAGE_KEY = "steakhouse_cart";

export const CartManager = {
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
export const renderCartDrawer = () => {
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
      if (confirm("Are you sure you want to clear your cart?")) {
        CartManager.clearCart();
      }
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
export const openCartDrawer = () => {
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

export const closeCartDrawer = () => {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer || !overlay) return;

  drawer.classList.remove("cart--show");
  overlay.classList.remove("cart--show");

  setTimeout(() => {
    drawer.hidden = true;
    overlay.hidden = true;
    checkLockScroll();
  }, 400);
};

export const initCart = () => {
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

  // Initial badge update
  CartManager.updateCartBadge();
};

/*==================================================
  CHECKOUT JS - Checkout Flow, Order Submission & Success
==================================================*/

import { CartManager } from "./cart.js";
import { openModal, closeModal, showToast, launchRainbowConfetti } from "./ui.js";

export const openCheckoutModal = () => {
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

export const initCheckout = () => {
  const chkModalClose = document.getElementById("checkout-modal-close");
  if (chkModalClose) {
    chkModalClose.addEventListener("click", () => {
      closeModal(document.getElementById("checkout-modal"));
    });
  }
};

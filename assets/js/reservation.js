/*==================================================
  RESERVATION JS - Table Booking Flow & Confirmation
==================================================*/

import { openModal, closeModal, showToast, launchRainbowConfetti } from "./ui.js";

export const openReservationModal = () => {
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

export const initReservation = () => {
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

  const resModalClose = document.getElementById("reservation-modal-close");
  if (resModalClose) {
    resModalClose.addEventListener("click", () => {
      closeModal(document.getElementById("reservation-modal"));
    });
  }
};

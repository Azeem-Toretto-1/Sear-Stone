/*==================================================
  MENU JS - Menu Catalog, Detail Modal & Interactions
==================================================*/

import { openModal, closeModal } from "./ui.js";
import { CartManager } from "./cart.js";

export const MENU_DATA = {
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

export const openMenuModal = (dishId) => {
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

export const initMenu = () => {
  // Menu cards click & keyboard support
  document.querySelectorAll(".menu_card").forEach((card) => {
    card.addEventListener("click", () => {
      const dishId = card.dataset.dishId;
      if (dishId) openMenuModal(dishId);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const dishId = card.dataset.dishId;
        if (dishId) openMenuModal(dishId);
      }
    });
  });

  // Direct order button on menu cards
  document.querySelectorAll(".menu_action").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dishId = btn.dataset.dishId;
      if (dishId) openMenuModal(dishId);
    });
  });

  // Menu modal close button
  const menuModalClose = document.getElementById("menu-modal-close");
  if (menuModalClose) {
    menuModalClose.addEventListener("click", () => {
      closeModal(document.getElementById("menu-modal"));
    });
  }
};

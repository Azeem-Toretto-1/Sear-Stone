/*==================================================
  MAIN JS - Application Orchestration & Entry Point
==================================================*/

import { initPageLoader } from "./loader.js";
import { initNavigation } from "./navigation.js";
import {
  initScrollProgress,
  initScrollUp,
  closeModal,
  initThemeToggle,
} from "./ui.js";
import { initMenu } from "./menu.js";
import { initCart, closeCartDrawer } from "./cart.js";
import { initCheckout } from "./checkout.js";
import { initReservation } from "./reservation.js";
import { initOpeningStatus, initEventCountdown } from "./events.js";
import { initTestimonialsCarousel } from "./testimonials.js";

/*========== Global Modal Backdrop & Escape Key Handlers ==========*/
const initGlobalKeyAndBackdropHandlers = () => {
  // Close modals when clicking backdrop
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
};

/*========== Preserved ScrollReveal Animation ==========*/
const initScrollRevealAnimations = () => {
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
};

/*========== Application Initialization ==========*/
const initApp = () => {
  initPageLoader();
  initThemeToggle();
  initNavigation();
  initScrollProgress();
  initScrollUp();
  initOpeningStatus();
  initEventCountdown();
  initTestimonialsCarousel();
  initCart();
  initMenu();
  initReservation();
  initCheckout();
  initGlobalKeyAndBackdropHandlers();
  initScrollRevealAnimations();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

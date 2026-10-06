/*==================================================
  NAVIGATION JS - Header, Mobile Drawer & Active Links
==================================================*/

export const initNavigation = () => {
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const header = document.getElementById("header");
  const navLinks = document.querySelectorAll(".nav_link");
  const sections = document.querySelectorAll("section[id]");

  /* Show menu */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  /* Hide menu */
  if (navClose && navMenu) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  /* Remove mobile menu on link click */
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) {
        navMenu.classList.remove("show-menu");
      }
    });
  });

  /* Change header styles on scroll */
  const scrollHeader = () => {
    if (!header) return;
    window.scrollY >= 50
      ? header.classList.add("scroll-header")
      : header.classList.remove("scroll-header");
  };
  window.addEventListener("scroll", scrollHeader, { passive: true });
  scrollHeader();

  /* Scroll sections active link */
  const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const id = section.id;
      const top = section.offsetTop - 50;
      const height = section.offsetHeight;
      const link = document.querySelector(".nav_menu a[href*=" + id + "]");

      if (!link) return;

      link.classList.toggle(
        "active-link",
        scrollY > top && scrollY <= top + height,
      );
    });
  };
  window.addEventListener("scroll", scrollActive, { passive: true });
  scrollActive();
};

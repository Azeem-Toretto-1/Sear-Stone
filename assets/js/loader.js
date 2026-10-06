/*==================================================
  LOADER JS - Website Initial Loader
==================================================*/

export const initPageLoader = () => {
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

/*==================================================
  TESTIMONIALS JS - Customer Reviews Carousel Slider
==================================================*/

export const initTestimonialsCarousel = () => {
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

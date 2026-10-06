/*==================================================
  EVENTS JS - Opening Hours Status & Event Countdown
==================================================*/

/*========== Dynamic Opening Hours Status ==========*/
export const initOpeningStatus = () => {
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

/*========== Events Countdown Timer ==========*/
export const initEventCountdown = () => {
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

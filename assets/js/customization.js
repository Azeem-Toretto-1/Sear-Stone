/*==================================================
  CUSTOMIZATION JS - Steak & Dish Customization Utilities
==================================================*/

/**
 * Builds a composite key to distinguish items with different customization choices
 */
export const buildCartKey = (dishId, doneness, side, sauce) => {
  const keyParts = [dishId];
  if (doneness || side || sauce) {
    keyParts.push(doneness, side, sauce);
  }
  return keyParts.filter(Boolean).join("-").replace(/\s+/g, "_");
};

/**
 * Format a human-readable summary of customization options
 */
export const formatCustomSummary = (doneness, side, sauce) => {
  return [doneness, side, sauce].filter(Boolean).join(" &bull; ");
};

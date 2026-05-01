/**
 * Calculates delivery charge based on location and weight
 * @param {string} location - Customer location
 * @param {number} totalWeight - Total weight of items in kg
 * @returns {number} - Delivery charge
 */
export const calculateDeliveryCharge = (location, totalWeight, settings) => {
  const { insideCity = 70, outsideCity = 120, weightCharge = 20 } = settings || {};
  
  let baseCharge = location === 'Cox\'s Bazar' ? insideCity : outsideCity;
  
  if (totalWeight <= 1) {
    return baseCharge;
  }
  
  // Add weightCharge for every extra 0.5kg over 1kg
  const extraWeight = totalWeight - 1;
  const extraUnits = Math.ceil(extraWeight / 0.5);
  const additionalCharge = extraUnits * weightCharge;
  
  return baseCharge + additionalCharge;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(price);
};

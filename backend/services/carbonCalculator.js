const emissionFactors = {
  transport: {
    bike: 0.12,
    car: 0.21,
    bus: 0.08,
    train: 0.04,
  },

  electricity: {
    kwh: 0.7,
  },

  food: {
    veg: 0.5,
    nonveg: 2.5,
  },

  travel: {
    flight: 0.25,
  },

  shopping: {
    product: 2.0,
  },

  waste: {
    kg: 0.5,
  },
};

function calculateCarbon(type, activity, quantity) {
  const category = emissionFactors[type];

  if (!category) {
    throw new Error("Invalid activity type");
  }

  const key = activity.toLowerCase();

  const factor = category[key];

  if (!factor) {
    throw new Error(`No emission factor found for ${activity}`);
  }

  return Number((quantity * factor).toFixed(2));
}

module.exports = {
  calculateCarbon,
  emissionFactors,
};
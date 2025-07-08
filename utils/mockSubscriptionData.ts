// utils/mockSubscriptionData.js
// Mock data for subscription functionality - to be replaced with real API calls

export const mockUserSubscription = {
  isActive: true,
  plan: "premium", // "free", "basic", "premium"
  startDate: "2024-01-15",
  endDate: "2025-01-15",
  limits: {
    eventsPerMonth: 10,
    guestsPerEvent: 500,
    invitationsPerMonth: 2000,
    featuresEnabled: {
      sessions: true,
      ticketing: true,
      customBranding: true,
      advancedAnalytics: true,
      prioritySupport: true,
    },
  },
  usage: {
    eventsThisMonth: 3,
    guestsThisMonth: 150,
    invitationsThisMonth: 450,
  },
};

export const subscriptionPlans = {
  free: {
    name: "Free Plan",
    price: { USD: 0, NGN: 0 },
    limits: {
      eventsPerMonth: 1,
      guestsPerEvent: 50,
      invitationsPerMonth: 100,
      featuresEnabled: {
        sessions: false,
        ticketing: false,
        customBranding: false,
        advancedAnalytics: false,
        prioritySupport: false,
      },
    },
  },
  basic: {
    name: "Basic Plan",
    price: { USD: 29, NGN: 15000 },
    limits: {
      eventsPerMonth: 5,
      guestsPerEvent: 200,
      invitationsPerMonth: 1000,
      featuresEnabled: {
        sessions: true,
        ticketing: false,
        customBranding: true,
        advancedAnalytics: false,
        prioritySupport: false,
      },
    },
  },
  premium: {
    name: "Premium Plan",
    price: { USD: 79, NGN: 40000 },
    limits: {
      eventsPerMonth: 999, // unlimited
      guestsPerEvent: 999999, // unlimited
      invitationsPerMonth: 999999, // unlimited
      featuresEnabled: {
        sessions: true,
        ticketing: true,
        customBranding: true,
        advancedAnalytics: true,
        prioritySupport: true,
      },
    },
  },
};

export const invitationPricing = {
  email: {
    pricePerInvite: { USD: 0.05, NGN: 25 },
    reminderMultiplier: 1.5,
  },
  sms: {
    pricePerInvite: { USD: 0.08, NGN: 45 },
    reminderMultiplier: 1.5,
  },
  whatsapp: {
    pricePerInvite: { USD: 0.06, NGN: 35 },
    reminderMultiplier: 1.5,
  },
  voice: {
    pricePerInvite: { USD: 0.25, NGN: 150 },
    reminderMultiplier: 1.5,
  },
};

// Helper function to check if user can create event with subscription
export const canUseSubscription = (subscription, eventData) => {
  if (!subscription.isActive) return false;

  const { limits, usage } = subscription;
  const guestCount = parseInt(eventData.no_of_invitees) || 0;

  // Check monthly limits
  const canCreateEvent = usage.eventsThisMonth < limits.eventsPerMonth;
  const canAddGuests =
    usage.guestsThisMonth + guestCount <= limits.guestsPerEvent;

  return canCreateEvent && canAddGuests;
};

// Helper function to calculate invitation costs
export const calculateInvitationCosts = (
  invitationMethods,
  guestCount,
  enableReminders,
  currency
) => {
  let totalCost = 0;

  invitationMethods.forEach((method) => {
    const pricing = invitationPricing[method];
    if (pricing) {
      let cost = pricing.pricePerInvite[currency] * guestCount;
      if (enableReminders) {
        cost *= pricing.reminderMultiplier;
      }
      totalCost += cost;
    }
  });

  return totalCost;
};

// Helper function to check if invitation methods are within subscription limits
export const canUseInvitationsWithSubscription = (
  subscription,
  invitationCost,
  currency
) => {
  if (!subscription.isActive) return false;

  // For premium plans, invitations might be included
  if (subscription.plan === "premium") {
    return (
      subscription.usage.invitationsThisMonth <
      subscription.limits.invitationsPerMonth
    );
  }

  return false; // Basic and free plans need to pay for invitations
};

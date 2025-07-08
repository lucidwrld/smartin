export const calculateTotal = (
  noOfGuests,
  pricing,
  discounts,
  isPartner,
  currency
) => {
  // Base prices based on currency
  const eventPrice =
    currency === "NGN" ? pricing.event_price_naira : pricing.event_price_usd;
  const pricePerInvite =
    currency === "NGN"
      ? pricing.price_per_invite_naira
      : pricing.price_per_invite_usd;

  // Calculate subtotal
  const subtotal = eventPrice + pricePerInvite * noOfGuests;

  // Find applicable discount
  let discountPercent = 0;

  if (isPartner) {
    // Find partner discount if available
    const partnerDiscount = discounts.find(
      (d) => d.type === "partner" && noOfGuests >= d.no_of_invites
    );
    if (partnerDiscount) {
      discountPercent = partnerDiscount.percent;
    }
  } else {
    // Find default discount if available
    const defaultDiscounts = discounts.filter(
      (d) => d.type === "default" && noOfGuests >= d.no_of_invites
    );
    // Get highest applicable discount
    const highestDiscount = defaultDiscounts.reduce(
      (max, d) => (d.percent > max ? d.percent : max),
      0
    );
    discountPercent = highestDiscount;
  }

  // Calculate final total
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  return {
    eventPrice,
    pricePerInvite,
    subtotal,
    discountPercent,
    discountAmount,
    total,
  };
};

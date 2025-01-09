export const plansMap = [
  {
    id: "basic",
    name: "Basic",
    description: "Get started with LipiMitra AI!",
    price: "10",
    items: ["3 Blog Posts", "3 Transcriptions"],
    paymentLink: "https://buy.stripe.com/test_bIY5nqbJr2tV6pq6oo",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1QdvgHSIcGUEDAbk27poQRpM"
        : "",
  },
  {
    id: "pro",
    name: "Pro",
    description: "All Blog Posts, Let's Go!",
    price: "19.99",
    items: ["Unlimited Blog Posts", "Umlimited Transcriptions"],
    paymentLink: "https://buy.stripe.com/test_bIY4jm8xf1pR5lm8wx",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1QdviHSIcGUEDAbko4Xe8Pau"
        : "",
  },
];

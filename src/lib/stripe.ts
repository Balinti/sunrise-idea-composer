import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    ideas: 5,
    priceId: null,
  },
  pro: {
    name: 'Pro',
    price: 9,
    ideas: 100,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  unlimited: {
    name: 'Unlimited',
    price: 29,
    ideas: -1, // unlimited
    priceId: process.env.STRIPE_UNLIMITED_PRICE_ID,
  },
} as const

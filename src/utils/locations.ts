export const locationLabels = {
  ksieze: "🏠 Na Księżu",
  nearby: "📍 W pobliżu",
  mobile: "🚐 Z dojazdem",
} as const;

export type LocationSlug = keyof typeof locationLabels;

export const locationOrder: LocationSlug[] = ["ksieze", "nearby", "mobile"];

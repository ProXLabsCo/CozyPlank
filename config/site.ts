export const siteConfig = {
  name: "CozyPlank",
  description:
    "Handcrafted Wooden Home Decor | Artisan Quality Made in Delhi",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "https://instagram.com/cozyplank",
    facebook: "https://facebook.com/cozyplank",
    whatsapp: "https://wa.me/919876543210", // Update with real number
  },
  contact: {
    email: "hello@cozyplank.com",
    phone: "+91 98765 43210", // Update with real number
    address: "Delhi, India",
  },
  business: {
    gst: "GST_NUMBER_HERE",
    pan: "PAN_NUMBER_HERE",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export const PRODUCT_CATEGORIES = [
  { id: "cutting-boards", name: "Cutting Boards", slug: "cutting-boards" },
  { id: "serving-trays", name: "Serving Trays", slug: "serving-trays" },
  { id: "laptop-stands", name: "Laptop Stands", slug: "laptop-stands" },
  { id: "shelves", name: "Shelves", slug: "shelves" },
  { id: "coasters", name: "Coasters", slug: "coasters" },
  { id: "name-plates", name: "Name Plates", slug: "name-plates" },
] as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const SHIPPING_ZONES = {
  DELHI_NCR: { name: "Delhi NCR", fee: 0, deliveryDays: "2-3" },
  NORTH_INDIA: { name: "North India", fee: 100, deliveryDays: "3-5" },
  REST_OF_INDIA: { name: "Rest of India", fee: 150, deliveryDays: "5-7" },
} as const;

export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "₹";
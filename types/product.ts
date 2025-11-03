import { Database } from "./database";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];

export interface ProductWithCategory extends Product {
  categories: Category | null;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customization?: Record<string, any>;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
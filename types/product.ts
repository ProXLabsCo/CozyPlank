import { Database } from "./database";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];

export interface ProductWithCategory extends Product {
  categories: Category | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: Record<string, any>;
}
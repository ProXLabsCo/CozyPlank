export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          category_id: string | null
          price: number
          compare_at_price: number | null
          cost_price: number | null
          sku: string | null
          stock: number
          low_stock_threshold: number
          images: string[]
          featured_image: string | null
          is_featured: boolean
          is_active: boolean
          allow_backorder: boolean
          weight_kg: number | null
          dimensions_cm: string | null
          material: string | null
          finish: string | null
          care_instructions: string | null
          customizable: boolean
          customization_options: Json | null
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          price: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          stock?: number
          low_stock_threshold?: number
          images?: string[]
          featured_image?: string | null
          is_featured?: boolean
          is_active?: boolean
          allow_backorder?: boolean
          weight_kg?: number | null
          dimensions_cm?: string | null
          material?: string | null
          finish?: string | null
          care_instructions?: string | null
          customizable?: boolean
          customization_options?: Json | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          price?: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          stock?: number
          low_stock_threshold?: number
          images?: string[]
          featured_image?: string | null
          is_featured?: boolean
          is_active?: boolean
          allow_backorder?: boolean
          weight_kg?: number | null
          dimensions_cm?: string | null
          material?: string | null
          finish?: string | null
          care_instructions?: string | null
          customizable?: boolean
          customization_options?: Json | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add more types as needed
    }
  }
}
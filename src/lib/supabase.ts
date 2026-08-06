import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type DatabaseProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  original_price: number;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  is_new: boolean;
  is_best_seller: boolean;
  is_featured: boolean;
  description: string;
  specs: Record<string, string>;
  colors: string[];
  discount: number;
  created_at: string;
  updated_at: string;
};

export type DatabaseOrder = {
  id: string;
  user_id: string | null;
  order_number: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  payment_method: string;
  created_at: string;
};

export type DatabaseOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  qty: number;
  price: number;
};

export type DatabaseBanner = {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  link: string;
  active: boolean;
  position: number;
  created_at: string;
};

export type DatabaseCampaign = {
  id: string;
  name: string;
  code: string;
  discount: string;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
};

export type DatabaseCartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_color: string;
  created_at: string;
};

export type DatabaseWishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

export type DatabaseProfile = {
  id: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
};

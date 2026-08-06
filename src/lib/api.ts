import { supabase } from "./supabase";
import type {
  DatabaseProduct,
  DatabaseOrder,
  DatabaseOrderItem,
  DatabaseBanner,
  DatabaseCampaign,
  DatabaseCartItem,
  DatabaseWishlistItem,
  DatabaseProfile,
} from "./supabase";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  description: string;
  specs: Record<string, string>;
  colors: string[];
  discount: number;
};

export type Order = {
  id: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: { name: string; qty: number; price: number }[];
  customer: string;
  email: string;
  address: string;
  paymentMethod: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  link: string;
  active: boolean;
};

export type Campaign = {
  id: string;
  name: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedColor: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

function mapProduct(p: DatabaseProduct): Product {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: Number(p.price),
    originalPrice: Number(p.original_price),
    image: p.image,
    images: p.images || [],
    rating: Number(p.rating),
    reviews: p.reviews,
    stock: p.stock,
    isNew: p.is_new,
    isBestSeller: p.is_best_seller,
    isFeatured: p.is_featured,
    description: p.description,
    specs: p.specs || {},
    colors: p.colors || [],
    discount: Number(p.discount),
  };
}

function mapBanner(b: DatabaseBanner): Banner {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.image_url,
    ctaText: b.cta_text,
    link: b.link,
    active: b.active,
  };
}

function mapCampaign(c: DatabaseCampaign): Campaign {
  return {
    id: c.id,
    name: c.name,
    code: c.code,
    discount: c.discount,
    startDate: c.start_date,
    endDate: c.end_date,
    active: c.active,
  };
}

// ─── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data as DatabaseProduct[]).map(mapProduct);
}

export async function createProduct(p: Omit<Product, "id">): Promise<Product> {
  const body = {
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    original_price: p.originalPrice,
    image: p.image,
    images: p.images,
    rating: p.rating,
    reviews: p.reviews,
    stock: p.stock,
    is_new: p.isNew,
    is_best_seller: p.isBestSeller,
    is_featured: p.isFeatured,
    description: p.description,
    specs: p.specs,
    colors: p.colors,
    discount: p.discount,
  };
  const { data, error } = await supabase.from("products").insert(body).select().single();
  if (error) throw error;
  return mapProduct(data as DatabaseProduct);
}

export async function updateProduct(id: string, p: Omit<Product, "id">): Promise<Product> {
  const body = {
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    original_price: p.originalPrice,
    image: p.image,
    images: p.images,
    rating: p.rating,
    reviews: p.reviews,
    stock: p.stock,
    is_new: p.isNew,
    is_best_seller: p.isBestSeller,
    is_featured: p.isFeatured,
    description: p.description,
    specs: p.specs,
    colors: p.colors,
    discount: p.discount,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("products").update(body).eq("id", id).select().single();
  if (error) throw error;
  return mapProduct(data as DatabaseProduct);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export async function fetchBanners(): Promise<Banner[]> {
  const { data, error } = await supabase.from("banners").select("*").order("position", { ascending: true });
  if (error) throw error;
  return (data as DatabaseBanner[]).map(mapBanner);
}

export async function createBanner(b: Omit<Banner, "id">): Promise<Banner> {
  const { data, error } = await supabase
    .from("banners")
    .insert({
      title: b.title,
      subtitle: b.subtitle,
      image_url: b.imageUrl,
      cta_text: b.ctaText,
      link: b.link,
      active: b.active,
    })
    .select()
    .single();
  if (error) throw error;
  return mapBanner(data as DatabaseBanner);
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<void> {
  const body: Record<string, unknown> = {};
  if (updates.title !== undefined) body.title = updates.title;
  if (updates.subtitle !== undefined) body.subtitle = updates.subtitle;
  if (updates.imageUrl !== undefined) body.image_url = updates.imageUrl;
  if (updates.ctaText !== undefined) body.cta_text = updates.ctaText;
  if (updates.link !== undefined) body.link = updates.link;
  if (updates.active !== undefined) body.active = updates.active;
  const { error } = await supabase.from("banners").update(body).eq("id", id);
  if (error) throw error;
}

export async function deleteBanner(id: string): Promise<void> {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}

// ─── Campaigns ─────────────────────────────────────────────────────────────────

export async function fetchCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data as DatabaseCampaign[]).map(mapCampaign);
}

export async function createCampaign(c: Omit<Campaign, "id">): Promise<Campaign> {
  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      name: c.name,
      code: c.code,
      discount: c.discount,
      start_date: c.startDate,
      end_date: c.endDate,
      active: c.active,
    })
    .select()
    .single();
  if (error) throw error;
  return mapCampaign(data as DatabaseCampaign);
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<void> {
  const body: Record<string, unknown> = {};
  if (updates.name !== undefined) body.name = updates.name;
  if (updates.code !== undefined) body.code = updates.code;
  if (updates.discount !== undefined) body.discount = updates.discount;
  if (updates.startDate !== undefined) body.start_date = updates.startDate;
  if (updates.endDate !== undefined) body.end_date = updates.endDate;
  if (updates.active !== undefined) body.active = updates.active;
  const { error } = await supabase.from("campaigns").update(body).eq("id", id);
  if (error) throw error;
}

export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) throw error;
}

// ─── Cart ──────────────────────────────────────────────────────────────────────

export async function fetchCart(products: Product[]): Promise<CartItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", user.id);
  if (error) throw error;

  const items = data as DatabaseCartItem[];
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) return null;
      return {
        product,
        quantity: item.quantity,
        selectedColor: item.selected_color || product.colors[0] || "",
      };
    })
    .filter((c): c is CartItem => c !== null);
}

export async function addToCartDb(productId: string, quantity: number, selectedColor: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: (existing as DatabaseCartItem).quantity + quantity })
      .eq("id", (existing as DatabaseCartItem).id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        selected_color: selectedColor,
      });
    if (error) throw error;
  }
}

export async function updateCartDb(productId: string, quantity: number): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", user.id)
    .eq("product_id", productId);
  if (error) throw error;
}

export async function removeFromCartDb(productId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
  if (error) throw error;
}

export async function clearCartDb(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id);
  if (error) throw error;
}

// ─── Wishlist ──────────────────────────────────────────────────────────────────

export async function fetchWishlist(products: Product[]): Promise<Product[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.from("wishlist_items").select("*").eq("user_id", user.id);
  if (error) throw error;

  const items = data as DatabaseWishlistItem[];
  return items
    .map((item) => products.find((p) => p.id === item.product_id))
    .filter((p): p is Product => p !== undefined);
}

export async function toggleWishlistDb(productId: string, add: boolean): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  if (add) {
    const { error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: user.id, product_id: productId });
    if (error && !error.message.includes("duplicate")) throw error;
  } else {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    if (error) throw error;
  }
}

// ─── Orders ────────────────────────────────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("orders").select("*, order_items(*)");
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
    if (!(profile as DatabaseProfile | null)?.is_admin) {
      query = query.eq("user_id", user.id);
    }
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;

  const orders = data as (DatabaseOrder & { order_items: DatabaseOrderItem[] })[];
  return orders.map((o) => ({
    id: o.order_number,
    date: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: o.status,
    total: Number(o.total),
    items: (o.order_items || []).map((oi) => ({
      name: oi.name,
      qty: oi.qty,
      price: Number(oi.price),
    })),
    customer: o.customer_name,
    email: o.customer_email,
    address: o.shipping_address,
    paymentMethod: o.payment_method,
  }));
}

export async function placeOrderDb(
  cart: CartItem[],
  customerInfo: { name: string; email: string; address: string; paymentMethod: string }
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      status: "Pending",
      total,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      shipping_address: customerInfo.address,
      payment_method: customerInfo.paymentMethod,
    })
    .select()
    .single();
  if (orderError) throw orderError;

  const orderItems = cart.map((item) => ({
    order_id: (order as DatabaseOrder).id,
    product_id: item.product.id,
    name: item.product.name,
    qty: item.quantity,
    price: item.product.price,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;

  await clearCartDb();
  return orderNumber;
}

export async function updateOrderStatusDb(orderNumber: string, status: string): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("order_number", orderNumber);
  if (error) throw error;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string): Promise<AppUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  const dbProfile = profile as DatabaseProfile | null;
  return {
    id: data.user.id,
    name: dbProfile?.full_name || data.user.email || "",
    email: data.user.email || "",
    isAdmin: dbProfile?.is_admin || false,
  };
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  isAdmin = false
): Promise<AppUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, is_admin: isAdmin } },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Registration failed");

  return {
    id: data.user.id,
    name: fullName,
    email: data.user.email || "",
    isAdmin,
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const dbProfile = profile as DatabaseProfile | null;
  return {
    id: user.id,
    name: dbProfile?.full_name || user.email || "",
    email: user.email || "",
    isAdmin: dbProfile?.is_admin || false,
  };
}

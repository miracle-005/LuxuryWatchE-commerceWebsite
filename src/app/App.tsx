import { useState, useCallback, useRef, useEffect, type ElementType, type ReactNode } from "react";
import {
  ShoppingCart, Heart, Search, Menu, X, Star, Package, Users,
  DollarSign, TrendingUp, Bell, LogOut, User, Clock, CreditCard,
  MapPin, Phone, Mail, Instagram, Twitter, Facebook, Youtube,
  Filter, Plus, Minus, Trash2, Check, Download, Truck, BarChart2,
  ShoppingBag, ArrowRight, ChevronRight, ChevronDown, Sun, Moon,
  Award, Shield, Zap, Eye, Edit2, Settings, ChevronLeft, Home,
  Tag, FileText, MessageCircle, HelpCircle, Info, RefreshCw,
  CheckCircle, XCircle, AlertCircle, Globe, Layers, Upload
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page =
  | "home" | "shop" | "product" | "newArrivals" | "cart"
  | "checkout" | "confirmation" | "account" | "admin" | "login"
  | "register" | "about" | "contact" | "faq" | "wishlist";

type AdminTab =
  | "overview" | "products" | "orders" | "customers" | "content" | "payments";

type AccountTab =
  | "profile" | "orders" | "wishlist" | "addresses" | "payments" | "notifications";

interface Product {
  id: number;
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
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

interface Order {
  id: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: { name: string; qty: number; price: number }[];
  customer: string;
  email: string;
  address: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joined: string;
  status: "Active" | "Inactive";
  avatar: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Noir Eclipse",
    brand: "Autem",
    category: "Luxury",
    price: 4850,
    originalPrice: 5200,
    image: "https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618215650148-e8e61eae521c?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1773414753637-2738750cfbb6?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.9,
    reviews: 124,
    stock: 6,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    description: "The Noir Eclipse is our most audacious statement in horology. Crafted from grade-5 titanium with a deep black PVD coating, this timepiece exudes understated authority. The in-house movement beats at 28,800 vph with a 72-hour power reserve.",
    specs: { "Case Material": "Grade-5 Titanium PVD", "Case Size": "42mm", "Movement": "Automatic, In-house", "Water Resistance": "200m", "Power Reserve": "72 hours", "Crystal": "Sapphire AR-coated", "Strap": "Alligator leather" },
    colors: ["#1a1a1a", "#c9a050"],
    discount: 7,
  },
  {
    id: 2,
    name: "Chronos Royale",
    brand: "Meridian",
    category: "Luxury",
    price: 6200,
    originalPrice: 6200,
    image: "https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618215650201-8d552591218d?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.8,
    reviews: 89,
    stock: 3,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    description: "The Chronos Royale represents the pinnacle of Swiss watchmaking tradition. Featuring a hand-guilloché dial in champagne gold, this masterpiece is powered by a skeletonized tourbillon movement visible through the exhibition caseback.",
    specs: { "Case Material": "18K Rose Gold", "Case Size": "40mm", "Movement": "Manual-wind Tourbillon", "Water Resistance": "50m", "Power Reserve": "120 hours", "Crystal": "Sapphire double-sided AR", "Strap": "Ostrich leather" },
    colors: ["#c9a050", "#f5e6c8"],
    discount: 0,
  },
  {
    id: 3,
    name: "Storm Pro X",
    brand: "Vertex",
    category: "Sports",
    price: 1850,
    originalPrice: 2100,
    image: "https://images.unsplash.com/photo-1758887952896-8491d393afe2?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1758887952896-8491d393afe2?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1766229967495-001ff77d750b?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.6,
    reviews: 312,
    stock: 24,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    description: "Built for extremes. The Storm Pro X features a helium escape valve, unidirectional rotating bezel, and a proprietary shock-absorbing case construction. Trusted by professional divers and mountaineers worldwide.",
    specs: { "Case Material": "Stainless Steel 316L", "Case Size": "44mm", "Movement": "Automatic", "Water Resistance": "500m", "Power Reserve": "48 hours", "Crystal": "Sapphire mineral composite", "Strap": "Rubber + steel bracelet" },
    colors: ["#2d2d2d", "#1a3a5c", "#4a1a1a"],
    discount: 12,
  },
  {
    id: 4,
    name: "Nova Smart Elite",
    brand: "Nexus",
    category: "Smart",
    price: 899,
    originalPrice: 1099,
    image: "https://images.unsplash.com/photo-1730757679771-b53e798846cf?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1730757679771-b53e798846cf?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1773414753637-2738750cfbb6?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.4,
    reviews: 567,
    stock: 42,
    isNew: true,
    isBestSeller: true,
    isFeatured: false,
    description: "Where technology meets elegance. The Nova Smart Elite monitors your health metrics, tracks fitness, displays notifications, and makes contactless payments — all wrapped in a premium sapphire glass housing with ceramic bezel.",
    specs: { "Case Material": "Ceramic + Aluminium", "Case Size": "41mm", "Display": "AMOLED 1.8\"", "Battery": "72 hours", "Water Resistance": "100m", "Sensors": "ECG, SpO2, GPS", "OS": "Proprietary WatchOS" },
    colors: ["#1a1a1a", "#c0c0c0", "#c9a050"],
    discount: 18,
  },
  {
    id: 5,
    name: "Cascade Urban",
    brand: "Cascade",
    category: "Casual",
    price: 395,
    originalPrice: 395,
    image: "https://images.unsplash.com/photo-1771734038750-ff6269568e38?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1771734038750-ff6269568e38?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1771734038899-f8c42dbc800f?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.3,
    reviews: 203,
    stock: 55,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    description: "Effortless everyday elegance. The Cascade Urban's minimalist dial paired with interchangeable straps makes it the perfect companion from morning meetings to weekend outings. Powered by a Japanese quartz movement.",
    specs: { "Case Material": "Stainless Steel", "Case Size": "38mm", "Movement": "Japanese Quartz", "Water Resistance": "50m", "Battery": "3 years", "Crystal": "Mineral glass", "Strap": "Interchangeable leather/nylon" },
    colors: ["#c0c0c0", "#c9a050", "#8b7355"],
    discount: 0,
  },
  {
    id: 6,
    name: "Soleil Rose",
    brand: "Autem",
    category: "Luxury",
    price: 3200,
    originalPrice: 3600,
    image: "https://images.unsplash.com/photo-1760532467609-45ed8016f795?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1760532467609-45ed8016f795?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618215650454-d03cac422c8f?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.7,
    reviews: 76,
    stock: 9,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    description: "The Soleil Rose is femininity distilled into horology. Set with 48 pavé diamonds around the bezel and featuring a mother-of-pearl dial with rose gold indices, this watch is as much jewelry as it is timepiece.",
    specs: { "Case Material": "18K Rose Gold", "Case Size": "36mm", "Movement": "Automatic", "Water Resistance": "30m", "Diamonds": "0.38ct pavé bezel", "Crystal": "Sapphire AR-coated", "Strap": "Satin with butterfly clasp" },
    colors: ["#f5c6a0", "#c9a050"],
    discount: 11,
  },
  {
    id: 7,
    name: "Titan Storm",
    brand: "Vertex",
    category: "Sports",
    price: 2100,
    originalPrice: 2100,
    image: "https://images.unsplash.com/photo-1618215650201-8d552591218d?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1618215650201-8d552591218d?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1662333084914-3eea84762671?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.5,
    reviews: 188,
    stock: 17,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    description: "The Titan Storm is a pilot's companion for the modern era. Featuring a bidirectional slide rule bezel, GMT complication, and a case crafted from aerospace-grade titanium, it combines technical excellence with refined styling.",
    specs: { "Case Material": "Aerospace Titanium", "Case Size": "43mm", "Movement": "Automatic GMT", "Water Resistance": "200m", "Power Reserve": "60 hours", "Crystal": "Flat sapphire", "Strap": "Titanium bracelet" },
    colors: ["#808080", "#1a1a1a"],
    discount: 0,
  },
  {
    id: 8,
    name: "Apex Smart Pro",
    brand: "Nexus",
    category: "Smart",
    price: 1249,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1662333084914-3eea84762671?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1662333084914-3eea84762671?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.2,
    reviews: 429,
    stock: 31,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    description: "The Apex Smart Pro combines premium materials with cutting-edge technology. Featuring a titanium case, always-on display, and a week-long battery life, it sets a new benchmark for luxury smartwatches.",
    specs: { "Case Material": "Grade 5 Titanium", "Case Size": "45mm", "Display": "LTPO AMOLED", "Battery": "7 days", "Water Resistance": "100m", "Sensors": "ECG, SpO2, EDA, GPS", "Connectivity": "LTE + WiFi" },
    colors: ["#808080", "#1a1a1a", "#2d4a2d"],
    discount: 17,
  },
  {
    id: 9,
    name: "Heritage Bronze",
    brand: "Meridian",
    category: "Casual",
    price: 680,
    originalPrice: 750,
    image: "https://images.unsplash.com/photo-1772949399884-01ec45bc5763?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1772949399884-01ec45bc5763?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.4,
    reviews: 97,
    stock: 28,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    description: "A tribute to the golden age of watchmaking, the Heritage Bronze develops a unique patina over time — making every watch one-of-a-kind. Powered by a reliable Swiss automatic movement with a display caseback.",
    specs: { "Case Material": "CuSn8 Bronze", "Case Size": "40mm", "Movement": "Swiss Automatic", "Water Resistance": "100m", "Power Reserve": "42 hours", "Crystal": "Domed sapphire", "Strap": "Vegetable-tanned leather" },
    colors: ["#8b6914", "#5a4010"],
    discount: 9,
  },
  {
    id: 10,
    name: "Pacific Diver",
    brand: "Vertex",
    category: "Sports",
    price: 1580,
    originalPrice: 1580,
    image: "https://images.unsplash.com/photo-1767779228363-21e8816c7147?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1767779228363-21e8816c7147?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.6,
    reviews: 241,
    stock: 19,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    description: "ISO 6425 certified and pressure tested to 1000m, the Pacific Diver is the ultimate tool watch. Anti-magnetic construction, a maxi-luminous dial, and screw-down crown make it the professional diver's first choice.",
    specs: { "Case Material": "Stainless Steel 316L", "Case Size": "42mm", "Movement": "Automatic", "Water Resistance": "1000m", "Power Reserve": "48 hours", "Crystal": "Sapphire Cyclops", "Certification": "ISO 6425" },
    colors: ["#1a3a5c", "#2d2d2d", "#2d4a2d"],
    discount: 0,
  },
  {
    id: 11,
    name: "Elara Moonphase",
    brand: "Autem",
    category: "Luxury",
    price: 8900,
    originalPrice: 9500,
    image: "https://images.unsplash.com/photo-1618215650454-d03cac422c8f?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1618215650454-d03cac422c8f?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618215650148-e8e61eae521c?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 5.0,
    reviews: 34,
    stock: 2,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    description: "The Elara Moonphase is a celestial masterpiece. Hand-assembled over 400 hours, its enamel dial depicts a hand-painted astronomical sky. The ultra-precise moonphase complication deviates just one day every 122 years.",
    specs: { "Case Material": "Platinum 950", "Case Size": "39mm", "Movement": "Manual-wind Grand Complication", "Water Resistance": "30m", "Power Reserve": "96 hours", "Dial": "Grand Feu enamel", "Limited": "Limited Edition of 88" },
    colors: ["#e8e8e8", "#c9a050"],
    discount: 6,
  },
  {
    id: 12,
    name: "Urban Classic",
    brand: "Cascade",
    category: "Casual",
    price: 420,
    originalPrice: 420,
    image: "https://images.unsplash.com/photo-1778088651812-636b0780f0dc?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1778088651812-636b0780f0dc?w=600&h=600&fit=crop&auto=format",
    ],
    rating: 4.1,
    reviews: 156,
    stock: 48,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    description: "Timeless simplicity is the Urban Classic's greatest feature. A clean three-hand layout, polished steel case, and a versatile NATO strap make it the watch that goes with everything — from boardroom to beach.",
    specs: { "Case Material": "Stainless Steel", "Case Size": "39mm", "Movement": "Japanese Quartz", "Water Resistance": "50m", "Battery": "3 years", "Crystal": "Mineral glass", "Strap": "NATO nylon" },
    colors: ["#c0c0c0", "#1a1a1a", "#6b4c2a"],
    discount: 0,
  },
];

const ORDERS: Order[] = [
  { id: "ORD-7841", date: "2026-07-08", status: "Delivered", total: 4850, customer: "James Okafor", email: "james@example.com", address: "14 Victoria Island, Lagos", items: [{ name: "Noir Eclipse", qty: 1, price: 4850 }] },
  { id: "ORD-7839", date: "2026-07-07", status: "Shipped", total: 7099, customer: "Amara Diallo", email: "amara@example.com", address: "3 Banana Island, Lagos", items: [{ name: "Chronos Royale", qty: 1, price: 6200 }, { name: "Cascade Urban", qty: 1, price: 395 }] },
  { id: "ORD-7835", date: "2026-07-05", status: "Processing", total: 1850, customer: "Emeka Nwosu", email: "emeka@example.com", address: "7 Maitama, Abuja", items: [{ name: "Storm Pro X", qty: 1, price: 1850 }] },
  { id: "ORD-7830", date: "2026-07-03", status: "Pending", total: 1798, customer: "Fatima Al-Hassan", email: "fatima@example.com", address: "22 Ikoyi, Lagos", items: [{ name: "Nova Smart Elite", qty: 2, price: 899 }] },
  { id: "ORD-7821", date: "2026-07-01", status: "Cancelled", total: 8900, customer: "Chidi Obi", email: "chidi@example.com", address: "5 GRA, Port Harcourt", items: [{ name: "Elara Moonphase", qty: 1, price: 8900 }] },
  { id: "ORD-7815", date: "2026-06-29", status: "Delivered", total: 3200, customer: "Ngozi Adeyemi", email: "ngozi@example.com", address: "9 Lekki Phase 1, Lagos", items: [{ name: "Soleil Rose", qty: 1, price: 3200 }] },
  { id: "ORD-7810", date: "2026-06-27", status: "Delivered", total: 2100, customer: "Taiwo Bello", email: "taiwo@example.com", address: "17 Wuse, Abuja", items: [{ name: "Titan Storm", qty: 1, price: 2100 }] },
  { id: "ORD-7805", date: "2026-06-25", status: "Shipped", total: 680, customer: "Adaeze Nkemdirim", email: "adaeze@example.com", address: "11 GRA, Enugu", items: [{ name: "Heritage Bronze", qty: 1, price: 680 }] },
];

const CUSTOMERS: Customer[] = [
  { id: 1, name: "James Okafor", email: "james@example.com", phone: "+234 801 234 5678", orders: 7, spent: 24850, joined: "2024-03-15", status: "Active", avatar: "JO" },
  { id: 2, name: "Amara Diallo", email: "amara@example.com", phone: "+234 802 345 6789", orders: 4, spent: 18200, joined: "2024-06-22", status: "Active", avatar: "AD" },
  { id: 3, name: "Emeka Nwosu", email: "emeka@example.com", phone: "+234 803 456 7890", orders: 2, spent: 3700, joined: "2025-01-08", status: "Active", avatar: "EN" },
  { id: 4, name: "Fatima Al-Hassan", email: "fatima@example.com", phone: "+234 804 567 8901", orders: 5, spent: 9450, joined: "2024-11-30", status: "Active", avatar: "FA" },
  { id: 5, name: "Chidi Obi", email: "chidi@example.com", phone: "+234 805 678 9012", orders: 1, spent: 0, joined: "2025-07-01", status: "Inactive", avatar: "CO" },
  { id: 6, name: "Ngozi Adeyemi", email: "ngozi@example.com", phone: "+234 806 789 0123", orders: 9, spent: 31500, joined: "2023-08-14", status: "Active", avatar: "NA" },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 42800, orders: 18 },
  { month: "Feb", revenue: 38500, orders: 15 },
  { month: "Mar", revenue: 55200, orders: 22 },
  { month: "Apr", revenue: 61400, orders: 27 },
  { month: "May", revenue: 47900, orders: 20 },
  { month: "Jun", revenue: 73100, orders: 31 },
  { month: "Jul", revenue: 58600, orders: 24 },
];

const CATEGORY_DATA = [
  { name: "Luxury", value: 48, color: "#c9a050" },
  { name: "Sports", value: 26, color: "#8b7355" },
  { name: "Smart", value: 16, color: "#d4af6e" },
  { name: "Casual", value: 10, color: "#6b5a40" },
];

const TESTIMONIALS = [
  { id: 1, name: "James O.", location: "Lagos, Nigeria", rating: 5, text: "The Noir Eclipse exceeded every expectation. The craftsmanship is simply breathtaking — I receive compliments every single day. Tempus delivered it in perfect condition with beautiful packaging.", avatar: "JO" },
  { id: 2, name: "Amara D.", location: "Abuja, Nigeria", rating: 5, text: "Purchasing the Soleil Rose was one of the best decisions I've made. The rose gold and diamond combination is absolutely stunning. Tempus's customer service was exceptional throughout.", avatar: "AD" },
  { id: 3, name: "Emeka N.", location: "Port Harcourt", rating: 5, text: "As a watch enthusiast, I've owned pieces from many brands. The Chronos Royale from Tempus stands apart — the tourbillon is mesmerizing. Shipping was fast and secure.", avatar: "EN" },
  { id: 4, name: "Fatima H.", location: "Kano, Nigeria", rating: 4, text: "Ordered the Storm Pro X for my husband's birthday and he absolutely loves it. The quality is outstanding for the price. Will definitely be shopping at Tempus again.", avatar: "FH" },
];

const BRANDS = [
  { name: "Autem", logo: "A" },
  { name: "Meridian", logo: "M" },
  { name: "Vertex", logo: "V" },
  { name: "Nexus", logo: "N" },
  { name: "Cascade", logo: "C" },
  { name: "Helios", logo: "H" },
];

const FAQ_ITEMS = [
  { q: "What payment methods do you accept?", a: "We accept all major payment methods through Flutterwave, including credit/debit cards, bank transfers, USSD, and mobile money. All transactions are secured with 256-bit SSL encryption." },
  { q: "How long does delivery take?", a: "Standard delivery within Lagos takes 2–3 business days. Other Nigerian cities take 3–5 business days. International orders take 7–14 business days depending on your location." },
  { q: "Do your watches come with a warranty?", a: "Yes. All watches sold at Tempus come with a minimum 2-year international manufacturer warranty. Luxury and limited edition pieces typically include 5-year coverage." },
  { q: "Can I return or exchange a watch?", a: "We offer a 30-day return policy for unworn items in original condition and packaging. Returns are free for defective items. Please contact our team to initiate a return." },
  { q: "Are the watches authentic?", a: "Absolutely. Tempus is an authorized dealer for all brands we carry. Every watch comes with its original certificate of authenticity, box, and manufacturer documentation." },
  { q: "Do you offer watch authentication services?", a: "Yes, we offer complimentary authentication for watches purchased through us. For third-party watches, we offer a paid authentication service — contact us for details." },
];

// ─── Utility Components ───────────────────────────────────────────────────────

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5"} ${
            i <= Math.floor(rating) ? "fill-primary text-primary" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "new" | "sale" | "low" | "sold" }) {
  const styles = {
    default: "bg-muted text-muted-foreground",
    new: "bg-primary text-primary-foreground",
    sale: "bg-destructive text-destructive-foreground",
    low: "bg-status-warning-bg text-status-warning",
    sold: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm font-mono ${styles[variant]}`}>
      {children}
    </span>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px flex-1 bg-border" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <p className="text-xs font-mono font-medium tracking-[0.25em] uppercase text-[#f2f2f2] mb-3">{label}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>}
      <GoldDivider />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product, onNavigate, onAddToCart, onToggleWishlist, isWishlisted
}: {
  product: Product;
  onNavigate: (page: Page, productId?: number) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group bg-card border border-border rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square bg-secondary overflow-hidden" onClick={() => onNavigate("product", product.id)}>
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.discount > 0 && <Badge variant="sale">-{product.discount}%</Badge>}
          {product.isBestSeller && <Badge variant="default">Bestseller</Badge>}
          {product.stock <= 3 && product.stock > 0 && <Badge variant="low">Only {product.stock} left</Badge>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm bg-background/50 border border-border transition-all duration-200 hover:bg-primary/20 hover:border-primary/60"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-sm hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4" onClick={() => onNavigate("product", product.id)}>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="font-semibold text-foreground mb-2 truncate font-sans">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted-foreground font-mono">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary font-mono text-[#ffffff]">₦{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through font-mono">₦{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  currentPage, onNavigate, cartCount, darkMode, onToggleDark, user, isAdmin, onLogout
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  cartCount: number;
  darkMode: boolean;
  onToggleDark: () => void;
  user: { name: string; email: string } | null;
  isAdmin: boolean;
  onLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", page: "home" as Page },
    { label: "Shop", page: "shop" as Page },
    { label: "New Arrivals", page: "newArrivals" as Page },
    { label: "About", page: "about" as Page },
    { label: "Contact", page: "contact" as Page },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Styled By MIMI
            </span>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <button
                key={l.page}
                onClick={() => onNavigate(l.page)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  currentPage === l.page ? "text-primary border-b border-primary pb-0.5" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
            {isAdmin && (
              <button onClick={() => onNavigate("admin")} className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${currentPage === "admin" ? "text-primary border-b border-primary pb-0.5" : "text-muted-foreground"}`}>
                Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 rounded-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={onToggleDark} className="w-9 h-9 rounded-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button onClick={() => onNavigate("wishlist")} className="hidden sm:flex w-9 h-9 rounded-sm items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200">
              <Heart className="w-5 h-5" />
            </button>

            <button onClick={() => onNavigate("cart")} className="relative w-9 h-9 rounded-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm hover:bg-muted transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {user.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-sm shadow-xl z-50">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <button onClick={() => { onNavigate("account"); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm flex items-center gap-2 text-foreground">
                        <User className="w-4 h-4" /> My Account
                      </button>
                      {isAdmin && (
                        <button onClick={() => { onNavigate("admin"); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm flex items-center gap-2 text-foreground">
                          <Settings className="w-4 h-4" /> Admin Panel
                        </button>
                      )}
                      <button onClick={() => { onLogout(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm flex items-center gap-2 text-destructive">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => onNavigate("login")} className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:bg-primary/90 transition-colors duration-200">
                Sign In
              </button>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 rounded-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search for watches, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { onNavigate("shop"); setSearchOpen(false); }}}
                className="w-full pl-9 pr-4 py-2.5 bg-muted border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((l) => (
              <button key={l.page} onClick={() => { onNavigate(l.page); setMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-foreground hover:text-primary">
                {l.label}
              </button>
            ))}
            {isAdmin && (
              <button onClick={() => { onNavigate("admin"); setMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-foreground hover:text-primary">Admin Panel</button>
            )}
            <div className="border-t border-border pt-2 mt-2">
              {user ? (
                <button onClick={() => { onLogout(); setMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-destructive">Sign Out</button>
              ) : (
                <button onClick={() => { onNavigate("login"); setMenuOpen(false); }} className="block w-full text-left py-2 text-sm text-primary font-semibold">Sign In</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Tempus</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Curating the world's finest timepieces for discerning collectors since 2018. Authorized dealer of over 30 luxury watch brands.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-sm bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <div className="space-y-2.5">
              {["Luxury Watches", "Sports Watches", "Smart Watches", "Casual Watches", "New Arrivals", "Best Sellers"].map((l) => (
                <button key={l} onClick={() => onNavigate("shop")} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <div className="space-y-2.5">
              {[["About Us", "about" as Page], ["Contact Us", "contact" as Page], ["FAQs", "faq" as Page]].map(([l, p]) => (
                <button key={l} onClick={() => onNavigate(p as Page)} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l}</button>
              ))}
              <button className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</button>
              <button className="block text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>14 Broad Street, Lagos Island, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+234 800 TEMPUS 1</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>hello@tempuswatches.com</span>
              </div>
            </div>
            
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Tempus Watches. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">Secure payments powered by Flutterwave</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ onNavigate, onAddToCart, onToggleWishlist, wishlist, banners, featuredIds, newArrivalIds, products }: {
  onNavigate: (page: Page, id?: number) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Product[];
  banners: Banner[];
  featuredIds: number[];
  newArrivalIds: number[];
  products: Product[];
}) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const activeSlides = banners.filter(b => b.active).length > 0
    ? banners.filter(b => b.active)
    : [{ id: 0, title: "Time is Art", subtitle: "Discover the world\'s most extraordinary timepieces — from hand-assembled tourbillons to precision sports chronographs.", imageUrl: "https://images.unsplash.com/photo-1618215650148-e8e61eae521c?w=1400&h=900&fit=crop&auto=format", ctaText: "Explore Collection", link: "shop", active: true }];
  const slide = activeSlides[heroIndex % activeSlides.length];
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const t = setInterval(() => setHeroIndex(i => (i + 1) % activeSlides.length), 5000);
    return () => clearInterval(t);
  }, [activeSlides.length]);
  const featured = products.filter((p) => featuredIds.includes(p.id)).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => newArrivalIds.includes(p.id)).slice(0, 4);

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background images — crossfade */}
        {activeSlides.map((s, i) => (
          <img
            key={s.id}
            src={s.imageUrl}
            alt={s.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === heroIndex % activeSlides.length ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

        {/* Left arrow */}
        {activeSlides.length > 1 && (
          <button
            onClick={() => setHeroIndex(i => (i - 1 + activeSlides.length) % activeSlides.length)}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition-all opacity-0 hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right arrow */}
        {activeSlides.length > 1 && (
          <button
            onClick={() => setHeroIndex(i => (i + 1) % activeSlides.length)}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition-all opacity-0 hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-lg">
            <p className="text-xs font-mono font-semibold tracking-[0.3em] uppercase mb-5 text-white/70">
              Authorized Luxury Dealer
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {slide.title}
            </h1>
            <p className="text-lg text-white/70 mb-10 leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => onNavigate("shop")} className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-all duration-200 hover:gap-3">
                {slide.ctaText || "Explore Collection"} <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => onNavigate("newArrivals")} className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-sm border border-white/30 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                New Arrivals
              </button>
            </div>
            <div className="flex items-center gap-8 mt-12">
              {[["500+", "Timepieces"], ["30+", "Brands"], ["2yr", "Warranty"], ["Free", "Shipping"]].map(([n, l]) => (
                <div key={l}>
                  <p className="text-xl font-bold text-primary font-mono">{n}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wider">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`transition-all duration-300 rounded-full ${i === heroIndex % activeSlides.length ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Handpicked for You" title="Featured Timepieces" subtitle="Our curators select only the most extraordinary pieces from the world's finest ateliers." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.some((w) => w.id === p.id)} />
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => onNavigate("shop")} className="inline-flex items-center gap-2 px-8 py-3 border border-border text-sm font-semibold rounded-sm hover:border-primary hover:text-primary transition-all duration-200">
            View All Watches <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Banner Strip */}
      <section className="bg-primary/10 border-y border-primary/20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $500" },
              { icon: Shield, title: "Authenticated", desc: "100% genuine pieces" },
              { icon: Award, title: "2-Year Warranty", desc: "On all watches" },
              { icon: RefreshCw, title: "30-Day Returns", desc: "Hassle-free policy" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Most Loved" title="Best Sellers" subtitle="The watches our customers return for — and recommend to everyone they know." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.some((w) => w.id === p.id)} />
          ))}
        </div>
      </section>

      {/* Mid Banner */}
      <section className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=1400&h=500&fit=crop&auto=format" alt="Luxury watch collection" className="w-full h-72 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary mb-3 text-[#e8e8e8]">Limited Edition Collection</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Elara Moonphase</h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto">Only 88 pieces in the world. Hand-assembled over 400 hours with grand feu enamel dial.</p>
            <button onClick={() => onNavigate("product", 11)} className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors">
              Discover More
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Just In" title="New Arrivals" subtitle="Fresh from the ateliers — the latest additions to our curated selection." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.some((w) => w.id === p.id)} />
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => onNavigate("newArrivals")} className="inline-flex items-center gap-2 px-8 py-3 border border-border text-sm font-semibold rounded-sm hover:border-primary hover:text-primary transition-all duration-200">
            See All New Arrivals <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Client Stories" title="What Our Collectors Say" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className="bg-background border border-border rounded-sm p-6">
                <Stars rating={t.rating} size="md" />
                <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      

      {/* Newsletter */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-primary-foreground/70 mb-2">Stay in the Know</p>
          <h2 className="text-3xl font-bold text-primary-foreground mb-3">Join the Inner Circle</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">Get early access to new arrivals, exclusive offers, and insider stories from the world of haute horlogerie.</p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-primary-foreground">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Welcome to the inner circle!</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-sm bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:border-primary-foreground/60"
              />
              <button onClick={() => setSubscribed(true)} className="px-6 py-3 bg-primary-foreground text-primary font-bold rounded-sm hover:bg-primary-foreground/90 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Shop Page ────────────────────────────────────────────────────────────────

function ShopPage({ onNavigate, onAddToCart, onToggleWishlist, wishlist, products }: {
  onNavigate: (page: Page, id?: number) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Product[];
  products: Product[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = ["All", "Luxury", "Sports", "Smart", "Casual"];
  const brands = ["All", ...Array.from(new Set(products.map((p) => p.brand)))];

  const filtered = products
    .filter((p) =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      (selectedBrand === "All" || p.brand === selectedBrand) &&
      (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())) &&
      p.price >= priceRange[0] && p.price <= priceRange[1] &&
      p.rating >= minRating
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Watch Collection</h1>
          <p className="text-muted-foreground mt-1 text-sm">{filtered.length} timepieces found</p>
        </div>
        <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm hover:border-primary hover:text-primary transition-all">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((c) => (
          <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 ${selectedCategory === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <div className={`${filterOpen ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
          <div className="bg-card border border-border rounded-sm p-5 space-y-6 sticky top-24">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search watches..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 block">
                Price Range: ₦0 – ₦{priceRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min={0}
                max={100000}
                step={1000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 block">Min Rating</label>
              <div className="flex gap-2">
                {[0, 4, 4.5, 4.8].map((r) => (
                  <button key={r} onClick={() => setMinRating(r)} className={`flex-1 py-1.5 text-xs rounded-sm transition-all ${minRating === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {r === 0 ? "All" : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { setSelectedCategory("All"); setSelectedBrand("All"); setSearch(""); setPriceRange([0, 10000]); setMinRating(0); }} className="w-full py-2 text-xs text-muted-foreground border border-border rounded-sm hover:border-primary hover:text-primary transition-all">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{filtered.length} results</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Search className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted-foreground">No watches match your filters.</p>
              <button onClick={() => { setSelectedCategory("All"); setSearch(""); }} className="mt-4 text-primary text-sm hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.some((w) => w.id === p.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail Page ──────────────────────────────────────────────────────

function ProductDetailPage({ productId, onNavigate, onAddToCart, onToggleWishlist, wishlist, products }: {
  productId: number;
  onNavigate: (page: Page, id?: number) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Product[];
  products: Product[];
}) {
  const product = products.find((p) => p.id === productId) || products[0];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [added, setAdded] = useState(false);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => onNavigate("shop")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-secondary rounded-sm overflow-hidden">
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${activeImage === i ? "border-primary" : "border-border hover:border-primary/50"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{product.brand}</span>
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.isBestSeller && <Badge variant="default">Bestseller</Badge>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-5">
            <Stars rating={product.rating} size="md" />
            <span className="text-sm text-muted-foreground font-mono">({product.reviews} reviews)</span>
            <span className={`text-sm font-medium ${product.stock > 5 ? "text-status-success" : product.stock > 0 ? "text-status-warning" : "text-destructive"}`}>
              {product.stock > 5 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-primary font-mono">₦{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xl text-muted-foreground line-through font-mono">₦{product.originalPrice.toLocaleString()}</span>
                <Badge variant="sale">Save {product.discount}%</Badge>
              </>
            )}
          </div>

          <GoldDivider />

          <div className="my-5 space-y-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Color / Finish</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-primary scale-110" : "border-border hover:border-primary/50"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-mono font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">{product.stock} available</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold rounded-sm transition-all duration-200 ${
                added ? "bg-status-success text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
            </button>
            <button
              onClick={() => onToggleWishlist(product)}
              className={`w-14 flex items-center justify-center border rounded-sm transition-all duration-200 ${wishlist.some((w) => w.id === product.id) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary hover:text-primary"}`}
            >
              <Heart className={`w-5 h-5 ${wishlist.some((w) => w.id === product.id) ? "fill-primary" : ""}`} />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            {[
              { icon: Truck, text: "Free shipping on this item" },
              { icon: Shield, text: "Authenticated & certified genuine" },
              { icon: Award, text: "2-year manufacturer warranty" },
              { icon: RefreshCw, text: "30-day hassle-free returns" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-border mb-12">
        <div className="flex gap-6 border-b border-border">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium capitalize border-b-2 transition-all duration-200 -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab === "reviews" ? `Reviews (${product.reviews})` : tab}
            </button>
          ))}
        </div>
        <div className="py-8">
          {activeTab === "description" && (
            <p className="text-muted-foreground leading-relaxed max-w-2xl">{product.description}</p>
          )}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 max-w-2xl border border-border rounded-sm overflow-hidden">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div key={key} className={`flex gap-4 px-4 py-3 ${i % 2 === 0 ? "bg-card" : "bg-background"} border-b border-border last:border-b-0`}>
                  <span className="text-xs font-mono text-muted-foreground w-32 shrink-0">{key}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-2xl">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="bg-card border border-border rounded-sm p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <Stars rating={t.rating} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <SectionHeader label="You Might Also Like" title="Related Timepieces" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.some((w) => w.id === p.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── New Arrivals Page ────────────────────────────────────────────────────────

function NewArrivalsPage({ onNavigate, onAddToCart, onToggleWishlist, wishlist, products, newArrivalIds }: {
  onNavigate: (page: Page, id?: number) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Product[];
  products: Product[];
  newArrivalIds: number[];
}) {
  const newProducts = products.filter((p) => newArrivalIds.includes(p.id));
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative rounded-sm overflow-hidden mb-16">
        <img src="https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=1400&h=400&fit=crop&auto=format" alt="New arrivals banner" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-10">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary mb-2">Fresh Collection</p>
            <h1 className="text-4xl font-bold text-white">New Arrivals</h1>
            <p className="text-white/70 mt-2 max-w-sm">Discover the latest timepieces just landed in our collection — from breakthrough complications to refined everyday wearers.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newProducts.map((p) => (
          <ProductCard key={p.id} product={p} onNavigate={onNavigate} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.some((w) => w.id === p.id)} />
        ))}
      </div>
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────

function CartPage({ cart, onUpdateCart, onRemoveFromCart, onNavigate, onClearCart }: {
  cart: CartItem[];
  onUpdateCart: (productId: number, qty: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onNavigate: (page: Page) => void;
  onClearCart: () => void;
}) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.075;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Discover our collection of extraordinary timepieces.</p>
        <button onClick={() => onNavigate("shop")} className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors">
          Browse Collection <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-card border border-border rounded-sm p-4">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-sm bg-secondary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{product.brand}</p>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <button onClick={() => onRemoveFromCart(product.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-sm">
                    <button onClick={() => onUpdateCart(product.id, Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-mono">{quantity}</span>
                    <button onClick={() => onUpdateCart(product.id, Math.min(product.stock, quantity + 1))} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-primary font-mono">₦{(product.price * quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <button onClick={() => onNavigate("shop")} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Continue Shopping
            </button>
            <button onClick={onClearCart} className="text-sm text-muted-foreground hover:text-destructive transition-colors">
              Clear Cart
            </button>
          </div>
        </div>

        <div>
          <div className="bg-card border border-border rounded-sm p-5 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-mono">₦{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-mono">{shipping === 0 ? <span className="text-status-success">Free</span> : `₦${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (7.5%)</span>
                <span className="font-mono">₦{tax.toFixed(2)}</span>
              </div>
              {subtotal < 500 && (
                <p className="text-xs text-muted-foreground bg-muted p-2 rounded-sm">Add ${(500 - subtotal).toFixed(0)} more for free shipping</p>
              )}
            </div>
            <div className="border-t border-border my-4" />
            <div className="flex justify-between font-bold text-lg mb-5">
              <span>Total</span>
              <span className="text-primary font-mono">₦{total.toFixed(2)}</span>
            </div>
            <div className="mb-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Coupon code" className="flex-1 px-3 py-2 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <button className="px-4 py-2 border border-border rounded-sm text-sm hover:border-primary hover:text-primary transition-all">Apply</button>
              </div>
            </div>
            <button onClick={() => onNavigate("checkout")} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              <span>Secure checkout via Flutterwave</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────

function CheckoutPage({ cart, onNavigate, onPlaceOrder }: {
  cart: CartItem[];
  onNavigate: (page: Page) => void;
  onPlaceOrder: () => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "Nigeria" });
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const tax = subtotal * 0.075;
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + tax + shipping;

  const handleField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={() => onNavigate("cart")} className="hover:text-primary">Cart</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className={step === "shipping" ? "text-primary font-medium" : ""}>Shipping</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className={step === "payment" ? "text-primary font-medium" : "text-muted-foreground"}>Payment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <div className="bg-card border border-border rounded-sm p-6">
              <h2 className="text-lg font-bold mb-5">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["firstName", "First Name", ""], ["lastName", "Last Name", ""],
                  ["email", "Email Address", "col-span-2"], ["phone", "Phone Number", "col-span-2"],
                  ["address", "Street Address", "col-span-2"],
                  ["city", "City", ""], ["state", "State", ""],
                  ["zip", "ZIP / Postal Code", ""], ["country", "Country", ""],
                ].map(([key, label, span]) => (
                  <div key={key} className={span || ""}>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</label>
                    <input
                      type="text"
                      value={form[key as keyof typeof form]}
                      onChange={(e) => handleField(key, e.target.value)}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep("payment")} className="mt-6 w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Continue to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          {step === "payment" && (
            <div className="bg-card border border-border rounded-sm p-6">
              <h2 className="text-lg font-bold mb-5">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                  { id: "bank", label: "Bank Transfer", icon: DollarSign },
                  { id: "ussd", label: "USSD", icon: Phone },
                ].map(({ id, label, icon: Icon }) => (
                  <label key={id} className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                    <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="accent-primary" />
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === "card" && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Card Number</label>
                    <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Expiry</label>
                      <input type="text" placeholder="MM / YY" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">CVV</label>
                      <input type="text" placeholder="•••" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                    </div>
                  </div>
                </div>
              )}
              <div className="p-3 bg-muted rounded-sm border border-border mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">Your payment is secured by Flutterwave with 256-bit SSL encryption. We never store your card details.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep("shipping")} className="px-5 py-3.5 border border-border rounded-sm text-sm font-semibold hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={onPlaceOrder} className="flex-1 py-3.5 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  Place Order — ${total.toFixed(2)} <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-card border border-border rounded-sm p-5 sticky top-24">
            <h3 className="font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-sm bg-secondary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                    <p className="text-sm font-mono text-primary font-bold">₦{(product.price * quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">₦{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-mono">{shipping === 0 ? "Free" : `₦${shipping}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-mono">₦{tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span>Total</span><span className="text-primary font-mono">₦{total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation Page ────────────────────────────────────────────────────────

function ConfirmationPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const orderId = "ORD-" + Math.floor(8800 + Math.random() * 200);
  const delivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-status-success-bg flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-status-success" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-8">Thank you for your purchase. Your order has been placed successfully and is being processed.</p>
      <div className="bg-card border border-border rounded-sm p-6 mb-8 text-left">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ["Order ID", orderId],
            ["Payment", "Successful"],
            ["Status", "Processing"],
            ["Estimated Delivery", delivery],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">{k}</p>
              <p className="font-semibold text-foreground">{v}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-4 pt-4">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Track Your Order</p>
              <p className="text-xs text-muted-foreground">We'll send tracking updates to your email</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-sm text-sm font-semibold hover:border-primary hover:text-primary transition-all">
          <Download className="w-4 h-4" /> Download Invoice
        </button>
        <button onClick={() => onNavigate("account")} className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors">
          <Truck className="w-4 h-4" /> Track Order
        </button>
        <button onClick={() => onNavigate("shop")} className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-sm text-sm font-semibold hover:border-primary hover:text-primary transition-all">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

// ─── User Account Dashboard ───────────────────────────────────────────────────

function UserDashboard({ user, wishlist, onNavigate, onToggleWishlist }: {
  user: { name: string; email: string } | null;
  wishlist: Product[];
  onNavigate: (page: Page, id?: number) => void;
  onToggleWishlist: (p: Product) => void;
}) {
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const userOrders = ORDERS.slice(0, 4);

  const tabs: { id: AccountTab; label: string; icon: ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const statusColors: Record<string, string> = {
    Pending: "text-status-warning bg-status-warning-bg",
    Processing: "text-status-info bg-status-info-bg",
    Shipped: "text-status-indigo bg-status-indigo-bg",
    Delivered: "text-status-success bg-status-success-bg",
    Cancelled: "text-status-error bg-status-error-bg",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-sm p-5 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-3">
              {user?.name.charAt(0) || "U"}
            </div>
            <p className="text-center font-semibold">{user?.name || "Guest User"}</p>
            <p className="text-center text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
          <nav className="bg-card border border-border rounded-sm overflow-hidden">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-b border-border last:border-b-0 ${activeTab === id ? "bg-primary/10 text-primary border-l-2 border-l-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-3">
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-sm p-6">
              <h2 className="text-lg font-bold mb-5">Profile Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["First Name", "James"], ["Last Name", "Okafor"], ["Email", user?.email || "james@example.com"], ["Phone", "+234 801 234 5678"]].map(([label, value]) => (
                  <div key={label}>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</label>
                    <input defaultValue={value} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                ))}
              </div>
              <button className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          )}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-sm p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono font-bold text-primary">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full font-mono ${statusColors[order.status]}`}>{order.status}</span>
                      <span className="font-bold font-mono text-primary">₦{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.items.map((i) => i.name).join(", ")}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1.5 border border-border rounded-sm hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View Details
                    </button>
                    <button className="text-xs px-3 py-1.5 border border-border rounded-sm hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Track
                    </button>
                    <button className="text-xs px-3 py-1.5 border border-border rounded-sm hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                      <Download className="w-3 h-3" /> Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "wishlist" && (
            <div>
              {wishlist.length === 0 ? (
                <div className="bg-card border border-border rounded-sm p-12 text-center">
                  <Heart className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
                  <button onClick={() => onNavigate("shop")} className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors">Browse Collection</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((p) => (
                    <div key={p.id} className="flex gap-3 bg-card border border-border rounded-sm p-3">
                      <img src={p.image} alt={p.name} onClick={() => onNavigate("product", p.id)} className="w-20 h-20 object-cover rounded-sm bg-secondary shrink-0 cursor-pointer" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-muted-foreground">{p.brand}</p>
                        <p className="text-sm font-semibold truncate">{p.name}</p>
                        <p className="text-primary font-bold font-mono text-sm">₦{p.price.toLocaleString()}</p>
                        <button onClick={() => onToggleWishlist(p)} className="mt-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "addresses" && (
            <div className="bg-card border border-border rounded-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">Saved Addresses</h2>
                <button className="text-sm text-primary flex items-center gap-1.5 hover:underline"><Plus className="w-4 h-4" /> Add New</button>
              </div>
              {[{ label: "Home (Default)", address: "14 Victoria Island, Lagos, Nigeria" }, { label: "Office", address: "3 Broad Street, Lagos Island, Lagos" }].map((a) => (
                <div key={a.label} className="border border-border rounded-sm p-4 mb-3 flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold mb-1">{a.label}</p>
                    <p className="text-sm text-muted-foreground">{a.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs text-primary hover:underline"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button className="text-xs text-destructive hover:underline"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "payments" && (
            <div className="bg-card border border-border rounded-sm p-6">
              <h2 className="text-lg font-bold mb-5">Payment History</h2>
              <div className="space-y-3">
                {userOrders.filter((o) => o.status !== "Cancelled").map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-sm text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-status-success-bg flex items-center justify-center">
                        <Check className="w-4 h-4 text-status-success" />
                      </div>
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.date}</p>
                      </div>
                    </div>
                    <span className="font-bold font-mono text-primary">₦{o.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-sm p-6">
              <h2 className="text-lg font-bold mb-5">Notifications</h2>
              <div className="space-y-3">
                {[
                  { icon: Truck, color: "text-status-info bg-status-info-bg", title: "Order ORD-7839 Shipped", desc: "Your Chronos Royale is on its way. Expected delivery: July 12", time: "2 hours ago" },
                  { icon: CheckCircle, color: "text-status-success bg-status-success-bg", title: "Order ORD-7841 Delivered", desc: "Your Noir Eclipse was delivered successfully.", time: "2 days ago" },
                  { icon: Tag, color: "text-primary bg-primary/10", title: "Exclusive Offer for You", desc: "Get 15% off on your next Autem purchase. Use code: VIP15", time: "3 days ago" },
                ].map(({ icon: Icon, color, title, desc, time }) => (
                  <div key={title} className="flex gap-3 p-4 bg-background border border-border rounded-sm">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  rating: string;
  imageUrl: string;
  imageUrls: string[];
  description: string;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  specs: { key: string; value: string }[];
  colors: { label: string; hex: string }[];
}

type ContentSection = "banners" | "featured" | "arrivals" | "campaigns" | null;

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  link: string;
  active: boolean;
}

interface Campaign {
  id: number;
  name: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: "", brand: "", category: "Luxury", price: "", originalPrice: "",
  stock: "", rating: "", imageUrl: "", imageUrls: [], description: "",
  isNew: false, isBestSeller: false, isFeatured: false,
  specs: [{ key: "", value: "" }],
  colors: [{ label: "", hex: "#000000" }],
};

function AdminDashboard({ banners, setBanners, featuredIds, setFeaturedIds, newArrivalIds, setNewArrivalIds, products, setProducts }: { banners: Banner[]; setBanners: React.Dispatch<React.SetStateAction<Banner[]>>; featuredIds: number[]; setFeaturedIds: React.Dispatch<React.SetStateAction<number[]>>; newArrivalIds: number[]; setNewArrivalIds: React.Dispatch<React.SetStateAction<number[]>>; products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>> }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [customers, setCustomers] = useState<typeof CUSTOMERS>(CUSTOMERS);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [productSaved, setProductSaved] = useState(false);

  // Content management state
  const [contentSection, setContentSection] = useState<ContentSection>(null);

  const [bannerForm, setBannerForm] = useState<Omit<Banner, "id" | "active">>({ title: "", subtitle: "", imageUrl: "", ctaText: "", link: "" });
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 1, name: "Summer Luxury Sale", code: "SUMMER20", discount: "20", startDate: "2026-07-01", endDate: "2026-08-31", active: true },
    { id: 2, name: "VIP Members Reward", code: "VIP15", discount: "15", startDate: "2026-06-01", endDate: "2026-12-31", active: true },
  ]);
  const [campaignForm, setCampaignForm] = useState<Omit<Campaign, "id" | "active">>({ name: "", code: "", discount: "", startDate: "", endDate: "" });

  const [contentSaved, setContentSaved] = useState(false);

  // Close any open dropdown when clicking outside
  useEffect(() => {
    const handler = () => { setOpenDropdownId(null); setExportDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalRevenue = orders.filter((o) => o.status === "Delivered").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;

  const statusColors: Record<string, string> = {
    Pending: "text-status-warning bg-status-warning-bg",
    Processing: "text-status-info bg-status-info-bg",
    Shipped: "text-status-indigo bg-status-indigo-bg",
    Delivered: "text-status-success bg-status-success-bg",
    Cancelled: "text-status-error bg-status-error-bg",
  };

  const productFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => {
      const next = [...prev, ...urls];
      setImagePreview(next[0]);
      setProductForm(f => ({ ...f, imageUrl: next[0], imageUrls: next }));
      return next;
    });
    e.target.value = "";
  };
  const removeProductImage = (idx: number) => {
    setImagePreviews(prev => {
      const next = prev.filter((_, i) => i !== idx);
      setImagePreview(next[0] || "");
      setProductForm(f => ({ ...f, imageUrl: next[0] || "", imageUrls: next }));
      return next;
    });
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBannerForm((f) => ({ ...f, imageUrl: url }));
  };

  const openAddProduct = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_FORM);
    setImagePreview("");
    setImagePreviews([]);
    setProductModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    const imgs = p.images?.length ? p.images : [p.image];
    const specEntries = Object.entries(p.specs || {}).map(([key, value]) => ({ key, value }));
    const colorEntries = (p.colors || []).map(hex => ({ label: "", hex }));
    setProductForm({
      name: p.name, brand: p.brand, category: p.category,
      price: String(p.price), originalPrice: String(p.originalPrice),
      stock: String(p.stock), rating: String(p.rating),
      imageUrl: imgs[0], imageUrls: imgs, description: p.description,
      isNew: p.isNew, isBestSeller: p.isBestSeller, isFeatured: p.isFeatured,
      specs: specEntries.length ? specEntries : [{ key: "", value: "" }],
      colors: colorEntries.length ? colorEntries : [{ label: "", hex: "#000000" }],
    });
    setImagePreview(imgs[0]);
    setImagePreviews(imgs);
    setProductModalOpen(true);
  };

  const handleProductFormField = (k: keyof ProductFormData, v: string | boolean) => {
    setProductForm((f) => ({ ...f, [k]: v }));
    if (k === "imageUrl" && typeof v === "string") setImagePreview(v);
  };

  const handleSaveProduct = () => {
    const fallbackImg = "https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=600&h=600&fit=crop";
    const allImgs = productForm.imageUrls.length ? productForm.imageUrls : (productForm.imageUrl ? [productForm.imageUrl] : [fallbackImg]);
    const specsObj: Record<string, string> = {};
    productForm.specs.forEach(({ key, value }) => { if (key.trim()) specsObj[key.trim()] = value.trim(); });
    const colorsArr = productForm.colors.map(c => c.hex).filter(Boolean);
    const base = {
      name: productForm.name || "Unnamed Watch",
      brand: productForm.brand || "Unknown",
      category: productForm.category,
      price: Number(productForm.price) || 0,
      originalPrice: Number(productForm.originalPrice) || Number(productForm.price) || 0,
      stock: Number(productForm.stock) || 0,
      rating: Math.min(5, Math.max(0, Number(productForm.rating) || 4.0)),
      image: allImgs[0],
      images: allImgs,
      description: productForm.description || "",
      isNew: productForm.isNew,
      isBestSeller: productForm.isBestSeller,
      isFeatured: productForm.isFeatured,
      colors: colorsArr.length ? colorsArr : ["#1a1a1a"],
      specs: Object.keys(specsObj).length ? specsObj : { "Movement": "Automatic", "Case Size": "42mm" },
      reviews: 0,
      discount: productForm.originalPrice && productForm.price
        ? Math.round((1 - Number(productForm.price) / Number(productForm.originalPrice)) * 100)
        : 0,
    };
    if (editingProductId !== null) {
      setProducts((prev) => prev.map((p) => p.id === editingProductId ? { ...p, ...base } : p));
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { id: newId, ...base }]);
    }
    setProductSaved(true);
    setTimeout(() => { setProductSaved(false); setProductModalOpen(false); }, 1000);
  };

  const tabs: { id: AdminTab; label: string; icon: ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "customers", label: "Customers", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "content", label: "Content", icon: FileText },
  ];

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-sidebar border-r border-sidebar-border shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-4 border-b border-sidebar-border">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Admin Panel</p>
          <p className="text-sm font-bold text-foreground mt-1">Tempus Control</p>
        </div>
        <nav className="p-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all mb-1 ${activeTab === id ? "bg-primary/10 text-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "overview" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { label: "Total Products", value: products.length, icon: Package, color: "text-primary bg-primary/10" },
                { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-status-info bg-status-info-bg" },
                { label: "Total Revenue", value: `₦${(totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-status-success bg-status-success-bg" },
                { label: "Customers", value: CUSTOMERS.length, icon: Users, color: "text-status-purple bg-status-purple-bg" },
                { label: "Pending", value: pendingOrders, icon: Clock, color: "text-status-warning bg-status-warning-bg" },
                { label: "Completed", value: completedOrders, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border rounded-sm p-4">
                  <div className={`w-9 h-9 rounded-sm flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xl font-bold font-mono">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-card border border-border rounded-sm p-5">
                <h3 className="font-bold mb-4">Revenue by Month (2026)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c9a050" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c9a050" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,160,80,0.1)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8a8070" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#8a8070" }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "#141211", border: "1px solid rgba(201,160,80,0.2)", borderRadius: 4, fontSize: 12 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#c9a050" strokeWidth={2} fill="url(#revenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-sm p-5">
                <h3 className="font-bold mb-4">Sales by Category</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ background: "#141211", border: "1px solid rgba(201,160,80,0.2)", borderRadius: 4, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {CATEGORY_DATA.map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-muted-foreground">{c.name}</span>
                      </div>
                      <span className="font-mono font-medium">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-sm p-5">
              <h3 className="font-bold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3 font-mono text-primary text-xs">{o.id}</td>
                        <td className="py-3 px-3">{o.customer}</td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{o.items[0].name}{o.items.length > 1 ? ` +${o.items.length - 1}` : ""}</td>
                        <td className="py-3 px-3 font-mono font-bold">₦{o.total.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-mono ${statusColors[o.status]}`}>{o.status}</span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground text-xs font-mono">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Products</h1>
              <button onClick={openAddProduct} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Product", "Category", "Brand", "Price", "Stock", "Rating", "Actions"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-sm bg-secondary shrink-0" />
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <div className="flex gap-1 mt-0.5">
                                {p.isNew && <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm font-mono uppercase">New</span>}
                                {p.isFeatured && <span className="text-[9px] bg-status-warning-bg text-status-warning px-1.5 py-0.5 rounded-sm font-mono uppercase">Featured</span>}
                                {p.isBestSeller && <span className="text-[9px] bg-status-success-bg text-status-success px-1.5 py-0.5 rounded-sm font-mono uppercase">Bestseller</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{p.category}</td>
                        <td className="py-3 px-4 text-muted-foreground">{p.brand}</td>
                        <td className="py-3 px-4 font-mono font-bold text-primary">₦{p.price.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-mono font-bold ${p.stock <= 3 ? "text-status-warning" : "text-status-success"}`}>{p.stock}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                            <span className="text-xs font-mono">{p.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEditProduct(p)} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-primary transition-all" title="Edit product">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-destructive transition-all" title="Delete product">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Add / Edit Modal */}
            {productModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProductModalOpen(false)} />
                <div className="relative w-full max-w-2xl bg-card border border-border rounded-sm shadow-2xl overflow-y-auto max-h-[90vh]">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
                    <div>
                      <h2 className="text-lg font-bold">{editingProductId !== null ? "Edit Product" : "Add New Product"}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{editingProductId !== null ? "Update product details below" : "Fill in all fields to list a new watch"}</p>
                    </div>
                    <button onClick={() => setProductModalOpen(false)} className="p-1.5 hover:bg-muted rounded-sm transition-colors">
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="p-6 space-y-5">
                    {/* Product Images — Multi-file Upload */}
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Product Images * <span className="normal-case text-muted-foreground/60">(select multiple)</span></label>
                      <input ref={productFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleProductImageUpload} />
                      <button
                        type="button"
                        onClick={() => productFileRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border-2 border-dashed border-border rounded-sm hover:border-primary hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-primary"
                      >
                        <Upload className="w-4 h-4" />
                        {imagePreviews.length ? `Add More Images (${imagePreviews.length} selected)` : "Choose Images from Files"}
                      </button>
                      {imagePreviews.length > 0 ? (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {imagePreviews.map((url, idx) => (
                            <div key={idx} className="relative group aspect-square">
                              <img src={url} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover rounded-sm border border-border" />
                              {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm font-mono uppercase">Main</span>}
                              <button type="button" onClick={() => removeProductImage(idx)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 w-full h-24 bg-muted/40 rounded-sm flex flex-col items-center justify-center text-muted-foreground gap-1.5 border border-border">
                          <Package className="w-7 h-7 opacity-30" />
                          <span className="text-xs">No images selected</span>
                        </div>
                      )}
                    </div>
                    {/* Name + Brand */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Watch Name *</label>
                        <input type="text" placeholder="e.g. Noir Eclipse" value={productForm.name} onChange={(e) => handleProductFormField("name", e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Brand *</label>
                        <input type="text" placeholder="e.g. Autem" value={productForm.brand} onChange={(e) => handleProductFormField("brand", e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    {/* Category */}
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Category *</label>
                      <select value={productForm.category} onChange={(e) => handleProductFormField("category", e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                        {["Luxury", "Sports", "Smart", "Casual"].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {/* Price + Original Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Selling Price (₦) *</label>
                        <input type="number" placeholder="e.g. 4850000" value={productForm.price} onChange={(e) => handleProductFormField("price", e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Original Price (₦)</label>
                        <input type="number" placeholder="Leave blank if no discount" value={productForm.originalPrice} onChange={(e) => handleProductFormField("originalPrice", e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                      </div>
                    </div>
                    {/* Stock + Rating */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Stock Quantity *</label>
                        <input type="number" placeholder="e.g. 12" min="0" value={productForm.stock} onChange={(e) => handleProductFormField("stock", e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Rating (0 – 5)</label>
                        <input type="number" placeholder="e.g. 4.8" min="0" max="5" step="0.1" value={productForm.rating} onChange={(e) => handleProductFormField("rating", e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                      </div>
                    </div>
                    {/* Description */}
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Description</label>
                      <textarea rows={3} placeholder="Write a compelling product description..." value={productForm.description} onChange={(e) => handleProductFormField("description", e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                    </div>
                    {/* Specs */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Specifications</label>
                        <button type="button" onClick={() => setProductForm(f => ({ ...f, specs: [...f.specs, { key: "", value: "" }] }))} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Row</button>
                      </div>
                      <div className="space-y-2">
                        {productForm.specs.map((spec, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input type="text" placeholder="e.g. Movement" value={spec.key} onChange={e => setProductForm(f => ({ ...f, specs: f.specs.map((s, i) => i === idx ? { ...s, key: e.target.value } : s) }))} className="flex-1 px-3 py-2 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <input type="text" placeholder="e.g. Automatic" value={spec.value} onChange={e => setProductForm(f => ({ ...f, specs: f.specs.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) }))} className="flex-1 px-3 py-2 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <button type="button" onClick={() => setProductForm(f => ({ ...f, specs: f.specs.filter((_, i) => i !== idx) }))} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-destructive transition-all"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Colors / Finishes */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Color / Finish</label>
                        <button type="button" onClick={() => setProductForm(f => ({ ...f, colors: [...f.colors, { label: "", hex: "#000000" }] }))} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Color</button>
                      </div>
                      <div className="space-y-2">
                        {productForm.colors.map((color, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input type="color" value={color.hex} onChange={e => setProductForm(f => ({ ...f, colors: f.colors.map((c, i) => i === idx ? { ...c, hex: e.target.value } : c) }))} className="w-10 h-9 rounded-sm border border-border cursor-pointer bg-transparent p-0.5" />
                            <input type="text" placeholder="e.g. Midnight Black, Rose Gold" value={color.label} onChange={e => setProductForm(f => ({ ...f, colors: f.colors.map((c, i) => i === idx ? { ...c, label: e.target.value } : c) }))} className="flex-1 px-3 py-2 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <span className="text-xs font-mono text-muted-foreground w-16">{color.hex}</span>
                            <button type="button" onClick={() => setProductForm(f => ({ ...f, colors: f.colors.filter((_, i) => i !== idx) }))} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-destructive transition-all"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Flags */}
                    <div className="grid grid-cols-3 gap-3">
                      {([["isNew", "New Arrival"], ["isFeatured", "Featured"], ["isBestSeller", "Best Seller"]] as const).map(([key, label]) => (
                        <label key={key} className={`flex items-center gap-2.5 p-3 border rounded-sm cursor-pointer transition-all ${productForm[key] ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                          <input type="checkbox" checked={productForm[key] as boolean} onChange={(e) => handleProductFormField(key, e.target.checked)} className="accent-primary" />
                          <span className="text-xs font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card">
                    <button onClick={() => setProductModalOpen(false)} className="px-5 py-2.5 border border-border rounded-sm text-sm font-medium hover:border-primary hover:text-primary transition-all">
                      Cancel
                    </button>
                    <button onClick={handleSaveProduct} className={`px-6 py-2.5 rounded-sm text-sm font-bold flex items-center gap-2 transition-all ${productSaved ? "bg-status-success text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                      {productSaved ? <><Check className="w-4 h-4" /> Saved!</> : <>{editingProductId !== null ? "Save Changes" : "Add Product"}</>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Orders</h1>
              <div className="relative">
                <button onClick={() => setExportDropdownOpen(v => !v)} className="flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-sm hover:border-primary hover:text-primary transition-all">
                  <Download className="w-4 h-4" /> Export Report <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </button>
                {exportDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border rounded-sm shadow-xl z-20">
                    <button onClick={() => setExportDropdownOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left">
                      <FileText className="w-3.5 h-3.5 text-status-error" /> Export as PDF
                    </button>
                    <button onClick={() => setExportDropdownOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left border-t border-border">
                      <FileText className="w-3.5 h-3.5 text-status-success" /> Export as Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-primary text-xs">{o.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{o.customer}</p>
                            <p className="text-xs text-muted-foreground">{o.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{o.items.map((i) => i.name).join(", ")}</td>
                        <td className="py-3 px-4 font-mono font-bold text-primary">₦{o.total.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                            className={`text-xs font-mono px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${statusColors[o.status]}`}
                          >
                            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs font-mono">{o.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-primary transition-all" title="View Details"><Eye className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Customers</h1>
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Customer", "Phone", "Orders", "Total Spent", "Joined", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">{c.avatar}</div>
                            <div>
                              <p className={`font-medium ${c.status === "Inactive" ? "text-muted-foreground line-through" : ""}`}>{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs font-mono">{c.phone}</td>
                        <td className="py-3 px-4 font-mono">{c.orders}</td>
                        <td className="py-3 px-4 font-mono font-bold text-primary">₦{c.spent.toLocaleString()}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs font-mono">{c.joined}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-mono ${c.status === "Active" ? "text-status-success bg-status-success-bg" : "text-status-error bg-status-error-bg"}`}>{c.status}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x))}
                              className={`p-1.5 rounded-sm transition-all ${c.status === "Active" ? "hover:bg-muted text-muted-foreground hover:text-destructive" : "hover:bg-muted text-status-success hover:text-status-success"}`}
                              title={c.status === "Active" ? "Deactivate Account" : "Reactivate Account"}
                            >
                              {c.status === "Active" ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Payment Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-status-success bg-status-success-bg" },
                { label: "Pending Payments", value: `₦${orders.filter((o) => o.status === "Pending").reduce((s, o) => s + o.total, 0).toLocaleString()}`, icon: Clock, color: "text-status-warning bg-status-warning-bg" },
                { label: "Refunds", value: "₦0", icon: RefreshCw, color: "text-status-info bg-status-info-bg" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border rounded-sm p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-sm p-5">
              <h3 className="font-bold mb-4">Transaction History</h3>
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${o.status === "Cancelled" ? "bg-status-error-bg" : "bg-status-success-bg"}`}>
                        {o.status === "Cancelled" ? <XCircle className="w-4 h-4 text-status-error" /> : <Check className="w-4 h-4 text-status-success" />}
                      </div>
                      <div>
                        <p className="text-sm font-mono font-medium">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.customer} · {o.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold ${o.status === "Cancelled" ? "text-muted-foreground line-through" : "text-primary"}`}>₦{o.total.toLocaleString()}</p>
                      <span className={`text-xs font-mono ${statusColors[o.status]}`}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div>
            <h1 className="text-2xl font-bold mb-2">Content Management</h1>
            <p className="text-muted-foreground text-sm mb-6">Click Manage on any section to edit its content.</p>

            {/* Section cards */}
            {contentSection === null && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "banners" as ContentSection, title: "Homepage Banners", desc: `${banners.length} banners configured`, icon: Layers, count: banners.filter(b => b.active).length + " active" },
                  { key: "featured" as ContentSection, title: "Featured Products", desc: "Curate featured product selection", icon: Award, count: featuredIds.length + " products" },
                  { key: "arrivals" as ContentSection, title: "New Arrivals", desc: "Highlight and schedule new arrivals", icon: Zap, count: newArrivalIds.length + " products" },
                  { key: "campaigns" as ContentSection, title: "Promotional Campaigns", desc: "Create and manage discount campaigns", icon: Tag, count: campaigns.filter(c => c.active).length + " active" },
                ].map(({ key, title, desc, icon: Icon, count }) => (
                  <div key={key} className="bg-card border border-border rounded-sm p-6 hover:border-primary/40 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-sm">{count}</span>
                    </div>
                    <h3 className="font-bold mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{desc}</p>
                    <button onClick={() => setContentSection(key)} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                      Manage <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ── Homepage Banners panel ── */}
            {contentSection === "banners" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={() => setContentSection(null)} className="p-1.5 hover:bg-muted rounded-sm transition-colors">
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <h2 className="text-xl font-bold">Homepage Banners</h2>
                </div>
                {/* Existing banners */}
                <div className="space-y-3 mb-6">
                  {banners.map((b) => (
                    <div key={b.id} className="bg-card border border-border rounded-sm p-4 flex gap-4 items-center">
                      <img src={b.imageUrl} alt={b.title} className="w-24 h-14 object-cover rounded-sm bg-secondary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{b.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm">{b.ctaText}</span>
                          <span className={`text-xs font-mono ${b.active ? "text-status-success" : "text-muted-foreground"}`}>{b.active ? "Active" : "Inactive"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setBanners(prev => prev.map(x => x.id === b.id ? {...x, active: !x.active} : x))} className={`text-xs px-2.5 py-1.5 rounded-sm border transition-all ${b.active ? "border-status-warning/40 text-status-warning hover:bg-status-warning-bg" : "border-status-success/40 text-status-success hover:bg-status-success-bg"}`}>
                          {b.active ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => setBanners(prev => prev.filter(x => x.id !== b.id))} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-destructive transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Add new banner form */}
                <div className="bg-card border border-border rounded-sm p-5">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add New Banner</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Title *</label>
                        <input type="text" value={bannerForm.title} onChange={e => setBannerForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Time is Art" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Subtitle</label>
                        <input type="text" value={bannerForm.subtitle} onChange={e => setBannerForm(f => ({...f, subtitle: e.target.value}))} placeholder="Supporting text" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Banner Image *</label>
                      <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerImageUpload} />
                      <button
                        type="button"
                        onClick={() => bannerFileRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border-2 border-dashed border-border rounded-sm hover:border-primary hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-primary"
                      >
                        <Upload className="w-4 h-4" />
                        {bannerForm.imageUrl ? "Change Banner Image" : "Choose Image from Files"}
                      </button>
                      {bannerForm.imageUrl && (
                        <div className="mt-2 relative group">
                          <img src={bannerForm.imageUrl} alt="Banner preview" className="w-full h-28 object-cover rounded-sm border border-border bg-secondary" />
                          <button type="button" onClick={() => setBannerForm(f => ({...f, imageUrl: ""}))} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">CTA Button Text</label>
                        <input type="text" value={bannerForm.ctaText} onChange={e => setBannerForm(f => ({...f, ctaText: e.target.value}))} placeholder="e.g. Shop Now" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Link / URL</label>
                        <input type="text" value={bannerForm.link} onChange={e => setBannerForm(f => ({...f, link: e.target.value}))} placeholder="e.g. /shop" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!bannerForm.title || !bannerForm.imageUrl) return;
                        const newId = banners.length ? Math.max(...banners.map(b => b.id)) + 1 : 1;
                        setBanners(prev => [...prev, { id: newId, ...bannerForm, active: true }]);
                        setBannerForm({ title: "", subtitle: "", imageUrl: "", ctaText: "", link: "" });
                        setContentSaved(true); setTimeout(() => setContentSaved(false), 1500);
                      }}
                      className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      {contentSaved ? <><Check className="w-4 h-4" /> Banner Added!</> : <><Plus className="w-4 h-4" /> Add Banner</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Featured Products panel ── */}
            {contentSection === "featured" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={() => setContentSection(null)} className="p-1.5 hover:bg-muted rounded-sm transition-colors"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
                  <h2 className="text-xl font-bold">Featured Products</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Select which watches appear in the Featured section on the homepage.</p>
                <div className="space-y-2 mb-5">
                  {products.map(p => (
                    <label key={p.id} className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${featuredIds.includes(p.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <input type="checkbox" checked={featuredIds.includes(p.id)} onChange={e => setFeaturedIds(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} className="accent-primary shrink-0" />
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-sm bg-secondary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.brand} {p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.category} · ₦{p.price.toLocaleString()}</p>
                      </div>
                      {featuredIds.includes(p.id) && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </label>
                  ))}
                </div>
                <button onClick={() => { setContentSaved(true); setTimeout(() => setContentSaved(false), 1500); }} className={`px-6 py-2.5 rounded-sm text-sm font-bold flex items-center gap-2 transition-all ${contentSaved ? "bg-status-success text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                  {contentSaved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Featured Selection"}
                </button>
              </div>
            )}

            {/* ── New Arrivals panel ── */}
            {contentSection === "arrivals" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={() => setContentSection(null)} className="p-1.5 hover:bg-muted rounded-sm transition-colors"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
                  <h2 className="text-xl font-bold">New Arrivals</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Select which watches appear in the New Arrivals section and page.</p>
                <div className="space-y-2 mb-5">
                  {products.map(p => (
                    <label key={p.id} className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${newArrivalIds.includes(p.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <input type="checkbox" checked={newArrivalIds.includes(p.id)} onChange={e => setNewArrivalIds(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))} className="accent-primary shrink-0" />
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-sm bg-secondary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.brand} {p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.category} · ₦{p.price.toLocaleString()}</p>
                      </div>
                      {newArrivalIds.includes(p.id) && <span className="text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm font-mono uppercase shrink-0">New</span>}
                    </label>
                  ))}
                </div>
                <button onClick={() => { setContentSaved(true); setTimeout(() => setContentSaved(false), 1500); }} className={`px-6 py-2.5 rounded-sm text-sm font-bold flex items-center gap-2 transition-all ${contentSaved ? "bg-status-success text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                  {contentSaved ? <><Check className="w-4 h-4" /> Saved!</> : "Save New Arrivals"}
                </button>
              </div>
            )}

            {/* ── Promotional Campaigns panel ── */}
            {contentSection === "campaigns" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={() => setContentSection(null)} className="p-1.5 hover:bg-muted rounded-sm transition-colors"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
                  <h2 className="text-xl font-bold">Promotional Campaigns</h2>
                </div>
                {/* Existing campaigns */}
                <div className="space-y-3 mb-6">
                  {campaigns.map(c => (
                    <div key={c.id} className="bg-card border border-border rounded-sm p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-lg font-bold text-primary font-mono">{c.discount}%</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{c.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">{c.code}</span>
                            <span className="text-xs text-muted-foreground">{c.startDate} → {c.endDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setCampaigns(prev => prev.map(x => x.id === c.id ? {...x, active: !x.active} : x))} className={`text-xs px-2.5 py-1.5 rounded-sm border transition-all ${c.active ? "border-status-warning/40 text-status-warning hover:bg-status-warning-bg" : "border-status-success/40 text-status-success hover:bg-status-success-bg"}`}>
                          {c.active ? "Pause" : "Activate"}
                        </button>
                        <button onClick={() => setCampaigns(prev => prev.filter(x => x.id !== c.id))} className="p-1.5 hover:bg-muted rounded-sm text-muted-foreground hover:text-destructive transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Add new campaign form */}
                <div className="bg-card border border-border rounded-sm p-5">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Create New Campaign</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Campaign Name *</label>
                        <input type="text" value={campaignForm.name} onChange={e => setCampaignForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Ramadan Sale" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Discount Code *</label>
                        <input type="text" value={campaignForm.code} onChange={e => setCampaignForm(f => ({...f, code: e.target.value.toUpperCase()}))} placeholder="e.g. RAMADAN25" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono uppercase" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Discount %</label>
                        <input type="number" min="1" max="100" value={campaignForm.discount} onChange={e => setCampaignForm(f => ({...f, discount: e.target.value}))} placeholder="e.g. 20" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Start Date</label>
                        <input type="date" value={campaignForm.startDate} onChange={e => setCampaignForm(f => ({...f, startDate: e.target.value}))} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">End Date</label>
                        <input type="date" value={campaignForm.endDate} onChange={e => setCampaignForm(f => ({...f, endDate: e.target.value}))} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!campaignForm.name || !campaignForm.code) return;
                        const newId = campaigns.length ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;
                        setCampaigns(prev => [...prev, { id: newId, ...campaignForm, active: true }]);
                        setCampaignForm({ name: "", code: "", discount: "", startDate: "", endDate: "" });
                        setContentSaved(true); setTimeout(() => setContentSaved(false), 1500);
                      }}
                      className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      {contentSaved ? <><Check className="w-4 h-4" /> Campaign Created!</> : <><Plus className="w-4 h-4" /> Create Campaign</>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────

function LoginPage({ onNavigate, onLogin }: {
  onNavigate: (page: Page) => void;
  onLogin: (user: { name: string; email: string }, isAdmin?: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      const isAdmin = email.toLowerCase().includes("admin");
      onLogin({ name: isAdmin ? "Admin User" : "James Okafor", email }, isAdmin);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your Tempus account</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-8">
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="james@example.com" className="w-full px-3 py-3 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-3 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex justify-end">
              <button className="text-xs text-primary hover:underline">Forgot password?</button>
            </div>
          </div>
          <button onClick={handleLogin} className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-colors">
            Sign In
          </button>
          <div className="mt-4 p-3 bg-muted rounded-sm text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Demo accounts:</p>
            <p>Customer: any email + password</p>
            <p>Admin: use "admin" in email address</p>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-5">
            {"Don't have an account? "}
            <button onClick={() => onNavigate("register")} className="text-primary hover:underline font-medium">Create one</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onNavigate, onLogin }: {
  onNavigate: (page: Page) => void;
  onLogin: (user: { name: string; email: string }) => void;
}) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const handleField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const handleRegister = () => {
    if (form.firstName && form.email) {
      onLogin({ name: `${form.firstName} ${form.lastName}`, email: form.email });
    }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Join Tempus</h1>
          <p className="text-muted-foreground mt-2">Create your account to start collecting</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">First Name</label>
              <input value={form.firstName} onChange={(e) => handleField("firstName", e.target.value)} className="w-full px-3 py-3 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Last Name</label>
              <input value={form.lastName} onChange={(e) => handleField("lastName", e.target.value)} className="w-full px-3 py-3 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => handleField("email", e.target.value)} className="w-full px-3 py-3 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Password</label>
              <input type="password" value={form.password} onChange={(e) => handleField("password", e.target.value)} placeholder="Min 8 characters" className="w-full px-3 py-3 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">By creating an account, you agree to our <button className="text-primary hover:underline">Terms of Service</button> and <button className="text-primary hover:underline">Privacy Policy</button>.</p>
          <button onClick={handleRegister} className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-colors">
            Create Account
          </button>
          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} className="text-primary hover:underline font-medium">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Static Pages ─────────────────────────────────────────────────────────────

function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative rounded-sm overflow-hidden mb-16">
        <img src="https://images.unsplash.com/photo-1618215650201-8d552591218d?w=1200&h=400&fit=crop&auto=format" alt="About Tempus" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-center px-10">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary mb-2">Our Story</p>
            <h1 className="text-4xl font-bold text-white">About Tempus</h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Founded in Passion</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Tempus was founded in 2018 with a singular vision: to bring the world's most extraordinary timepieces to discerning collectors across Africa and beyond. What began as a small boutique in Lagos has grown into Nigeria's premier authorized luxury watch dealer.</p>
          <p className="text-muted-foreground leading-relaxed">Every watch we carry is meticulously authenticated, sourced directly from authorized manufacturers, and presented with the care and reverence these masterpieces deserve. We believe a great watch is not just a tool for telling time — it is a legacy, an heirloom, a work of art.</p>
        </div>
        <div className="space-y-5">
          {[
            { n: "500+", l: "Curated timepieces from 30+ brands" },
            { n: "12,000+", l: "Happy collectors served" },
            { n: "6", l: "Years of horological expertise" },
            { n: "100%", l: "Authenticated & certified genuine" },
          ].map(({ n, l }) => (
            <div key={n} className="flex items-center gap-4 p-4 bg-card border border-border rounded-sm">
              <span className="text-3xl font-bold text-primary font-mono w-28 shrink-0">{n}</span>
              <span className="text-sm text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-sm p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Our Promise</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Every timepiece sold through Tempus carries our guarantee of authenticity, backed by original manufacturer documentation, certificate of authenticity, and our own independent verification process.</p>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Shield, label: "Fully Authenticated" },
            { icon: Award, label: "Authorized Dealer" },
            { icon: RefreshCw, label: "30-Day Returns" },
            { icon: Truck, label: "Insured Shipping" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs font-mono tracking-[0.25em] uppercase text-primary mb-3">Get in Touch</p>
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Our team of horological specialists is available to assist you with purchases, valuations, servicing enquiries, and general questions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-card border border-border rounded-sm p-8">
          <h2 className="text-xl font-bold mb-6">Send a Message</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">First Name</label>
                <input type="text" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Last Name</label>
                <input type="text" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Email</label>
              <input type="email" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Subject</label>
              <select className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Purchase Enquiry</option>
                <option>Order Support</option>
                <option>Returns & Exchanges</option>
                <option>Watch Valuation</option>
                <option>General Enquiry</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Message</label>
              <textarea rows={5} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
            <button className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-colors">Send Message</button>
          </div>
        </div>
        <div className="space-y-6">
          {[
            { icon: MapPin, title: "Visit Our Boutique", lines: ["14 Broad Street, Lagos Island", "Lagos, Nigeria"] },
            { icon: Phone, title: "Call Us", lines: ["+234 800 TEMPUS 1", "Mon–Sat, 9am–6pm WAT"] },
            { icon: Mail, title: "Email Us", lines: ["hello@tempuswatches.com", "Response within 24 hours"] },
            { icon: MessageCircle, title: "Live Chat", lines: ["Available on the website", "Mon–Sat, 9am–9pm WAT"] },
          ].map(({ icon: Icon, title, lines }) => (
            <div key={title} className="flex gap-4 p-5 bg-card border border-border rounded-sm">
              <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">{title}</p>
                {lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-xs font-mono tracking-[0.25em] uppercase text-primary mb-3">Support</p>
        <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about shopping with Tempus.</p>
      </div>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium text-sm pr-4">{item.q}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-4 border-t border-border/50 pt-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WishlistPage({ wishlist, onNavigate, onToggleWishlist, onAddToCart }: {
  wishlist: Product[];
  onNavigate: (page: Page, id?: number) => void;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <Heart className="w-16 h-16 text-muted mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Save the timepieces you love.</p>
          <button onClick={() => onNavigate("shop")} className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors">
            Browse Collection <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} isWishlisted={true} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, title: "Time is Art", subtitle: "Discover the world's finest timepieces — from hand-assembled tourbillons to precision sports chronographs. Every watch tells a story worth wearing.", imageUrl: "https://images.unsplash.com/photo-1618215650148-e8e61eae521c?w=1400&h=900&fit=crop&auto=format", ctaText: "Explore Collection", link: "/shop", active: true },
    { id: 2, title: "The Elara Moonphase", subtitle: "Limited edition — only 88 pieces worldwide. Hand-assembled over 400 hours with grand feu enamel dial.", imageUrl: "https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=1400&h=900&fit=crop&auto=format", ctaText: "Discover More", link: "/product/11", active: true },
  ]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [featuredIds, setFeaturedIds] = useState<number[]>(PRODUCTS.filter(p => p.isFeatured).map(p => p.id));
  const [newArrivalIds, setNewArrivalIds] = useState<number[]>(PRODUCTS.filter(p => p.isNew).map(p => p.id));
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useCallback((page: Page, productId?: number) => {
    if (productId !== undefined) setSelectedProductId(productId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) } : i);
      return [...prev, { product, quantity: 1, selectedColor: product.colors[0] }];
    });
  }, []);

  const updateCart = useCallback((productId: number, qty: number) => {
    setCart((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i));
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => prev.some((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product]);
  }, []);

  const handleLogin = (u: { name: string; email: string }, admin = false) => {
    setUser(u);
    setIsAdmin(admin);
    navigate(admin ? "admin" : "home");
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    navigate("home");
  };

  const handlePlaceOrder = () => {
    setCart([]);
    navigate("confirmation");
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const showFooter = !["admin", "login", "register"].includes(currentPage);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar
          currentPage={currentPage}
          onNavigate={navigate}
          cartCount={cartCount}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          user={user}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />

        <main>
          {currentPage === "home" && (
            <HomePage onNavigate={navigate} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} banners={banners} featuredIds={featuredIds} newArrivalIds={newArrivalIds} products={products} />
          )}
          {currentPage === "shop" && (
            <ShopPage onNavigate={navigate} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} products={products} />
          )}
          {currentPage === "product" && (
            <ProductDetailPage productId={selectedProductId} onNavigate={navigate} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} products={products} />
          )}
          {currentPage === "newArrivals" && (
            <NewArrivalsPage onNavigate={navigate} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} products={products} newArrivalIds={newArrivalIds} />
          )}
          {currentPage === "cart" && (
            <CartPage cart={cart} onUpdateCart={updateCart} onRemoveFromCart={removeFromCart} onNavigate={navigate} onClearCart={() => setCart([])} />
          )}
          {currentPage === "wishlist" && (
            <WishlistPage wishlist={wishlist} onNavigate={navigate} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />
          )}
          {currentPage === "checkout" && (
            <CheckoutPage cart={cart} onNavigate={navigate} onPlaceOrder={handlePlaceOrder} />
          )}
          {currentPage === "confirmation" && (
            <ConfirmationPage onNavigate={navigate} />
          )}
          {currentPage === "account" && (
            <UserDashboard user={user} wishlist={wishlist} onNavigate={navigate} onToggleWishlist={toggleWishlist} />
          )}
          {currentPage === "admin" && (
            <AdminDashboard banners={banners} setBanners={setBanners} featuredIds={featuredIds} setFeaturedIds={setFeaturedIds} newArrivalIds={newArrivalIds} setNewArrivalIds={setNewArrivalIds} products={products} setProducts={setProducts} />
          )}
          {currentPage === "login" && (
            <LoginPage onNavigate={navigate} onLogin={handleLogin} />
          )}
          {currentPage === "register" && (
            <RegisterPage onNavigate={navigate} onLogin={(u) => handleLogin(u, false)} />
          )}
          {currentPage === "about" && <AboutPage />}
          {currentPage === "contact" && <ContactPage />}
          {currentPage === "faq" && <FAQPage />}
        </main>

        {showFooter && <Footer onNavigate={navigate} />}
      </div>
    </div>
  );
}

/*
# Create e-commerce schema (Part 2: orders, order_items, cart, wishlist)

## Overview
Creates the transactional tables for the e-commerce app: orders, order_items,
cart_items, and wishlist_items. All are owner-scoped (user_id based) with admin override.

## New Tables
1. orders — id, user_id (FK auth.users), order_number, status, total, customer info, payment_method
2. order_items — id, order_id (FK orders), product_id (FK products), name, qty, price
3. cart_items — id, user_id (FK auth.users), product_id (FK products), quantity, selected_color
4. wishlist_items — id, user_id (FK auth.users), product_id (FK products)

## Security
- RLS on all tables
- orders: owner read, owner insert, admin update/delete
- order_items: owner read (via parent order), owner insert
- cart_items: full owner CRUD
- wishlist_items: owner read/insert/delete
*/

-- ─── Orders ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'Pending',
  total numeric NOT NULL DEFAULT 0,
  customer_name text NOT NULL DEFAULT '',
  customer_email text NOT NULL DEFAULT '',
  shipping_address text NOT NULL DEFAULT '',
  payment_method text NOT NULL DEFAULT 'card',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_orders" ON orders;
CREATE POLICY "owner_read_orders" ON orders FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "owner_insert_orders" ON orders;
CREATE POLICY "owner_insert_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- ─── Order Items ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT '',
  qty integer NOT NULL DEFAULT 1,
  price numeric NOT NULL DEFAULT 0
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_order_items" ON order_items;
CREATE POLICY "owner_read_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (
      orders.user_id = auth.uid()
      OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    ))
  );

DROP POLICY IF EXISTS "owner_insert_order_items" ON order_items;
CREATE POLICY "owner_insert_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- ─── Cart Items ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  selected_color text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_cart" ON cart_items;
CREATE POLICY "owner_read_cart" ON cart_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_cart" ON cart_items;
CREATE POLICY "owner_insert_cart" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_cart" ON cart_items;
CREATE POLICY "owner_update_cart" ON cart_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_cart" ON cart_items;
CREATE POLICY "owner_delete_cart" ON cart_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── Wishlist Items ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_wishlist" ON wishlist_items;
CREATE POLICY "owner_read_wishlist" ON wishlist_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_wishlist" ON wishlist_items;
CREATE POLICY "owner_insert_wishlist" ON wishlist_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_wishlist" ON wishlist_items;
CREATE POLICY "owner_delete_wishlist" ON wishlist_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);

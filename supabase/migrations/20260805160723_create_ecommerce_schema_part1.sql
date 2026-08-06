/*
# Create e-commerce schema with full RLS (Part 1: profiles + products + banners + campaigns)

## Overview
Creates the foundational tables for the luxury watch e-commerce app.
Profiles stores user data (with is_admin flag). Products, banners, and campaigns
are publicly readable and admin-writable.

## New Tables
1. profiles — id (FK auth.users), full_name, phone, is_admin, created_at
2. products — full catalog with jsonb images/specs/colors
3. banners — homepage hero slides
4. campaigns — promotional discount codes

## Security
- RLS on all tables
- profiles: owner read/update, all authenticated can read (for admin checks)
- products/banners/campaigns: public read, admin write
- Auto-create profile on signup via trigger
*/

-- ─── Profiles ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_profile" ON profiles;
CREATE POLICY "owner_read_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "owner_update_profile" ON profiles;
CREATE POLICY "owner_update_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "authenticated_read_is_admin" ON profiles;
CREATE POLICY "authenticated_read_is_admin" ON profiles FOR SELECT
  TO authenticated USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Products ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL DEFAULT 'Autem',
  category text NOT NULL DEFAULT 'Luxury',
  price numeric NOT NULL DEFAULT 0,
  original_price numeric NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  rating numeric NOT NULL DEFAULT 4.5,
  reviews integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  is_new boolean NOT NULL DEFAULT false,
  is_best_seller boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  description text NOT NULL DEFAULT '',
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  discount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- ─── Banners ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_banners" ON banners;
CREATE POLICY "public_read_banners" ON banners FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_banners" ON banners;
CREATE POLICY "admin_insert_banners" ON banners FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "admin_update_banners" ON banners;
CREATE POLICY "admin_update_banners" ON banners FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "admin_delete_banners" ON banners;
CREATE POLICY "admin_delete_banners" ON banners FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- ─── Campaigns ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  code text NOT NULL DEFAULT '',
  discount text NOT NULL DEFAULT '',
  start_date text NOT NULL DEFAULT '',
  end_date text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_campaigns" ON campaigns;
CREATE POLICY "public_read_campaigns" ON campaigns FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_campaigns" ON campaigns;
CREATE POLICY "admin_insert_campaigns" ON campaigns FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "admin_update_campaigns" ON campaigns;
CREATE POLICY "admin_update_campaigns" ON campaigns FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

DROP POLICY IF EXISTS "admin_delete_campaigns" ON campaigns;
CREATE POLICY "admin_delete_campaigns" ON campaigns FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

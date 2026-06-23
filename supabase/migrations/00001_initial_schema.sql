-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Function to auto-update 'updated_at'
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 1. Businesses Table
create table businesses (
    id text primary key,
    user_id uuid references auth.users not null,
    legal_name text not null,
    trade_name text,
    gstin text,
    pan text,
    gst_type text,
    address jsonb,
    shipping_addresses jsonb default '[]'::jsonb,
    phone text,
    email text,
    logo_uri text,
    signature_uri text,
    bank_details jsonb default '[]'::jsonb,
    upi_vpa text,
    fiscal_year_start text,
    default_currency text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz
);

-- 2. Parties Table (Customers/Vendors)
create table parties (
    id text primary key,
    user_id uuid references auth.users not null,
    party_type text not null,
    legal_name text not null,
    trade_name text,
    gstin text,
    pan text,
    phone text,
    email text,
    gst_type text,
    billing_address jsonb,
    shipping_addresses jsonb default '[]'::jsonb,
    contact_persons jsonb default '[]'::jsonb,
    payment_terms_days integer,
    credit_limit_paise bigint,
    opening_balance_paise bigint,
    opening_balance_type text,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz
);

-- 3. Inventory Items
create table inventory_items (
    id text primary key,
    user_id uuid references auth.users not null,
    name text not null,
    type text not null,
    unit_price_paise bigint not null,
    purchase_price_paise bigint,
    hsn_sac_code text,
    tax_rate jsonb,
    unit text,
    stock numeric,
    minimum_stock numeric,
    sku text,
    barcode text,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz
);

-- 4. Documents (Sales Invoices, Purchase Orders, etc.)
create table documents (
    id text primary key,
    user_id uuid references auth.users not null,
    document_type text not null,
    document_number text not null,
    document_date text not null,
    due_date text,
    business_id text references businesses(id),
    party_id text references parties(id),
    party_name text,
    line_items jsonb default '[]'::jsonb,
    gst_summary jsonb,
    subtotal_paise bigint,
    total_discount_paise bigint,
    total_taxable_amount_paise bigint,
    total_gst_amount_paise bigint,
    total_amount_paise bigint,
    total_amount_in_words text,
    notes text,
    terms_and_conditions text,
    is_inter_state boolean,
    place_of_supply text,
    status text,
    irn_details jsonb,
    balance_due_paise bigint,
    paid_amount_paise bigint,
    payment_mode text,
    e_way_bill_number text,
    linked_challan_id text,
    expected_delivery_date text,
    vendor_quote_number text,
    original_invoice_id text,
    reason text,
    vehicle_number text,
    transporter_name text,
    dispatch_date text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz
);

-- 5. Payments
create table payments (
    id text primary key,
    user_id uuid references auth.users not null,
    date text not null,
    amount_paise bigint not null,
    mode text not null,
    type text not null,
    party_id text references parties(id),
    party_name text,
    document_id text references documents(id),
    document_number text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz
);

-- 6. Expenses
create table expenses (
    id text primary key,
    user_id uuid references auth.users not null,
    date text not null,
    category text not null,
    amount_paise bigint not null,
    payment_mode text not null,
    vendor_name text,
    notes text,
    receipt_image text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz
);

-- 7. Stock Adjustments
create table stock_adjustments (
    id text primary key,
    user_id uuid references auth.users not null,
    date text not null,
    item_id text references inventory_items(id),
    item_name text not null,
    type text not null,
    qty numeric not null,
    reason text not null,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz
);

-- Add updated_at triggers to all tables
create trigger set_updated_at_businesses before update on businesses for each row execute procedure update_updated_at_column();
create trigger set_updated_at_parties before update on parties for each row execute procedure update_updated_at_column();
create trigger set_updated_at_inventory_items before update on inventory_items for each row execute procedure update_updated_at_column();
create trigger set_updated_at_documents before update on documents for each row execute procedure update_updated_at_column();
create trigger set_updated_at_payments before update on payments for each row execute procedure update_updated_at_column();
create trigger set_updated_at_expenses before update on expenses for each row execute procedure update_updated_at_column();
create trigger set_updated_at_stock_adjustments before update on stock_adjustments for each row execute procedure update_updated_at_column();

-- Enable Row Level Security
alter table businesses enable row level security;
alter table parties enable row level security;
alter table inventory_items enable row level security;
alter table documents enable row level security;
alter table payments enable row level security;
alter table expenses enable row level security;
alter table stock_adjustments enable row level security;

-- Create RLS Policies
create policy "Users can view own businesses" on businesses for select using (auth.uid() = user_id);
create policy "Users can insert own businesses" on businesses for insert with check (auth.uid() = user_id);
create policy "Users can update own businesses" on businesses for update using (auth.uid() = user_id);
create policy "Users can delete own businesses" on businesses for delete using (auth.uid() = user_id);

create policy "Users can view own parties" on parties for select using (auth.uid() = user_id);
create policy "Users can insert own parties" on parties for insert with check (auth.uid() = user_id);
create policy "Users can update own parties" on parties for update using (auth.uid() = user_id);
create policy "Users can delete own parties" on parties for delete using (auth.uid() = user_id);

create policy "Users can view own inventory items" on inventory_items for select using (auth.uid() = user_id);
create policy "Users can insert own inventory items" on inventory_items for insert with check (auth.uid() = user_id);
create policy "Users can update own inventory items" on inventory_items for update using (auth.uid() = user_id);
create policy "Users can delete own inventory items" on inventory_items for delete using (auth.uid() = user_id);

create policy "Users can view own documents" on documents for select using (auth.uid() = user_id);
create policy "Users can insert own documents" on documents for insert with check (auth.uid() = user_id);
create policy "Users can update own documents" on documents for update using (auth.uid() = user_id);
create policy "Users can delete own documents" on documents for delete using (auth.uid() = user_id);

create policy "Users can view own payments" on payments for select using (auth.uid() = user_id);
create policy "Users can insert own payments" on payments for insert with check (auth.uid() = user_id);
create policy "Users can update own payments" on payments for update using (auth.uid() = user_id);
create policy "Users can delete own payments" on payments for delete using (auth.uid() = user_id);

create policy "Users can view own expenses" on expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses" on expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses" on expenses for update using (auth.uid() = user_id);
create policy "Users can delete own expenses" on expenses for delete using (auth.uid() = user_id);

create policy "Users can view own stock adjustments" on stock_adjustments for select using (auth.uid() = user_id);
create policy "Users can insert own stock adjustments" on stock_adjustments for insert with check (auth.uid() = user_id);
create policy "Users can update own stock adjustments" on stock_adjustments for update using (auth.uid() = user_id);
create policy "Users can delete own stock adjustments" on stock_adjustments for delete using (auth.uid() = user_id);

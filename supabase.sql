-- Minimal schema for Plaid token storage
create table if not exists public.plaid_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_id text not null,
  access_token text not null,
  created_at timestamptz not null default now()
);

-- RLS with owner-only access
alter table public.plaid_items enable row level security;
create policy "Owner can read own plaid items" on public.plaid_items
  for select using (auth.uid() = user_id);
create policy "Owner can insert own plaid item" on public.plaid_items
  for insert with check (auth.uid() = user_id);

-- (BankID tables removed)
-- BankID (Tink) storage
create table if not exists public.bankid_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider text not null default 'tink',
  access_token text not null,
  created_at timestamptz not null default now()
);
alter table public.bankid_items enable row level security;
create policy "Owner can read own bankid items" on public.bankid_items
  for select using (auth.uid() = user_id);
create policy "Owner can insert own bankid item" on public.bankid_items
  for insert with check (auth.uid() = user_id);

-- Persisted accounts
create table if not exists public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider_account_id text not null,
  name text,
  type text,
  currency text,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists bank_accounts_user_provider_unique on public.bank_accounts(user_id, provider_account_id);
alter table public.bank_accounts enable row level security;
create policy "Owner can read own bank accounts" on public.bank_accounts for select using (auth.uid() = user_id);
create policy "Owner can upsert own bank accounts" on public.bank_accounts for insert with check (auth.uid() = user_id);
create policy "Owner can update own bank accounts" on public.bank_accounts for update using (auth.uid() = user_id);

-- Persisted transactions
create table if not exists public.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider_txn_id text not null,
  account_id uuid,
  amount numeric,
  date date,
  description text,
  merchant text,
  raw jsonb,
  created_at timestamptz not null default now()
);
create unique index if not exists bank_txn_user_provider_unique on public.bank_transactions(user_id, provider_txn_id);
alter table public.bank_transactions enable row level security;
create policy "Owner can read own transactions" on public.bank_transactions for select using (auth.uid() = user_id);
create policy "Owner can insert own transactions" on public.bank_transactions for insert with check (auth.uid() = user_id);

-- Detected subscriptions (materialized)
create table if not exists public.detected_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  cadence text,
  last_amount numeric,
  last_date date,
  count integer,
  created_at timestamptz not null default now()
);
create index if not exists detected_subs_user_idx on public.detected_subscriptions(user_id);
alter table public.detected_subscriptions enable row level security;
create policy "Owner can read own detected subs" on public.detected_subscriptions for select using (auth.uid() = user_id);
create policy "Owner can insert own detected subs" on public.detected_subscriptions for insert with check (auth.uid() = user_id);


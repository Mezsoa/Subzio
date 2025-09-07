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

-- User subscriptions (billing)
create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan_id text not null default 'free',
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists user_subscriptions_user_id_unique on public.user_subscriptions(user_id);
alter table public.user_subscriptions enable row level security;
create policy "Owner can read own subscription" on public.user_subscriptions for select using (auth.uid() = user_id);
create policy "Service can manage subscriptions" on public.user_subscriptions for all using (true);

-- User usage tracking
create table if not exists public.user_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bank_accounts_connected integer default 0,
  subscriptions_detected integer default 0,
  alerts_created integer default 0,
  cancellation_requests integer default 0,
  last_reset_date date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists user_usage_user_id_unique on public.user_usage(user_id);
alter table public.user_usage enable row level security;
create policy "Owner can read own usage" on public.user_usage for select using (auth.uid() = user_id);
create policy "Owner can update own usage" on public.user_usage for update using (auth.uid() = user_id);
create policy "Service can manage usage" on public.user_usage for all using (true);

-- Cancellation requests (premium feature)
create table if not exists public.cancellation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_name text not null,
  subscription_details jsonb,
  status text not null default 'pending',
  assigned_to text,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists cancellation_requests_user_id_idx on public.cancellation_requests(user_id);
create index if not exists cancellation_requests_status_idx on public.cancellation_requests(status);
alter table public.cancellation_requests enable row level security;
create policy "Owner can read own cancellation requests" on public.cancellation_requests for select using (auth.uid() = user_id);
create policy "Owner can create cancellation requests" on public.cancellation_requests for insert with check (auth.uid() = user_id);

-- Affiliate tracking
create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subscription_name text not null,
  affiliate_url text not null,
  clicked_at timestamptz not null default now(),
  converted boolean default false,
  conversion_amount numeric,
  commission_earned numeric
);
create index if not exists affiliate_clicks_user_id_idx on public.affiliate_clicks(user_id);
create index if not exists affiliate_clicks_converted_idx on public.affiliate_clicks(converted);
alter table public.affiliate_clicks enable row level security;
create policy "Owner can read own affiliate clicks" on public.affiliate_clicks for select using (auth.uid() = user_id);
create policy "Anyone can create affiliate clicks" on public.affiliate_clicks for insert with check (true);

-- Analytics events
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  properties jsonb default '{}',
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  timestamp timestamptz not null default now(),
  url text,
  user_agent text,
  ip_address text,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_event_name_idx on public.analytics_events(event_name);
create index if not exists analytics_events_user_id_idx on public.analytics_events(user_id);
create index if not exists analytics_events_timestamp_idx on public.analytics_events(timestamp);
alter table public.analytics_events enable row level security;
create policy "Service can manage analytics events" on public.analytics_events for all using (true);

-- Conversions tracking
create table if not exists public.conversions (
  id uuid primary key default gen_random_uuid(),
  conversion_type text not null,
  value numeric default 0,
  user_id uuid references auth.users(id) on delete cascade,
  timestamp timestamptz not null default now(),
  properties jsonb default '{}',
  created_at timestamptz not null default now()
);
create index if not exists conversions_type_idx on public.conversions(conversion_type);
create index if not exists conversions_user_id_idx on public.conversions(user_id);
create index if not exists conversions_timestamp_idx on public.conversions(timestamp);
alter table public.conversions enable row level security;
create policy "Service can manage conversions" on public.conversions for all using (true);


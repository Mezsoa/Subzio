# 🚀 KillSub - AI-Powered Subscription Manager

KillSub is a comprehensive SaaS platform that helps users manage their subscriptions, detect unwanted recurring charges, and save money through intelligent AI-powered insights and cancellation services.

## ✨ Features

### 🔐 **Authentication & Security**
- Supabase authentication with Google OAuth
- Secure bank account connections via Plaid & BankID
- Bank-grade 256-bit encryption
- Read-only access to financial data

### 💳 **Subscription Management**
- AI-powered subscription detection from bank transactions
- Real-time subscription monitoring
- Detailed subscription analytics and insights
- Alternative service recommendations with affiliate partnerships

### 💰 **Monetization & Billing**
- Freemium model with usage-based limits
- Stripe-powered subscription billing (Pro & Business plans)
- Intelligent upgrade prompts and conversion optimization
- Comprehensive billing management dashboard

### 🛠️ **Premium Services**
- **Cancel-for-Me Service**: Our team handles subscription cancellations
- Priority customer support
- Advanced analytics and reporting
- Team/family account management

### 📊 **Analytics & Tracking**
- User behavior analytics
- Conversion funnel tracking
- A/B testing capabilities
- Revenue and usage metrics

### 🎯 **User Experience**
- Guided onboarding flow
- Responsive, modern UI with glassmorphism design
- Collapsible sidebar navigation
- Light/dark theme support
- Comprehensive help center and support system

## 🏗️ **Tech Stack**

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Bank Connections**: Plaid, BankID/Tink
- **Analytics**: Custom analytics system + Google Analytics
- **Deployment**: Vercel (recommended)

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Stripe account
- Plaid account

### 1. Clone & Install
```bash
git clone <your-repo>
cd subzio
pnpm install
```

### 2. Environment Setup
Create `.env.local` file with these variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...

# Plaid
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
NEXT_PUBLIC_PLAID_ENV=sandbox

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
Run the SQL commands in `supabase.sql` in your Supabase dashboard to create all necessary tables and policies.

### 4. Stripe Setup
1. Create products in Stripe for Pro ($9.99/month) and Business ($19.99/month)
2. Copy the price IDs to your environment variables
3. Set up webhook endpoint: `your-domain.com/api/stripe/webhook`

### 5. Run Development Server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 **Deployment Checklist**

### Stripe Configuration
- [ ] Create live Stripe products and prices
- [ ] Update price IDs in environment variables
- [ ] Configure webhook endpoint
- [ ] Test payment flows

### Database
- [ ] Run `supabase.sql` in production database
- [ ] Verify RLS policies are working
- [ ] Test all API endpoints

### Environment Variables
- [ ] Set all production environment variables
- [ ] Switch Plaid to production environment
- [ ] Update app URL

### Analytics & Monitoring
- [ ] Set up Google Analytics (optional)
- [ ] Configure error tracking
- [ ] Test conversion tracking

## 🎯 **Business Model**

### Pricing Tiers

**Free Plan**
- Connect 1 bank account
- Detect up to 10 subscriptions
- Basic cancellation guidance
- Monthly reports

**Pro Plan - $9.99/month**
- Unlimited bank accounts
- Unlimited subscription detection
- Advanced AI insights
- Custom alerts & notifications
- Priority support
- Data export

**Business Plan - $19.99/month**
- Everything in Pro
- Family/team accounts (up to 5 users)
- Advanced analytics & trends
- Bulk subscription management
- API access
- Cancel-for-me service (5 free/month)

### Revenue Streams
1. **Subscription Revenue**: Primary revenue from Pro/Business plans
2. **Affiliate Commissions**: Earn from alternative service recommendations
3. **Premium Services**: Additional fees for extra cancellation requests

## 🛡️ **Security & Privacy**

- All financial data connections are read-only
- No storage of banking credentials
- Bank-grade encryption for all data
- GDPR compliant with comprehensive privacy controls
- Regular security audits and updates

## 📞 **Support**

- **Email**: johnmessoa@gmail.com
- **Help Center**: Available at `/help`
- **Support Portal**: Available at `/support`

## 🚀 **Going Live**

Your KillSub SaaS is now production-ready with:

✅ Complete payment system with Stripe
✅ Freemium limits and upgrade prompts
✅ User account and billing management
✅ Guided onboarding flow
✅ Support and help center
✅ Affiliate recommendation system
✅ Analytics and conversion tracking
✅ Premium cancel-for-me service

**Ready to launch and start generating revenue!** 🎉

## 📝 **License**

This project is proprietary software. All rights reserved.
"use client";
import { useEffect, useState, useCallback } from "react";
import { authedFetch, AuthError } from "@/lib/authedFetch";
import RequireAuth from "@/components/auth/RequireAuth";
import SidebarNav from "@/components/SidebarNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ConnectBank from "@/components/ConnectBank";
import OnboardingFlow from "@/components/OnboardingFlow";
import AIInsights from "@/components/AIInsights";
import UsageLimitsChecker from "@/components/UsageLimitsChecker";

interface Account {
  name?: string;
  official_name?: string;
  type?: string;
  subtype?: string;
  balances?: {
    current?: number;
    available?: number;
    // BankID/Tink structure
    booked?: {
      amount?: {
        value?: {
          unscaledValue?: string;
          scale?: string;
        };
        currencyCode?: string;
      };
    };
    available?: {
      amount?: {
        value?: {
          unscaledValue?: string;
          scale?: string;
        };
        currencyCode?: string;
      };
    };
  };
}

interface Transaction {
  name?: string;
  description?: string;
  date?: string;
  amount: number;
  account_id?: string;
}

interface Subscription {
  name: string;
  cadence?: string;
  lastAmount?: number;
  lastDate?: string;
  count?: number;
  confidence?: number;
  reasons?: string[];
  cancel_url?: string;
  provider_emoji?: string;
}

type DataSource = "auto" | "bankid" | "plaid";

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showRawAccounts, setShowRawAccounts] = useState<boolean>(false);
  const [showRawTransactions, setShowRawTransactions] =
    useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataSource>("auto");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConnect, setShowConnect] = useState(false);
  const { refreshSubscription } = useSubscription();
  const [bankidConnected, setBankidConnected] = useState<boolean | null>(null);
  const [plaidConnected, setPlaidConnected] = useState<boolean | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const { isCollapsed } = useSidebar();

  // Helper function to calculate balance from BankID/Tink structure
  const calculateBalance = (account: Account): number => {
    // Try BankID/Tink structure first
    const bankIdBalance = account.balances?.available?.amount?.value;
    if (bankIdBalance?.unscaledValue && bankIdBalance?.scale !== undefined) {
      const unscaled = parseFloat(bankIdBalance.unscaledValue);
      const scale = parseInt(bankIdBalance.scale);
      return unscaled * Math.pow(10, -scale);
    }

    // Fallback to Plaid structure
    return account.balances?.current ?? account.balances?.available ?? 0;
  };

  const fetchData = useCallback(
    async (source: DataSource = dataSource) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`[Dashboard] Fetching data from: ${source}`);

        let accountsData: Account[] = [];
        let transactionsData: Transaction[] = [];

        // Check connection status
        const bankidCheck = authedFetch("/api/bankid/accounts")
          .then((res) => res.ok)
          .catch(() => false);
        const plaidCheck = authedFetch("/api/plaid/accounts")
          .then((res) => res.ok)
          .catch(() => false);

        const [bankidStatus, plaidStatus] = await Promise.all([
          bankidCheck,
          plaidCheck,
        ]);
        setBankidConnected(bankidStatus);
        setPlaidConnected(plaidStatus);

        if (source === "auto") {
          // Try BankID first; fall back to Plaid
          const ar = await authedFetch("/api/bankid/accounts").catch(
            () => new Response(null, { status: 500 })
          );
          if (ar && ar.ok) {
            const data = await ar.json();
            console.log("[Dashboard] BankID accounts:", data);
            accountsData = data.accounts || [];

            const tr = await authedFetch("/api/bankid/transactions").catch(
              () => new Response(null, { status: 500 })
            );
            if (tr && tr.ok) {
              const txData = await tr.json();
              console.log("[Dashboard] BankID transactions:", txData);
              transactionsData = txData.transactions || [];
            }
          } else {
            console.log("[Dashboard] BankID failed, trying Plaid...");
            const pr = await authedFetch("/api/plaid/accounts");
            if (pr.ok) {
              const data = await pr.json();
              console.log("[Dashboard] Plaid accounts:", data);
              accountsData = data.accounts || [];
            }

            const prt = await authedFetch("/api/plaid/transactions");
            if (prt.ok) {
              const txData = await prt.json();
              console.log("[Dashboard] Plaid transactions:", txData);
              transactionsData = txData.transactions || [];
            }
          }
        } else if (source === "bankid") {
          // BankID only
          const ar = await authedFetch("/api/bankid/accounts");
          if (ar.ok) {
            const data = await ar.json();
            console.log("[Dashboard] BankID accounts:", data);
            accountsData = data.accounts || [];
          } else {
            console.log(
              "[Dashboard] BankID accounts failed:",
              ar.status,
              await ar.text()
            );
          }

          const tr = await authedFetch("/api/bankid/transactions");
          if (tr.ok) {
            const txData = await tr.json();
            console.log("[Dashboard] BankID transactions:", txData);
            transactionsData = txData.transactions || [];
          } else {
            console.log(
              "[Dashboard] BankID transactions failed:",
              tr.status,
              await tr.text()
            );
          }
        } else if (source === "plaid") {
          // Plaid only
          const pr = await authedFetch("/api/plaid/accounts");
          if (pr.ok) {
            const data = await pr.json();
            console.log("[Dashboard] Plaid accounts:", data);
            accountsData = data.accounts || [];
          } else {
            console.log(
              "[Dashboard] Plaid accounts failed:",
              pr.status,
              await pr.text()
            );
          }

          const prt = await authedFetch("/api/plaid/transactions");
          if (prt.ok) {
            const txData = await prt.json();
            console.log("[Dashboard] Plaid transactions:", txData);
            transactionsData = txData.transactions || [];
          } else {
            console.log(
              "[Dashboard] Plaid transactions failed:",
              prt.status,
              await prt.text()
            );
          }
        }

        setAccounts(accountsData);
        setTx(transactionsData);

        // Always fetch subscriptions (they're provider-agnostic)
        const sr = await authedFetch("/api/subscriptions/detect");
        if (sr.ok) {
          const subData = await sr.json();
          console.log("Raw subscription data:", subData);
          setSubs(subData.subscriptions || []);
        } else {
          setSubs([]);
        }

        console.log(`[Dashboard] Data fetch completed for ${source}`);
      } catch (e) {
        console.error("[Dashboard] Error during fetch:", e);
        if (e instanceof AuthError) {
          window.location.href = "/auth/signin";
          return;
        }
        setError(`Failed to load data from ${source}.`);
        setAccounts([]);
        setTx([]);
        setSubs([]);
      } finally {
        setIsLoading(false);
      }
    },
    [dataSource]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Stripe checkout success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      console.log('[Dashboard] Stripe checkout success detected, refreshing subscription...');
      // Refresh subscription data after successful checkout
      setTimeout(() => {
        refreshSubscription();
      }, 2000); // Wait 2 seconds for webhook to process
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refreshSubscription]);

  // Check if user needs onboarding
  useEffect(() => {
    if (!onboardingChecked) {
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      const isFirstVisit = !onboardingCompleted || onboardingCompleted !== 'true';
      
      // Show onboarding if it's the user's first visit and they have no connected accounts
      if (isFirstVisit && accounts.length === 0 && !isLoading) {
        setShowOnboarding(true);
      }
      
      setOnboardingChecked(true);
    }
  }, [accounts.length, isLoading, onboardingChecked]);

  return (
    <>
      <RequireAuth>
        {/* Onboarding Overlay */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-background-light z-50 overflow-auto">
            <OnboardingFlow onComplete={() => {
              setShowOnboarding(false);
              localStorage.setItem('onboarding_completed', 'true');
              // Refresh data after onboarding
              fetchData();
            }} />
          </div>
        )}
        
        <div
          className={`min-h-screen bg-background-light transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64"
          }`}>
          {/* Header */}
          <header className="border-b border-border-light bg-background-light/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground-black">
                    Subscription Manager
                  </h1>
                  <p className="text-sm text-muted-light mt-1">
                    {accounts.length > 0
                      ? `Monitoring ${accounts.length} account${
                          accounts.length > 1 ? "s" : ""
                        } • ${subs.length} subscriptions found`
                      : "Connect your bank to discover and manage subscriptions"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {accounts.length > 0 && (
                    <>
                      <button
                        onClick={() => fetchData()}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-card-light border border-border-light rounded-lg text-foreground-black transition-colors hover:bg-card-hover-light hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        {isLoading ? "Refreshing..." : "Refresh"}
                      </button>

                      {/* Debug selector - only show in development */}
                      {process.env.NODE_ENV === "development" && (
                        <select
                          value={dataSource}
                          className="bg-card-light border border-border-light rounded-md px-3 py-1.5 text-foreground-black text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                          onChange={(e) => {
                            const newSource = e.target.value as DataSource;
                            setDataSource(newSource);
                            fetchData(newSource);
                          }}
                          disabled={isLoading}>
                          <option value="auto">Auto</option>
                          <option value="bankid">BankID</option>
                          <option value="plaid">Plaid</option>
                        </select>
                      )}
                    </>
                  )}

                  {/* Connection Status in Header */}
                  <div className="flex items-center gap-2">
                    {/* Connection Status Indicators */}
                    <div className="flex items-center gap-1 px-3 py-2 bg-card-light border border-border-light rounded-lg">
                      <div
                        className="flex items-center gap-1"
                        title="BankID Connection">
                        <span className="text-xs text-muted-light">BankID</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            bankidConnected === null
                              ? "bg-muted-light animate-pulse"
                              : bankidConnected
                              ? "bg-emerald-500"
                              : "bg-red-300"
                          }`}
                        />
                      </div>
                      <div className="w-px h-4 bg-border-light mx-1" />
                      <div
                        className="flex items-center gap-1"
                        title="Plaid Connection">
                        <span className="text-xs text-muted-light">Plaid</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            plaidConnected === null
                              ? "bg-muted-light animate-pulse"
                              : plaidConnected
                              ? "bg-emerald-500"
                              : "bg-red-300"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Connect/Manage Button */}
                    <button
                      onClick={() => setShowConnect(!showConnect)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cta-start to-cta-end text-on-primary-light rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm cursor-pointer z-90">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {accounts.length > 0 ? "Manage" : "Connect Bank"}
                    </button>

                    {/* Connect Bank Dropdown */}
                    {showConnect && (
                      <div className="w-[400px] absolute top-2 right-[-15px] animate-in slide-in-from-right-2 duration-300 ">
                        <ConnectBank />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Data Source Indicator */}
            <div className="mb-6 flex items-center justify-between p-3 bg-card-bg-start-light/50 border border-border-light rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-500"
                  }`}
                />
                <span className="text-sm text-muted-light">
                  {isLoading
                    ? "Loading data..."
                    : `Showing data from: ${
                        dataSource === "auto"
                          ? "Auto (BankID → Plaid)"
                          : dataSource === "bankid"
                          ? "BankID"
                          : "Plaid"
                      }`}
                </span>
              </div>
              <div className="text-xs text-muted-light">
                {accounts.length} accounts • {tx.length} transactions •{" "}
                {subs.length} subscriptions
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-light">
                      Connected Accounts
                    </p>
                    <p className="text-2xl font-semibold text-foreground-black mt-1">
                      {accounts.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-light">
                      Recent Transactions
                    </p>
                    <p className="text-2xl font-semibold text-foreground-black mt-1">
                      {tx.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-light">
                      Active Subscriptions
                    </p>
                    <p className="text-2xl font-semibold text-foreground-black mt-1">
                      {subs.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Usage Limits Overview */}
              <UsageLimitsChecker />

              {/* AI Insights Section */}
              {subs.length > 0 && (
                <section className="mb-8">
                  {console.log('[Dashboard] Passing subscriptions to AIInsights:', subs)}
                  <AIInsights subscriptions={subs} />
                </section>
              )}

              {/* Subscription Insights - Compound Effect */}
              {subs.length > 0 && (
                <section className="mb-8">
                  <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-2xl p-8 shadow-sm">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Financial Impact */}
                      <div>
                        <h3 className="text-xl font-semibold text-foreground-black mb-6 flex items-center gap-2">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                          Your Subscription Impact
                        </h3>

                        {(() => {
                          const monthlyTotal = subs.reduce((sum, sub) => {
                            const amount = sub.lastAmount || 0;
                            const multiplier =
                              sub.cadence === "Weekly"
                                ? 4.33
                                : sub.cadence === "Daily"
                                ? 30
                                : 1;
                            return sum + amount * multiplier;
                          }, 0);

                          const yearlyTotal = monthlyTotal * 12;
                          const fiveYearTotal = yearlyTotal * 5;

                          return (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-background-light/50 rounded-xl p-4 text-center">
                                  <p className="text-2xl font-bold text-foreground-black">
                                    {monthlyTotal.toLocaleString("sv-SE", {
                                      style: "currency",
                                      currency: "SEK",
                                    })}
                                  </p>
                                  <p className="text-sm text-muted-light">
                                    Monthly
                                  </p>
                                </div>
                                <div className="bg-background-light/50 rounded-xl p-4 text-center">
                                  <p className="text-2xl font-bold text-amber-600">
                                    {yearlyTotal.toLocaleString("sv-SE", {
                                      style: "currency",
                                      currency: "SEK",
                                    })}
                                  </p>
                                  <p className="text-sm text-muted-light">
                                    Yearly
                                  </p>
                                </div>
                              </div>

                              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg
                                    className="w-5 h-5 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                  </svg>
                                  <span className="font-semibold text-red-800">
                                    5-Year Impact
                                  </span>
                                </div>
                                <p className="text-2xl font-bold text-red-800">
                                  {fiveYearTotal.toLocaleString("sv-SE", {
                                    style: "currency",
                                    currency: "SEK",
                                  })}
                                </p>
                                <p className="text-sm text-red-600 mt-1">
                                  That&apos;s what you&apos;ll spend if you keep
                                  all current subscriptions
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Subscription Breakdown */}
                      <div>
                        <h3 className="text-xl font-semibold text-foreground-black mb-6 flex items-center gap-2">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Top Spending Categories
                        </h3>

                        <div className="space-y-3">
                          {(() => {
                            // Calculate monthly amounts and sort by highest
                            const subsWithMonthly = subs
                              .map((sub) => ({
                                ...sub,
                                monthlyAmount:
                                  (sub.lastAmount || 0) *
                                  (sub.cadence === "Weekly"
                                    ? 4.33
                                    : sub.cadence === "Daily"
                                    ? 30
                                    : 1),
                              }))
                              .sort(
                                (a, b) => b.monthlyAmount - a.monthlyAmount
                              );

                            const totalMonthly = subsWithMonthly.reduce(
                              (sum, sub) => sum + sub.monthlyAmount,
                              0
                            );

                            return subsWithMonthly.slice(0, 5).map((sub, i) => {
                              const percentage =
                                (sub.monthlyAmount / totalMonthly) * 100;
                              return (
                                <div
                                  key={i}
                                  className="flex items-center justify-between py-2">
                                  <div className="flex items-center gap-3 flex-1">
                                    <span className="text-lg">
                                      {sub.provider_emoji || "💳"}
                                    </span>
                                    <div className="flex-1">
                                      <p className="font-medium text-foreground-black text-sm">
                                        {sub.name}
                                      </p>
                                      <div className="w-full bg-background-light/50 rounded-full h-2 mt-1">
                                        <div
                                          className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-500"
                                          style={{
                                            width: `${percentage}%`,
                                          }}></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="font-semibold text-foreground-black text-sm">
                                      {sub.monthlyAmount.toLocaleString(
                                        "sv-SE",
                                        { style: "currency", currency: "SEK" }
                                      )}
                                    </p>
                                    <p className="text-xs text-muted-light">
                                      {percentage.toFixed(0)}%
                                    </p>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>

                        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm font-medium text-primary">
                              Savings Opportunity
                            </span>
                          </div>
                          <p className="text-sm text-muted-light">
                            Cancel just 2-3 unused subscriptions and save{" "}
                            {(() => {
                              const sortedSubs = subs
                                .map((sub) => ({
                                  ...sub,
                                  monthlyAmount:
                                    (sub.lastAmount || 0) *
                                    (sub.cadence === "Weekly"
                                      ? 4.33
                                      : sub.cadence === "Daily"
                                      ? 30
                                      : 1),
                                }))
                                .sort(
                                  (a, b) => b.monthlyAmount - a.monthlyAmount
                                );

                              const potentialSavings = sortedSubs
                                .slice(0, 3)
                                .reduce(
                                  (sum, sub) => sum + sub.monthlyAmount,
                                  0
                                );
                              return `${(potentialSavings * 12).toLocaleString(
                                "sv-SE",
                                { style: "currency", currency: "SEK" }
                              )} per year`;
                            })()}
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Subscriptions Section - Priority Content */}
              {subs.length > 0 && (
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground-black">
                        Your Subscriptions
                      </h2>
                      <p className="text-sm text-muted-light mt-1">
                        {(() => {
                          const totalMonthly = subs.reduce((sum, sub) => {
                            const amount = sub.lastAmount || 0;
                            // Convert to monthly estimate based on cadence
                            const multiplier =
                              sub.cadence === "Weekly"
                                ? 4.33
                                : sub.cadence === "Daily"
                                ? 30
                                : 1;
                            return sum + amount * multiplier;
                          }, 0);
                          return `${totalMonthly.toLocaleString("sv-SE", {
                            style: "currency",
                            currency: "SEK",
                          })} estimated monthly spend`;
                        })()}
                      </p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80 font-medium">
                      View All Insights
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {subs.map((sub: Subscription, i: number) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
                        {/* Subscription Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-lg">
                                {sub.provider_emoji || "💳"}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground-black group-hover:text-primary transition-colors">
                                {sub.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-light">
                                  {sub.cadence}
                                </span>
                                <span className="w-1 h-1 bg-muted-light rounded-full"></span>
                                <span className="text-sm text-muted-light">
                                  {sub.confidence &&
                                    `${Math.round(
                                      sub.confidence * 100
                                    )}% confidence`}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground-black">
                              {(() => {
                                const amount = sub.lastAmount || 0;
                                return `${amount.toLocaleString("sv-SE", {
                                  style: "currency",
                                  currency: "SEK",
                                })}`;
                              })()}
                            </p>
                            <p className="text-xs text-muted-light">
                              Last:{" "}
                              {sub.lastDate &&
                                new Date(sub.lastDate).toLocaleDateString(
                                  "sv-SE"
                                )}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-4 border-t border-border-light">
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors text-sm">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Cancel
                          </button>

                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-card-light hover:bg-card-hover-light text-foreground-black rounded-lg font-medium transition-colors text-sm border border-border-light">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Details
                          </button>

                          {sub.cancel_url && (
                            <button className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Accounts Section */}
              {accounts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground-black">
                      Bank Accounts
                    </h2>
                    <button
                      onClick={() => setShowRawAccounts(!showRawAccounts)}
                      className="text-sm text-muted-light hover:text-foreground-black transition-colors">
                      {showRawAccounts ? "Hide Details" : "Show Details"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {accounts.map((account: Account, i: number) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-foreground-black">
                              {account.name ||
                                account.official_name ||
                                "Account"}
                            </h3>
                            <p className="text-sm text-muted-light">
                              {account.subtype || account.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-foreground-black">
                              {(() => {
                                const balance = calculateBalance(account);
                                const currency =
                                  account.balances?.available?.amount
                                    ?.currencyCode || "SEK";
                                return `${balance.toLocaleString("sv-SE", {
                                  style: "currency",
                                  currency: currency,
                                })}`;
                              })()}
                            </p>
                            <p className="text-xs text-muted-light">
                              Available
                            </p>
                          </div>
                        </div>

                        {showRawAccounts && (
                          <div className="mt-4 pt-4 border-t border-border-light">
                            <pre className="text-xs text-muted-light bg-background-light-mid/50 rounded p-3 overflow-auto">
                              {JSON.stringify(account, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Transactions Section */}
              {tx.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground-black">
                      Recent Transactions
                    </h2>
                    <button
                      onClick={() =>
                        setShowRawTransactions(!showRawTransactions)
                      }
                      className="text-sm text-muted-light hover:text-foreground-black transition-colors">
                      {showRawTransactions ? "Hide Details" : "Show Details"}
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-lg overflow-hidden shadow-sm">
                    <div className="max-h-96 overflow-y-auto">
                      {tx
                        .slice(0, 10)
                        .map((transaction: Transaction, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 border-b border-border-light last:border-b-0">
                            <div className="flex-1">
                              <p className="font-medium text-foreground-black">
                                {transaction.name || transaction.description}
                              </p>
                              <p className="text-sm text-muted-light">
                                {transaction.date}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-semibold ${
                                  transaction.amount > 0
                                    ? "text-red-500"
                                    : "text-emerald-500"
                                }`}>
                                {transaction.amount > 0 ? "-" : "+"}$
                                {Math.abs(transaction.amount).toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-light">
                                {transaction.account_id}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {showRawTransactions && (
                      <div className="p-4 border-t border-border-light bg-background-light-mid/30">
                        <pre className="text-xs text-muted-light overflow-auto max-h-64">
                          {JSON.stringify(tx.slice(0, 5), null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Empty State - Enhanced Onboarding */}
              {accounts.length === 0 && tx.length === 0 && (
                <div className="max-w-4xl mx-auto">
                  {/* Hero Section */}
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground-black mb-4">
                      Discover Hidden Subscriptions
                    </h2>
                    <p className="text-lg text-muted-light mb-8 max-w-2xl mx-auto">
                      Connect your bank account to automatically detect
                      recurring subscriptions and take control of your spending.
                    </p>

                    {/* Connection Options */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                      <button className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cta-start to-cta-end text-on-primary-light rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Connect with BankID
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      </button>

                      <button className="flex items-center justify-center gap-3 px-8 py-4 bg-card-light border-2 border-border-light text-foreground-black rounded-xl font-semibold hover:bg-card-hover-light hover:border-primary/30 transition-all">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Connect with Plaid
                      </button>
                    </div>
                  </div>

                  {/* Benefits Grid */}
                  <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground-black mb-2">
                        Auto-Detection
                      </h3>
                      <p className="text-muted-light">
                        Our AI scans your transactions to find recurring
                        subscriptions you might have forgotten.
                      </p>
                    </div>

                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground-black mb-2">
                        Bank-Level Security
                      </h3>
                      <p className="text-muted-light">
                        Your financial data is protected with 256-bit encryption
                        and never stored permanently.
                      </p>
                    </div>

                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground-black mb-2">
                        Easy Cancellation
                      </h3>
                      <p className="text-muted-light">
                        Get direct cancellation links and guidance to stop
                        unwanted subscriptions instantly.
                      </p>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-2xl p-8 text-center">
                    <div className="flex items-center justify-center gap-8 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-light">
                        <svg
                          className="w-4 h-4 text-emerald-500"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>GDPR Compliant</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-light">
                        <svg
                          className="w-4 h-4 text-emerald-500"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>PSD2 Certified</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-light">
                        <svg
                          className="w-4 h-4 text-emerald-500"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Read-Only Access</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-light">
                      Trusted by thousands of users to manage their
                      subscriptions securely
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
        <SidebarNav />
      </RequireAuth>
    </>
  );
}

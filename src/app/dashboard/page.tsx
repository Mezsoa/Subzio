"use client";
import { useEffect, useState, useCallback } from "react";
import { authedFetch, AuthError } from "@/lib/authedFetch";
import RequireAuth from "@/components/auth/RequireAuth";
import SidebarNav from "@/components/SidebarNav";
import { useSidebar } from "@/contexts/SidebarContext";

interface Account {
  name?: string;
  official_name?: string;
  type?: string;
  subtype?: string;
  balances?: {
    current?: number;
    available?: number;
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
  frequency?: string;
  amount: number;
}

type DataSource = "auto" | "bankid" | "plaid";

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showRawAccounts, setShowRawAccounts] = useState<boolean>(false);
  const [showRawTransactions, setShowRawTransactions] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataSource>("auto");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isCollapsed } = useSidebar();

  const fetchData = useCallback(async (source: DataSource = dataSource) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`[Dashboard] Fetching data from: ${source}`);
      
      let accountsData: Account[] = [];
      let transactionsData: Transaction[] = [];
      
      if (source === "auto") {
        // Try BankID first; fall back to Plaid
        const ar = await authedFetch("/api/bankid/accounts").catch(() => new Response(null, { status: 500 }));
        if (ar && ar.ok) {
          const data = await ar.json();
          console.log("[Dashboard] BankID accounts:", data);
          accountsData = data.accounts || [];
          
          const tr = await authedFetch("/api/bankid/transactions").catch(() => new Response(null, { status: 500 }));
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
          console.log("[Dashboard] BankID accounts failed:", ar.status, await ar.text());
        }
        
        const tr = await authedFetch("/api/bankid/transactions");
        if (tr.ok) {
          const txData = await tr.json();
          console.log("[Dashboard] BankID transactions:", txData);
          transactionsData = txData.transactions || [];
        } else {
          console.log("[Dashboard] BankID transactions failed:", tr.status, await tr.text());
        }
      } else if (source === "plaid") {
        // Plaid only
        const pr = await authedFetch("/api/plaid/accounts");
        if (pr.ok) {
          const data = await pr.json();
          console.log("[Dashboard] Plaid accounts:", data);
          accountsData = data.accounts || [];
        } else {
          console.log("[Dashboard] Plaid accounts failed:", pr.status, await pr.text());
        }
        
        const prt = await authedFetch("/api/plaid/transactions");
        if (prt.ok) {
          const txData = await prt.json();
          console.log("[Dashboard] Plaid transactions:", txData);
          transactionsData = txData.transactions || [];
        } else {
          console.log("[Dashboard] Plaid transactions failed:", prt.status, await prt.text());
        }
      }
      
      setAccounts(accountsData);
      setTx(transactionsData);
      
      // Always fetch subscriptions (they're provider-agnostic)
      const sr = await authedFetch("/api/subscriptions/detect");
      setSubs(sr.ok ? (await sr.json()).subscriptions : []);
      
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
  }, [dataSource]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <RequireAuth>
        <div className={`min-h-screen bg-background-light transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {/* Header */}
          <header className="border-b border-border-light bg-background-light/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground-black">Dashboard</h1>
                  <p className="text-sm text-muted-light mt-1">Manage your financial connections and subscriptions</p>
                </div>
                
                {/* Data Source Selector */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-light">
                    <span>Data source:</span>
                    <select 
                      value={dataSource}
                      className="bg-card-light border border-border-light rounded-md px-3 py-1.5 text-foreground-black text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 hover:bg-card-hover-light hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      onChange={(e) => {
                        const newSource = e.target.value as DataSource;
                        setDataSource(newSource);
                        fetchData(newSource);
                      }}
                      disabled={isLoading}
                    >
                      <option value="auto">Auto (BankID → Plaid)</option>
                      <option value="bankid">BankID Only</option>
                      <option value="plaid">Plaid Only</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => fetchData()}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm bg-card-light border border-border-light rounded-md text-foreground-black transition-colors hover:bg-card-hover-light hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Loading..." : "Refresh Data"}
                  </button>
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
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-sm text-muted-light">
                  {isLoading ? "Loading data..." : `Showing data from: ${dataSource === 'auto' ? 'Auto (BankID → Plaid)' : dataSource === 'bankid' ? 'BankID' : 'Plaid'}`}
                </span>
              </div>
              <div className="text-xs text-muted-light">
                {accounts.length} accounts • {tx.length} transactions • {subs.length} subscriptions
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-light">Connected Accounts</p>
                    <p className="text-2xl font-semibold text-foreground-black mt-1">{accounts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-light">Recent Transactions</p>
                    <p className="text-2xl font-semibold text-foreground-black mt-1">{tx.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-light">Active Subscriptions</p>
                    <p className="text-2xl font-semibold text-foreground-black mt-1">{subs.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Accounts Section */}
              {accounts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground-black">Bank Accounts</h2>
                    <button
                      onClick={() => setShowRawAccounts(!showRawAccounts)}
                      className="text-sm text-muted-light hover:text-foreground-black transition-colors"
                    >
                      {showRawAccounts ? "Hide Details" : "Show Details"}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {accounts.map((account: Account, i: number) => (
                      <div key={i} className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-foreground-black">{account.name || account.official_name || "Account"}</h3>
                            <p className="text-sm text-muted-light">{account.subtype || account.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-foreground-black">
                              ${(account.balances?.current || account.balances?.available || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-light">Available</p>
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
                    <h2 className="text-lg font-semibold text-foreground-black">Recent Transactions</h2>
                    <button
                      onClick={() => setShowRawTransactions(!showRawTransactions)}
                      className="text-sm text-muted-light hover:text-foreground-black transition-colors"
                    >
                      {showRawTransactions ? "Hide Details" : "Show Details"}
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-lg overflow-hidden shadow-sm">
                    <div className="max-h-96 overflow-y-auto">
                      {tx.slice(0, 10).map((transaction: Transaction, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-border-light last:border-b-0">
                          <div className="flex-1">
                            <p className="font-medium text-foreground-black">{transaction.name || transaction.description}</p>
                            <p className="text-sm text-muted-light">{transaction.date}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${transaction.amount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                              {transaction.amount > 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-light">{transaction.account_id}</p>
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

              {/* Subscriptions Section */}
              {subs.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground-black">Detected Subscriptions</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subs.map((sub: Subscription, i: number) => (
                      <div key={i} className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground-black">{sub.name}</h3>
                            <p className="text-sm text-muted-light">{sub.frequency}</p>
                          </div>
                          <p className="text-lg font-semibold text-foreground-black">${sub.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty State */}
              {accounts.length === 0 && tx.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground-black mb-2">No bank connections found</h3>
                  <p className="text-muted-light mb-6">Connect your bank account to start tracking your subscriptions and transactions.</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-cta-start to-cta-end text-on-primary-light rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm">
                    Connect Your Bank
                  </button>
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
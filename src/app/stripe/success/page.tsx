"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function StripeSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Half - Success Container */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
        {/* Simple pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="max-w-lg w-full mx-12 relative z-10">
          {/* Success Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100">
              <svg
                className="w-12 h-12 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Connection Successful
            </h1>
            
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Your Stripe account has been securely connected to KillSub. 
              You can now access your financial data and manage subscriptions.
            </p>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 mb-8 border border-slate-200">
              <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">
                Redirecting to Dashboard
              </p>
              <div className="text-5xl font-bold text-slate-900 mb-4">
                {countdown}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}></div>
              </div>
            </div>

            {/* Manual redirect button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 px-8 rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all duration-200 transform hover:scale-[1.02] font-semibold text-lg shadow-lg hover:shadow-xl">
              Continue to Dashboard
            </button>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm font-medium text-emerald-800">
                  Bank-grade security • 256-bit encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half - Professional Image */}
      <div className="w-1/2 relative overflow-hidden">
        <Image
          src="/connection/handLock.webp"
          alt="Secure Financial Connection"
          fill
          className="object-cover"
          priority
        />
        {/* Subtle overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/20 to-transparent"></div>
        
        {/* Professional branding overlay */}
        <div className="absolute bottom-8 right-8 text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-2">KillSub</h3>
            <p className="text-white/80 text-sm">Financial Intelligence Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}
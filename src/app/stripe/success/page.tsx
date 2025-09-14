"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StripeSuccessPage() {
    const router = useRouter();
    const [ countdown, setCountdown ] = useState(4);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) =>{
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push("/dashboard");
                    return 0;
                }
                return prev -1;
            });
        }, 1000);

        
        return () => clearInterval(interval);
    }, [router]);

    return (
        <section className="min-h-screen flex items-center justify-center">
             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform animate-in fade-in-0 zoom-in-95 duration-500">
        {/* Success Icon with Animation */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg 
            className="w-10 h-10 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Success!
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Your Stripe account has been successfully connected to KillSub. 
          You can now view your Stripe transactions and subscriptions.
        </p>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-3">
            Redirecting to dashboard in:
          </p>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            {countdown}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Manual redirect button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 font-medium"
        >
          Go to Dashboard Now
        </button>

        {/* Additional Info */}
        <p className="text-xs text-gray-400 mt-4">
          You can now manage your subscriptions and view your financial data
        </p>
      </div>
    </div>
        </section>
    )
}
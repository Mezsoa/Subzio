"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StripeSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/dashboard");
    }, [router]);

        

    return (
        <section className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Stripe Success</h1>
                <p className="text-lg">Your Stripe account has been connected successfully.</p>
            </div>
        </section>
    )
}
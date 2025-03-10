"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function UserStatus() {
  const { isLoaded, user } = useUser();
  const [verificationStatus, setVerificationStatus] = useState<"approved" | "pending" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/seller-status");
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        setVerificationStatus(data.isApproved ? "approved" : "pending");
      } catch (error) {
        console.error("Error fetching seller status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchStatus();
    }
  }, [isLoaded, user]);

//   console.log("User:", user);

  if (!user) {
    return (
      <Link
        href={`${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}`}
        className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold rounded-lg hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl"
      >
        Start Selling
        <ArrowRight className="ml-2 h-6 w-6" />
      </Link>
    );
  }

  
if (isLoading) {
  return <div className="animate-pulse">Loading...</div>;
}

  if (verificationStatus === "pending") {
    return (
      <div className="text-lg font-semibold text-gray-600 animate-pulse">
        Your account is pending verification. Please wait for approval.
      </div>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold rounded-lg hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl"
    >
      Seller Dashboard
      <ArrowRight className="ml-2 h-6 w-6" />
    </Link>
  );
}

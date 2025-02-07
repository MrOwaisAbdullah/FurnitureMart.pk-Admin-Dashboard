"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function UserStatus() {
  const { user } = useUser();
  const verificationStatus = user?.publicMetadata?.verificationStatus;

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

  if (verificationStatus === "pending") {
    return (
      <div className="text-lg font-semibold text-gray-600 bg-gray-100 px-6 py-3 rounded-md">
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

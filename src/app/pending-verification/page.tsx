import { client } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PendingVerificationPage() {

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in"); // Redirect to sign-in if the user is not authenticated
  }

  // Fetch seller verification status
  const seller = await client.fetch(`*[_type == "seller" && clerkId == $userId][0]`, { userId });

  if (!seller) {
    redirect("/"); // Redirect home if seller record is missing
  }

  if (seller.isApproved) {
    redirect("/dashboard"); // Redirect to dashboard if approved
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Pending Verification</h1>
      <p className="text-gray-600 mb-8">
        Your account is under review. Please wait for admin approval.
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
      >
        Return to Home
      </Link>
    </div>
  );
}
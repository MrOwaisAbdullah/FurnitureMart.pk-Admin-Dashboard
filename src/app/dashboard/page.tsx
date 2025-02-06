import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import SellerDashboard from "@/components/Dashboard/SellerDashboard";


export const metadata: Metadata = {
  title:
    "Furniture Mart E-commerce Dashboard",
  description: "This is Furniture Mart Dashboard",
};


export default async function Home() {
  const { userId } = await auth();


  // If the user is not signed in, redirect to the sign-in page
  if (!userId) {
    redirect("https://fast-foal-29.accounts.dev/sign-in");
  }

  // Fetch seller data from Sanity
  const seller = await client.fetch(
    `*[_type == "seller" && clerkId == $userId][0]`,
    { userId }
  );

  // If seller is not found or not approved, redirect to pending verification
  if (!seller || !seller.isApproved) {
    redirect("/pending-verification");
  }
  
  return (
    <>
      <DefaultLayout>
        <SellerDashboard />
      </DefaultLayout>
    </>
  );
}

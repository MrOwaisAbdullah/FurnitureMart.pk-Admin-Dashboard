"use client"; // Mark this as a client component
import { useQuery } from "@tanstack/react-query";
import { client } from "@/sanity/lib/client";
import { useAuth } from "@clerk/nextjs";

export function useSeller() {
  const { userId, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["seller", userId], // Unique key for caching
    queryFn: async () => {
      if (!isSignedIn || !userId) {
        return null; // Return null if the user is not signed in
      }

      const seller = await client.fetch(
        `*[_type == "seller" && clerkId == $clerkId][0] {
          _id,
          ownerName,
          shopName,
          email,
          phone,
          address,
          businessType,
          isApproved,
          "logoUrl": logo.asset->url
        }`,
        { clerkId: userId }
      );
      return seller;
    },
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch data when the window regains focus
    enabled: !!isSignedIn && !!userId, // Only fetch data if the user is signed in
  });
}
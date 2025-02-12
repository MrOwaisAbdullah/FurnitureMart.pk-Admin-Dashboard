"use client";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Import useRouter
import { LogOut } from "lucide-react"; // Import Lucide icon
// import { useNotifications } from "@/context/NotificationContext"; // Import your notification context
import { useEffect } from "react"; // Import useEffect
import { useQueryClient } from "@tanstack/react-query";

const LogoutButton = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter(); // Initialize router
  const queryClient = useQueryClient(); // Initialize query client
  // const { addNotification } = useNotifications();  // Initialize notification context

  // Handle the user signing out
  useEffect(() => {
    if (!isSignedIn) {
      // addNotification("You have been logged out successfully.", "success"); 
      queryClient.clear(); // Clear the query cache
      router.push("/"); // Redirect to the home page
    }
  }, [isSignedIn, queryClient, router]);

  if (!isSignedIn) {
    return (
      <p className="flex items-center justify-center px-5 py-2 text-center">
        You are not signed in.
      </p>
    );
  }

  return (
    <SignOutButton redirectUrl="/">
      <button
        className={`group relative flex w-full items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
      >
        <LogOut className="h-5 w-5" />
        Log Out
      </button>
    </SignOutButton>
  );
};

export default LogoutButton;
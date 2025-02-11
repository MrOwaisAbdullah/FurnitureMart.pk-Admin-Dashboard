"use client";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Import useRouter
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react"; // Import Lucide icon
import { useNotifications } from "@/context/NotificationContext"; // Import your notification context
import { useEffect } from "react"; // Import useEffect

const LogoutButton = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter(); // Initialize router
  const { addNotification } = useNotifications(); // Initialize notification context

  // Handle the user signing out
  useEffect(() => {
    if (!isSignedIn) {
      addNotification("You have been logged out successfully.", "success"); // Show success toast
      router.push("/"); // Redirect to the home page
    }
  }, [isSignedIn, addNotification, router]);

  if (!isSignedIn) {
    return (
      <p className="flex items-center justify-center px-5 py-2 text-center">
        You are not signed in.
      </p>
    );
  }

  return (
    <SignOutButton redirectUrl="/"> {/* Redirect to home page after sign-out */}
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
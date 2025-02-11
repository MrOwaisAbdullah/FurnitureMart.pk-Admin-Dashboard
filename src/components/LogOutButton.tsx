"use client";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Import useRouter
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react"; // Import Lucide icon
import { useNotifications } from "@/context/NotificationContext"; // Import your notification context

const LogoutButton = () => {
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter(); // Initialize router
  const { addNotification } = useNotifications(); // Initialize notification context

  if (!isSignedIn) {
    return <p className="text-center flex items-center justify-center px-5 py-2">You are not signed in.</p>;
  }

  return (
    <SignOutButton
      redirectUrl="/" // Redirect to home page after sign-out
    >
      <button
        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 w-full`}
        onClick={() => {
          queryClient.clear(); // Clear the query cache
          addNotification("You have been logged out successfully.", "success"); // Show success toast
        }}
      >
        <LogOut className="h-5 w-5" /> 
        Log Out
      </button>
    </SignOutButton>
  );
};

export default LogoutButton;
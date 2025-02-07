"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { ClerkProvider } from "@clerk/nextjs";
import { NotificationsProvider } from "@/context/NotificationContext";
import { ToastContainer } from "@/components/ToastNotification/Toast";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <ClerkProvider>
    <Providers>
    <NotificationsProvider>
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark min-w-screen min-h-screen">
          {loading ? <Loader /> : children}
        </div>
      </body>
      <ToastContainer />
    </html>
    </NotificationsProvider>
    </Providers>
    </ClerkProvider>
  );
}

// app/(auth)/sign-up/page.tsx
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
};

const SignUpPage = () => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <h1 className="text-3xl font-extrabold text-primary dark:text-white">
                FurnitureMart.pk
              </h1>

              <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                suspendisse.
              </p>

              <span className="mt-15 inline-block">
                <svg
                  width="350"
                  height="350"
                  viewBox="0 0 350 350"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG Paths */}
                </svg>
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign Up to TailAdmin
              </h2>

              {/* Clerk's SignUp component */}
              <SignUp
                  routing="path" // Use path-based routing
                  path="/auth/sign-up" // Specify the sign-up path
                  fallbackRedirectUrl="/pending-verification" // Redirect here after sign-up
                  forceRedirectUrl="/pending-verification" // Force redirect URL after sign-up
                  appearance={{
                  elements: {
                    formButtonPrimary:
                      "w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90",
                    formFieldInput:
                      "w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
                    footerActionLink: "text-primary hover:text-primary-dark",
                  },
                }}
                unsafeMetadata={{
                  businessType: "",
                  address: "",
                  phone: ""
                }}
                                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;

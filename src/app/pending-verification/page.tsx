import Link from "next/link";

export default function PendingVerificationPage() {
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
// import { client } from "@/sanity/lib/client";
// import { StaticImport } from "next/dist/shared/lib/get-img-props";
// import Image from "next/image";

export default async function ApprovalsPage() {
  // const pendingSellers = await client.fetch(`
  //   *[_type == "seller" && isApproved == false] {
  //     _id,
  //     name,
  //     email,
  //     phone,
  //     address,
  //     businessType,
  //     "logoUrl": logo.asset->url
  //   }
  // `);

  // const approveSeller = async (sellerId: string) => {
  //   await client.patch(sellerId).set({ isApproved: true }).commit();
  // };

  return (
    <div className="p-6">
      {/* <h1 className="mb-6 text-2xl font-bold">Pending Approvals</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {pendingSellers.map(
          (seller: {
            _id: string;
            logoUrl: string | StaticImport;
            name: string;
            email: string;
            address: string;
            businessType: string;
          }) => (
            <div
              key={seller._id}
              className="rounded-lg bg-white p-4 shadow dark:bg-boxdark"
            >
              {seller.logoUrl && (
                <Image
                  src={seller.logoUrl}
                  alt="Shop Logo"
                  className="mb-4 h-20 w-20 rounded-full"
                />
              )}
              <h3 className="text-lg font-semibold">{seller.name}</h3>
              <p className="text-gray-600">{seller.email}</p>
              <p className="mt-2 text-sm">{seller.address}</p>
              <p className="text-sm">Business Type: {seller.businessType}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => approveSeller(seller._id)}
                  className="rounded bg-green-500 px-4 py-2 text-white"
                >
                  Approve
                </button>
                <button className="rounded bg-red-500 px-4 py-2 text-white">
                  Reject
                </button>
              </div>
            </div>
          ),
        )}
      </div> */}
    </div>
  );
}

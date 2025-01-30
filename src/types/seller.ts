export interface Seller {
  _id?: string;
  shopName?: string;
  clerkId?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  businessType?: "showroom" | "workshop" | "both";
  isApproved?: boolean;
  logoUrl?: string; 
}
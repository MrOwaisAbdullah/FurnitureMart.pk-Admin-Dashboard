interface Order {
  _id: string; // Sanity document ID
  orderId: string; // Unique order ID
  customer?: {
    name: string;
  };
  seller?: {
    shopName: string;
  };
  products: Array<{
    product: {
      title: string;
      price: number;
      slug: {
        current: string;
      };
      _id: string;
    };
    quantity: number;
  }>;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  _createdAt: string; // ISO date string
}
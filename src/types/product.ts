import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  price: number;
  priceWithoutDiscount?: number;
  isDiscounted: boolean;
  image: string;
  imageGallery?: string[];
  category: {
    _id: string;
    title: string;
  };
  inventory: number;
  tags?: string[];
  isNew: boolean;
  seller: {
    _id: string;
    name: string;
  };
}

export interface StoreCategory {
  id: string;
  label: string;
}

export interface ToyProduct {
  id: string;
  categoryId: string;
  title: string;
  ageRange: string;
  originalPrice: number;
  discountPrice: number;
  rating: number;
  reviewCount: number;
  badge: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface ToyStoreData {
  sectionTitle: string;
  sectionSubtitle: string;
  categories: StoreCategory[];
  products: ToyProduct[];
}
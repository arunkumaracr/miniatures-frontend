
export interface StoreCategory {
  id: string;
  label: string;
}

export interface ToyProduct {
  id: string;
  categoryId: string;
  title: string;
  ageRange: string;
  badge: string;
  originalPrice: number;
  discountPrice: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isAvailable: boolean;
  isTopSelling?: boolean;
}

export interface ToyStoreData {
  sectionTitle: string;
  sectionSubtitle: string;
  categories: StoreCategory[];
  products: ToyProduct[];
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = "cod" | "card" | "upi" | "razorpay";

export interface Order {
  id?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  total: number;
  status?: string;
  createdAt?: string;
}
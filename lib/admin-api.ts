// lib/admin-api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "supersecret123";

const headers = {
  "Content-Type": "application/json",
  "x-admin-key": ADMIN_KEY,
};

// ─── CATEGORIES ───────────────────────────────
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/api/categories`);
  return res.json();
}

export async function createCategory(data: {
  id: string;
  slug: string;
  label: string;
  icon: string;
}) {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategory(
  id: string,
  data: { slug?: string; label?: string; icon?: string }
) {
  const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: "DELETE",
    headers,
  });
  return res.json();
}

// ─── PRODUCTS ─────────────────────────────────
export async function getProducts() {
  const res = await fetch(`${BASE_URL}/api/products`);
  return res.json();
}

export async function createProduct(data: {
  title: string;
  categoryId: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  isAvailable?: boolean;
  isTopSelling?: boolean;
}) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(
  id: string,
  data: Partial<{
    title: string;
    categoryId: string;
    originalPrice: number;
    discountPrice: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    isAvailable: boolean;
    isTopSelling: boolean;
  }>
) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers,
  });
  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: {
      "x-admin-key": ADMIN_KEY,
      // Don't set Content-Type — browser sets it with boundary automatically
    },
    body: formData,
  });

  const data = await res.json();
  if (!data.imageUrl) throw new Error("Upload failed");
  return data.imageUrl;
}
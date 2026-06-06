// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchProducts(categoryId?: string) {
  const url = categoryId && categoryId !== "all"
    ? `${BASE_URL}/api/products?categoryId=${categoryId}`
    : `${BASE_URL}/api/products`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  return res.json();
}

export async function fetchTopSelling() {
  const res = await fetch(`${BASE_URL}/api/products/top-selling`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function fetchProduct(id: string) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    next: { revalidate: 60 },
  });
  return res.json();
}
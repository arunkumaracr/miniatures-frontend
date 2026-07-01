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

// ─── ORDERS ───────────────────────────────────
async function safeJson(res: Response) {
  if (!res.ok) return {};
  const text = await res.text();
  try { return JSON.parse(text); } catch { return {}; }
}

export async function getOrders() {
  const res = await fetch(`${BASE_URL}/api/orders`, { headers });
  return safeJson(res);
}

export async function getOrder(id: string) {
  const res = await fetch(`${BASE_URL}/api/orders/${id}`, { headers });
  return safeJson(res);
}

export async function updateOrderStatus(id: string, status: string) {
  const res = await fetch(`${BASE_URL}/api/orders/${id}/status`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status }),
  });
  return safeJson(res);
}

// ─── NEW LAUNCHES ─────────────────────────────
export async function getNewLaunches() {
  const res = await fetch(`${BASE_URL}/api/new-launches`);
  return res.json();
}

export async function createNewLaunch(data: { title: string; videoUrl: string; thumbnailUrl?: string }) {
  const res = await fetch(`${BASE_URL}/api/new-launches`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteNewLaunch(id: string) {
  const res = await fetch(`${BASE_URL}/api/new-launches/${id}`, {
    method: "DELETE",
    headers,
  });
  return res.json();
}

// ─── VIDEO UPLOAD ─────────────────────────────
export function uploadVideo(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("video", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/api/upload/video`);
    xhr.setRequestHeader("x-admin-key", ADMIN_KEY);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (!data.videoUrl) reject(new Error(data.error || "Video upload failed"));
          else resolve(data.videoUrl);
        } catch {
          reject(new Error("Invalid server response"));
        }
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error — check your connection"));
    xhr.ontimeout = () => reject(new Error("Upload timed out — try a smaller file"));
    xhr.timeout = 5 * 60 * 1000; // 5 min timeout
    xhr.send(formData);
  });
}

// ─── IMAGE UPLOAD ─────────────────────────────
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
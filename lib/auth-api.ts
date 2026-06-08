const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return {}; }
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return safeJson(res);
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return safeJson(res);
}

export async function getMyOrders(token: string) {
  const res = await fetch(`${BASE_URL}/api/orders/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { orders: [], error: `${res.status}` };
  const data = await safeJson(res);
  // Handle { orders: [] }, { data: [] }, or a raw array
  const list = Array.isArray(data) ? data : data.orders ?? data.data ?? [];
  return { orders: list };
}

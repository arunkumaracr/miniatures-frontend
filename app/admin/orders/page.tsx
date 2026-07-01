"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/lib/admin-api";
import { Eye, X, MapPin, CreditCard, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  productId: string | null;
  quantity: number;
  price: number;
  title?: string;
  imageUrl?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  paymentMethod?: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount?: number;
}

const STATUS_TABS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  processing: "bg-blue-50 text-blue-600 border-blue-100",
  shipped: "bg-purple-50 text-purple-600 border-purple-100",
  delivered: "bg-green-50 text-green-600 border-green-100",
  cancelled: "bg-red-50 text-red-500 border-red-100",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "text-xs font-bold px-2.5 py-1 rounded-full border capitalize",
        STATUS_STYLES[status] ?? "bg-slate-50 text-slate-500 border-slate-100"
      )}
    >
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [filterTab, setFilterTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await getOrders();
      if (data.orders) {
        setOrders(data.orders);
      } else {
        setApiError(true);
      }
    } catch {
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, status);
    setUpdatingId(null);
    // Update local state immediately so UI reflects the change
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status } : prev);
    }
  }

  const filtered =
    filterTab === "all" ? orders : orders.filter((o) => o.status === filterTab);

  const counts = STATUS_TABS.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.id] =
      tab.id === "all"
        ? orders.length
        : orders.filter((o) => o.status === tab.id).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">
            {orders.length} total ·{" "}
            {orders.filter((o) => o.status === "pending").length} pending
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={cn(
              "whitespace-nowrap px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5",
              filterTab === tab.id
                ? "bg-brand-500 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span
                className={cn(
                  "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                  filterTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading orders...</p>
      ) : apiError ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center space-y-1">
          <p className="text-sm font-black text-amber-800">Backend orders endpoint not found</p>
          <p className="text-xs text-amber-600 font-medium">
            Make sure <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">GET /api/orders</code> is implemented on your backend and the server is running.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      #{String(order.id).slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-slate-800">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                    {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-black text-slate-800 text-sm">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-slate-500 capitalize">
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : (order.paymentMethod || "—")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-brand-400 cursor-pointer disabled:opacity-40"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No orders found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Order #{String(selectedOrder.id).slice(-8).toUpperCase()}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedOrder.status} />
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Status Update */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                  Update Status:
                </span>
                <select
                  value={selectedOrder.status}
                  disabled={updatingId === selectedOrder.id}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="text-sm font-bold border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-brand-400 cursor-pointer disabled:opacity-40"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                {updatingId === selectedOrder.id && (
                  <span className="text-xs text-slate-400">Saving...</span>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package size={13} /> Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      {item.imageUrl ? (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.title ?? item.productId ?? ""}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <Package size={16} className="text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">
                          {item.title ?? item.productId ?? "Deleted Product"}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <span className="text-sm font-black text-slate-900 flex-shrink-0">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                {selectedOrder.totalAmount != null && (
                  <div className="mt-4 border-t border-slate-100 pt-4 flex justify-between text-sm font-black text-slate-900">
                    <span>Total</span>
                    <span className="text-brand-600">₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Customer & Address */}
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin size={13} /> Customer & Address
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="font-bold text-slate-800 text-sm">{selectedOrder.customerName}</p>
                  <p className="text-xs text-slate-500 font-medium">{selectedOrder.address}</p>
                  <div className="pt-2 border-t border-slate-200 mt-2 flex flex-wrap gap-4">
                    <p className="text-xs text-slate-500">
                      📧 <span className="font-semibold">{selectedOrder.customerEmail}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      📞 <span className="font-semibold">{selectedOrder.customerPhone}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              {selectedOrder.paymentMethod && (
                <div>
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CreditCard size={13} /> Payment
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-sm font-bold text-slate-800 capitalize">
                      {selectedOrder.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : selectedOrder.paymentMethod}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

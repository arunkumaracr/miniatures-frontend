// app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/admin-api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const emptyForm = {
  title: "",
  categoryId: "",
  originalPrice: "",
  discountPrice: "",
  imageUrl: "",
  rating: "5",
  reviewCount: "0",
  isAvailable: true,
  isTopSelling: false,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    setProducts(productsRes.products || []);
    setCategories(
      (categoriesRes.categories || []).filter((c: any) => c.id !== "all")
    );
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(product: any) {
    setForm({
      title: product.title,
      categoryId: product.categoryId,
      originalPrice: String(product.originalPrice),
      discountPrice: String(product.discountPrice),
      imageUrl: product.imageUrl,
      rating: String(product.rating),
      reviewCount: String(product.reviewCount),
      isAvailable: product.isAvailable,
      isTopSelling: product.isTopSelling,
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.title || !form.categoryId || !form.originalPrice || !form.discountPrice || !form.imageUrl) {
      alert("Please fill all required fields.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      originalPrice: parseFloat(form.originalPrice),
      discountPrice: parseFloat(form.discountPrice),
      rating: parseFloat(form.rating),
      reviewCount: parseInt(form.reviewCount),
    };

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await createProduct(payload);
    }

    setSaving(false);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
    load();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">{products.length} total products</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading products...</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 capitalize">{product.categoryId}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800">${product.discountPrice}</span>
                    <span className="text-slate-400 line-through ml-2 text-xs">${product.originalPrice}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full w-fit",
                        product.isAvailable ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                      )}>
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </span>
                      {product.isTopSelling && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full w-fit bg-pink-50 text-pink-500">
                          Top Selling
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Product title"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Category *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select category</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Original Price *</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="19.99"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Discount Price *</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="13.99"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Image URL *</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="https://..."
                />
              </div>

              {/* Rating & Reviews */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rating</label>
                  <input
                    type="number"
                    min="0" max="5" step="0.1"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Review Count</label>
                  <input
                    type="number"
                    value={form.reviewCount}
                    onChange={(e) => setForm({ ...form, reviewCount: e.target.value })}
                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="accent-pink-500 w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-slate-700">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isTopSelling}
                    onChange={(e) => setForm({ ...form, isTopSelling: e.target.checked })}
                    className="accent-pink-500 w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-slate-700">Top Selling</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 text-sm font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
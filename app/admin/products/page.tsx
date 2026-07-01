"use client";

import { useEffect, useState } from "react";
import {
    getProducts, getCategories, createProduct,
    updateProduct, deleteProduct, uploadImage
} from "@/lib/admin-api";
import { Plus, Pencil, Trash2, X, Star, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const BADGE_OPTIONS = [
    "Best Seller", "Top Rated", "New Arrival", "Hot Item",
    "Top Seller", "Best Price", "Clearance", "Popular",
    "Sale", "Family Night", "Comfy Pick", "20% OFF", ""
];

const AGE_OPTIONS = [
    "0+ Years", "3+ Years", "4+ Years", "5+ Years",
    "5-9 Years", "6+ Years", "8+ Years", "8-12 Years",
    "10+ Years", "12+ Years"
];

const emptyForm = {
    title: "",
    categoryId: "",
    ageRange: "3+ Years",
    badge: "",
    originalPrice: "",
    discountPrice: "",
    imageUrl: "",
    rating: "5.0",
    reviewCount: "0",
    isAvailable: true,
    isTopSelling: false,
};

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filterTab, setFilterTab] = useState("all");

    async function load() {
        const [productsRes, categoriesRes] = await Promise.all([
            getProducts(),
            getCategories(),
        ]);
        setProducts(productsRes.products || []);
        setCategories((categoriesRes.categories || []).filter((c: any) => c.id !== "all"));
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
            ageRange: product.ageRange || "3+ Years",
            badge: product.badge || "",
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
        if (!confirm("Delete this product? This cannot be undone.")) return;
        setDeletingId(id);
        await deleteProduct(id);
        setDeletingId(null);
        load();
    }

    const filtered = filterTab === "all"
        ? products
        : filterTab === "top"
            ? products.filter((p) => p.isTopSelling)
            : filterTab === "unavailable"
                ? products.filter((p) => !p.isAvailable)
                : products.filter((p) => p.categoryId === filterTab);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900">Products</h1>
                    <p className="text-xs md:text-sm text-slate-500">{products.length} total · {products.filter(p => p.isTopSelling).length} top selling</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs md:text-sm font-bold px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-colors shadow-sm shadow-brand-200"
                >
                    <Plus size={15} /> Add Product
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {[
                    { id: "all", label: "All" },
                    { id: "top", label: "🔥 Top Selling" },
                    { id: "unavailable", label: "Unavailable" },
                    ...categories.map((c) => ({ id: c.id, label: c.label })),
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterTab(tab.id)}
                        className={cn(
                            "whitespace-nowrap px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                            filterTab === tab.id
                                ? "bg-brand-500 text-white"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Products list */}
            {loading ? (
                <p className="text-sm text-slate-400">Loading products...</p>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 px-4 py-12 text-center text-sm text-slate-400">
                    No products found in this filter.
                </div>
            ) : (
                <>
                    {/* Mobile cards — hidden on desktop */}
                    <div className="md:hidden space-y-3">
                        {filtered.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-3 flex gap-3">
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className="w-16 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{product.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 capitalize">{product.categoryId}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-sm font-black text-slate-800">₹{product.discountPrice}</span>
                                        {product.originalPrice !== product.discountPrice && (
                                            <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                                        )}
                                        <div className="flex items-center gap-0.5 ml-1">
                                            <Star size={11} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs font-bold text-slate-600">{product.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                                            product.isAvailable ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                                        )}>
                                            {product.isAvailable ? "Available" : "Unavailable"}
                                        </span>
                                        {product.isTopSelling && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-500">🔥 Top</span>
                                        )}
                                        {product.badge && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{product.badge}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 shrink-0">
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={deletingId === product.id}
                                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table — hidden on mobile */}
                    <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Age</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Price</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Rating</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Badge</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                                                />
                                                <span className="font-semibold text-slate-800 line-clamp-2 max-w-[180px] text-xs leading-snug">
                                                    {product.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500 capitalize">{product.categoryId}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{product.ageRange}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-black text-slate-800 text-sm">₹{product.discountPrice}</span>
                                            {product.originalPrice !== product.discountPrice && (
                                                <span className="text-slate-400 line-through ml-1 text-xs">₹{product.originalPrice}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                                                <span className="text-xs text-slate-400">({product.reviewCount})</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {product.badge && (
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                                                    {product.badge}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full w-fit",
                                                    product.isAvailable ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                                                )}>
                                                    {product.isAvailable ? "Available" : "Unavailable"}
                                                </span>
                                                {product.isTopSelling && (
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full w-fit bg-brand-50 text-brand-500">
                                                        🔥 Top Selling
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openEdit(product)}
                                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deletingId === product.id}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">
                                    {editingId ? "Edit Product" : "Add New Product"}
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {editingId ? "Update product details below" : "Fill in the product details below"}
                                </p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-5">

                            {/* Image Preview */}
                            {form.imageUrl && (
                                <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100">
                                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Product Title *</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                                    placeholder="e.g. RoboCraft Solar Powered Rover Kit"
                                />
                            </div>

                            {/* Category + Age Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Category *</label>
                                    <select
                                        value={form.categoryId}
                                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                        className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Age Range</label>
                                    <select
                                        value={form.ageRange}
                                        onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
                                        className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                                    >
                                        {AGE_OPTIONS.map((age) => (
                                            <option key={age} value={age}>{age}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Prices */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Original Price ($) *</label>
                                    <input
                                        type="number" step="0.01" min="0"
                                        value={form.originalPrice}
                                        onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                                        className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                                        placeholder="45.00"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Discount Price ($) *</label>
                                    <input
                                        type="number" step="0.01" min="0"
                                        value={form.discountPrice}
                                        onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                                        className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                                        placeholder="34.99"
                                    />
                                </div>
                            </div>

                            {/* Rating + Reviews */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Rating (0-5)</label>
                                    <input
                                        type="number" step="0.1" min="0" max="5"
                                        value={form.rating}
                                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                                        className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Review Count</label>
                                    <input
                                        type="number" min="0"
                                        value={form.reviewCount}
                                        onChange={(e) => setForm({ ...form, reviewCount: e.target.value })}
                                        className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                                    />
                                </div>
                            </div>

                            {/* Badge */}
                            <div>
                                <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Badge / Label</label>
                                <select
                                    value={form.badge}
                                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                                    className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                                >
                                    {BADGE_OPTIONS.map((b) => (
                                        <option key={b} value={b}>{b || "— No Badge —"}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Image URL */}
                            {/* Image Upload */}
                            <div>
                                <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
                                    Product Image *
                                </label>

                                {/* Preview */}
                                {form.imageUrl && (
                                    <div className="mt-2 w-full h-40 rounded-xl overflow-hidden bg-slate-100 mb-3">
                                        <img
                                            src={form.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* File picker */}
                                <div className="mt-1.5 flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-600 hover:text-brand-600 text-xs font-bold px-4 py-2.5 rounded-lg transition-all">
                                        <Upload size={14} />
                                        {uploadingImage ? "Uploading..." : "Choose Image"}
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            className="hidden"
                                            disabled={uploadingImage}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setUploadingImage(true);
                                                try {
                                                    const imageUrl = await uploadImage(file);
                                                    setForm({ ...form, imageUrl });
                                                } catch {
                                                    alert("Image upload failed. Try again.");
                                                } finally {
                                                    setUploadingImage(false);
                                                }
                                            }}
                                        />
                                    </label>

                                    {form.imageUrl && (
                                        <span className="text-xs text-green-600 font-semibold">
                                            ✓ Image uploaded
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-400 mt-1.5">
                                    JPG, PNG or WebP · Max 5MB
                                </p>
                            </div>

                            {/* Toggles */}
                            <div className="flex gap-6 pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <div
                                        onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                                        className={cn(
                                            "w-10 h-5 rounded-full transition-colors relative cursor-pointer",
                                            form.isAvailable ? "bg-green-500" : "bg-slate-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all",
                                            form.isAvailable ? "left-5" : "left-0.5"
                                        )} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">Available in Store</span>
                                </label>

                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <div
                                        onClick={() => setForm({ ...form, isTopSelling: !form.isTopSelling })}
                                        className={cn(
                                            "w-10 h-5 rounded-full transition-colors relative cursor-pointer",
                                            form.isTopSelling ? "bg-brand-500" : "bg-slate-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all",
                                            form.isTopSelling ? "left-5" : "left-0.5"
                                        )} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">🔥 Top Selling</span>
                                </label>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-6 py-2 text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm shadow-brand-200"
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
// app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/admin-api";
import {
  Plus, Pencil, Trash2, X,
  Gamepad2, Boxes, Paintbrush, Rocket, Car,
  Baby, Puzzle, Star, Zap, Globe,
  Bike, Wand2, Music, Blocks, Rainbow,
  type LucideIcon,
} from "lucide-react";

const ICON_OPTIONS: { name: string; component: LucideIcon }[] = [
  { name: "Boxes",     component: Boxes },
  { name: "Rocket",    component: Rocket },
  { name: "Gamepad2",  component: Gamepad2 },
  { name: "Car",       component: Car },
  { name: "Paintbrush",component: Paintbrush },
  { name: "Baby",      component: Baby },
  { name: "Puzzle",    component: Puzzle },
  { name: "Star",      component: Star },
  { name: "Zap",       component: Zap },
  { name: "Globe",     component: Globe },
  { name: "Bike",      component: Bike },
  { name: "Wand2",     component: Wand2 },
  { name: "Music",     component: Music },
  { name: "Blocks",    component: Blocks },
  { name: "Rainbow",   component: Rainbow },
];

const emptyForm = { id: "", slug: "", label: "", icon: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    const res = await getCategories();
    setCategories((res.categories || []).filter((c: any) => c.id !== "all"));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(category: any) {
    setForm({ id: category.id, slug: category.slug, label: category.label, icon: category.icon });
    setEditingId(category.id);
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.id || !form.slug || !form.label || !form.icon) {
      alert("All fields are required.");
      return;
    }
    setSaving(true);
    if (editingId) {
      await updateCategory(editingId, { slug: form.slug, label: form.label, icon: form.icon });
    } else {
      await createCategory(form);
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? All products in it will also be deleted.")) return;
    setDeletingId(id);
    await deleteCategory(id);
    setDeletingId(null);
    load();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500">{categories.length} total categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading categories...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const iconOption = ICON_OPTIONS.find((o) => o.name === category.icon);
            const IconComp = iconOption?.component ?? Boxes;
            return (
              <div key={category.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                    <IconComp className="h-5 w-5 text-brand-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-800 truncate">{category.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">ID: {category.id} · {category.icon}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(category)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">
                {editingId ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">ID *</label>
                <input
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled={!!editingId}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="e.g. outdoor"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. outdoor-toys"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Label *</label>
                <input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Outdoor Toys"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Icon *</label>
                <div className="mt-1.5 grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map(({ name, component: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setForm({ ...form, icon: name })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                        form.icon === name
                          ? "border-brand-500 bg-brand-50 text-brand-600"
                          : "border-slate-200 hover:border-slate-300 text-slate-500"
                      }`}
                      title={name}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[9px] font-bold truncate w-full text-center leading-none">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

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
                className="px-4 py-2 text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Category" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
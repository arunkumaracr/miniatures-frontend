// app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center space-y-4">
        <div className="text-5xl">🧸</div>
        <h1 className="text-2xl font-black text-slate-900">
          We're Updating Our Store!
        </h1>
        <p className="text-sm text-slate-500">
          MiniaturesToys is getting a fresh new look with exciting products.
          We'll be back online very soon. Thanks for your patience!
        </p>
        <div className="pt-4">
          <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">
            Coming Back Soon
          </span>
        </div>
      </div>
    </div>
  );
}
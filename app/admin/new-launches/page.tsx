"use client";

import { useEffect, useRef, useState } from "react";
import { getNewLaunches, createNewLaunch, deleteNewLaunch, uploadVideo } from "@/lib/admin-api";
import { Plus, Trash2, Play, X, PlayCircle, Upload, Loader2, ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/admin-api";

interface NewLaunch {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  createdAt: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isYouTube(url: string) {
  return !!getYouTubeId(url);
}

function getYoutubeThumbnail(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function getCloudinaryThumbnail(url: string) {
  // Cloudinary auto-generates a JPG thumbnail from the video's first frame
  return url
    .replace("/video/upload/", "/video/upload/so_0,w_640,h_360,c_fill/")
    .replace(/\.(mp4|mov|webm|avi)$/i, ".jpg");
}

function getThumbnail(url: string) {
  return isYouTube(url) ? getYoutubeThumbnail(url) : getCloudinaryThumbnail(url);
}

type VideoSource = "youtube" | "local";

export default function NewLaunchesPage() {
  const [launches, setLaunches] = useState<NewLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [source, setSource] = useState<VideoSource>("youtube");
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<NewLaunch | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  async function load() {
    const data = await getNewLaunches();
    setLaunches(data.launches || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setTitle("");
    setYoutubeUrl("");
    setLocalFile(null);
    setLocalPreview("");
    setThumbnailFile(null);
    setThumbnailPreview("");
    setUploadPct(0);
    setUploadStage("");
    setError("");
    setSource("youtube");
  }

  function handleThumbChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(file);
    setLocalPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    setError("");
    if (!title.trim()) { setError("Title is required."); return; }

    let videoUrl = "";

    if (source === "youtube") {
      if (!getYouTubeId(youtubeUrl)) { setError("Please enter a valid YouTube URL."); return; }
      videoUrl = youtubeUrl.trim();
    } else {
      if (!localFile) { setError("Please select a video file."); return; }
      try {
        setUploading(true);
        setUploadPct(0);
        setUploadStage("Uploading to Cloudinary…");
        videoUrl = await uploadVideo(localFile, (pct) => {
          setUploadPct(pct);
          setUploadStage(pct < 100 ? `Uploading… ${pct}%` : "Processing on Cloudinary…");
        });
        setUploadStage("Upload complete!");
      } catch (e: any) {
        setError(e.message || "Upload failed.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    let thumbnailUrl: string | undefined;
    if (thumbnailFile) {
      try {
        setUploadingThumb(true);
        thumbnailUrl = await uploadImage(thumbnailFile);
      } catch {
        setError("Thumbnail upload failed. Try again.");
        setUploadingThumb(false);
        return;
      }
      setUploadingThumb(false);
    }

    setSaving(true);
    await createNewLaunch({ title: title.trim(), videoUrl, thumbnailUrl });
    setSaving(false);
    setShowForm(false);
    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this video from Newly Launched?")) return;
    setDeletingId(id);
    await deleteNewLaunch(id);
    setDeletingId(null);
    load();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Newly Launched Videos</h1>
          <p className="text-sm text-slate-500">
            {launches.length} video{launches.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); resetForm(); }}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : launches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Play size={36} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-400 font-bold text-sm">No videos yet. Add your first newly launched video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {launches.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
              <div className="relative h-44 bg-slate-100">
                <img
                  src={item.thumbnailUrl || getThumbnail(item.videoUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
                <button
                  onClick={() => setPreview(item)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-11 w-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="h-5 w-5 text-brand-500 fill-brand-500 ml-0.5" />
                  </div>
                </button>
                <span className="absolute top-3 left-3 bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                  New
                </span>
                {/* Source badge */}
                <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${isYouTube(item.videoUrl) ? "bg-red-500 text-white" : "bg-slate-800 text-white"}`}>
                  {isYouTube(item.videoUrl) ? "YouTube" : "Local"}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center shadow transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{item.title}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="text-lg font-black text-slate-900">Add New Launch Video</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Video Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. New Couple Miniature Collection"
                />
              </div>

              {/* Source toggle */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Video Source *</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSource("youtube")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                      source === "youtube"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <PlayCircle size={16} /> YouTube URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setSource("local")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                      source === "local"
                        ? "border-brand-500 bg-brand-50 text-brand-600"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <Upload size={16} /> Local File
                  </button>
                </div>
              </div>

              {/* YouTube URL input */}
              {source === "youtube" && (
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">YouTube URL *</label>
                  <input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-slate-400 mt-1">Paste any YouTube link — youtu.be or full URL</p>
                  {/* Live thumbnail preview */}
                  {getYouTubeId(youtubeUrl) && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-100">
                      <img
                        src={getYoutubeThumbnail(youtubeUrl)}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Local file upload */}
              {source === "local" && (
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Video File *</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="mt-2 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all"
                  >
                    <Upload size={24} className="text-slate-400" />
                    <p className="text-sm font-bold text-slate-600">
                      {localFile ? localFile.name : "Click to select a video"}
                    </p>
                    <p className="text-xs text-slate-400">MP4, MOV, WEBM — max 200 MB</p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="video/mp4,video/mov,video/webm,video/avi,.mp4,.mov,.webm,.avi"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {/* Local video preview */}
                  {localPreview && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-100 bg-black">
                      <video
                        src={localPreview}
                        controls
                        className="w-full max-h-40 object-contain"
                      />
                    </div>
                  )}
                  {uploading && (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Loader2 size={12} className="animate-spin text-brand-500" />
                          {uploadStage}
                        </span>
                        <span className="text-brand-600">{uploadPct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Custom thumbnail */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Cover Image <span className="text-slate-400 font-normal normal-case">(optional — replaces auto-generated thumbnail)</span>
                </label>
                <div
                  onClick={() => thumbRef.current?.click()}
                  className="mt-2 border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all"
                >
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Thumbnail" className="h-16 w-24 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="h-16 w-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={20} className="text-slate-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-600">
                      {thumbnailFile ? thumbnailFile.name : "Click to upload cover image"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP</p>
                  </div>
                </div>
                <input
                  ref={thumbRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleThumbChange}
                />
              </div>

              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || uploading || uploadingThumb}
                className="px-4 py-2 text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {(saving || uploading || uploadingThumb) && <Loader2 size={14} className="animate-spin" />}
                {uploading ? "Uploading video…" : uploadingThumb ? "Uploading image…" : saving ? "Publishing…" : "Publish Video"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
            <div className="aspect-video">
              {isYouTube(preview.videoUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(preview.videoUrl)}?autoplay=1`}
                  title={preview.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={preview.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="px-5 py-4 bg-slate-900">
              <p className="text-white font-bold text-sm">{preview.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

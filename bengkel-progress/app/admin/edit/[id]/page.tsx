"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { uploadToCloudinary } from "@/lib/cloudinary";

type Motor = {
  id: string;
  name: string;
  plate: string;
  code: string;
  wa: string;

  status: string;
  detail: string;
  progress: number;

  photoBefore?: string;
  photoProcess?: string;
  photoAfter?: string;

  createdAt?: any;
};

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [motor, setMotor] = useState<Motor | null>(null);

  // form
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");
  const [code, setCode] = useState("");
  const [wa, setWa] = useState("");

  const [status, setStatus] = useState("");
  const [detail, setDetail] = useState("");
  const [progress, setProgress] = useState<number>(0);

  const [photoBefore, setPhotoBefore] = useState("");
  const [photoProcess, setPhotoProcess] = useState("");
  const [photoAfter, setPhotoAfter] = useState("");

  // upload state
  const [uploadingKey, setUploadingKey] = useState<
    "before" | "process" | "after" | null
  >(null);

  // auth protect
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
    });

    return () => unsub();
  }, [router]);

  // fetch data
  useEffect(() => {
    const run = async () => {
      try {
        if (!id) return;

        const ref = doc(db, "motors", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setMotor(null);
          setLoading(false);
          return;
        }

        const data = { id: snap.id, ...(snap.data() as any) } as Motor;
        setMotor(data);

        setName(data.name || "");
        setPlate(data.plate || "");
        setCode(data.code || "");
        setWa(data.wa || "");

        setStatus(data.status || "");
        setDetail(data.detail || "");
        setProgress(Number(data.progress) || 0);

        setPhotoBefore(data.photoBefore || "");
        setPhotoProcess(data.photoProcess || "");
        setPhotoAfter(data.photoAfter || "");

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    run();
  }, [id]);

  const clampProgress = (val: number) => {
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  };

  const cekLink = useMemo(() => {
    const base = "https://sc-profil-bengkel-app.vercel.app/cek";
    return `${base}?code=${encodeURIComponent(code || "")}`;
  }, [code]);

  const handleUpload = async (
    file: File | null,
    key: "before" | "process" | "after"
  ) => {
    if (!file) return;

    // limit file 5MB biar aman di HP
    if (file.size > 5 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 5MB.");
      return;
    }

    try {
      setUploadingKey(key);

      const url = await uploadToCloudinary(file);

      if (key === "before") setPhotoBefore(url);
      if (key === "process") setPhotoProcess(url);
      if (key === "after") setPhotoAfter(url);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Upload gagal");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    if (!motor?.id) return;

    if (!name.trim()) return alert("Nama motor wajib diisi.");
    if (!plate.trim()) return alert("Plat nomor wajib diisi.");
    if (!code.trim()) return alert("Kode cek wajib diisi.");

    try {
      setSaving(true);

      const ref = doc(db, "motors", motor.id);

      await updateDoc(ref, {
        name: name.trim(),
        plate: plate.trim(),
        code: code.trim(),
        wa: wa.trim(),

        status: status.trim(),
        detail: detail.trim(),
        progress: clampProgress(Number(progress) || 0),

        photoBefore: photoBefore || "",
        photoProcess: photoProcess || "",
        photoAfter: photoAfter || "",
      });

      alert("Data berhasil disimpan ✅");
      router.push("/admin/list");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="opacity-80">Loading...</p>
      </main>
    );
  }

  if (!motor) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-zinc-900 border border-white/10">
          <h1 className="text-xl font-bold">Data tidak ditemukan</h1>
          <p className="text-sm opacity-70 mt-2">
            ID tidak ada di database.
          </p>

          <button
            onClick={() => router.push("/admin/list")}
            className="mt-5 w-full px-4 py-3 rounded-xl bg-white text-black font-bold"
          >
            Kembali ke List
          </button>
        </div>
      </main>
    );
  }

  const UploadCard = ({
    title,
    value,
    onChange,
    uploading,
  }: {
    title: string;
    value: string;
    onChange: (file: File | null) => void;
    uploading: boolean;
  }) => {
    return (
      <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10">
        <p className="font-bold">{title}</p>

        <div className="mt-3">
          {value ? (
            <img
              src={value}
              alt={title}
              className="w-full h-48 object-cover rounded-xl border border-white/10"
            />
          ) : (
            <div className="w-full h-48 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <p className="text-sm opacity-60">Belum ada foto</p>
            </div>
          )}
        </div>

        <div className="mt-3">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onChange(e.target.files?.[0] || null)}
            />

            <div
              className={`w-full text-center px-4 py-3 rounded-xl font-bold cursor-pointer ${
                uploading
                  ? "bg-zinc-700 opacity-70 cursor-not-allowed"
                  : "bg-white text-black hover:opacity-90"
              }`}
            >
              {uploading ? "Uploading..." : "Pilih Foto"}
            </div>
          </label>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Edit Data Motor</h1>
            <p className="text-sm opacity-70">ID: {motor.id}</p>
          </div>

          <button
            onClick={() => router.push("/admin/list")}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
          >
            ⬅ Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* FORM */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10">
          <h2 className="font-bold text-lg">Informasi</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama motor"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
            />
            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="Plat nomor"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
            />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kode cek"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
            />
            <input
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="Nomor WA (628xxxx)"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
            />
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Status (contoh: Pengerjaan, Finishing, Selesai)"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
            />

            <input
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              type="number"
              min={0}
              max={100}
              placeholder="Progress (0 - 100)"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
            />
          </div>

          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Detail pekerjaan..."
            rows={5}
            className="mt-3 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
          />

          {/* Link cek */}
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm opacity-80">Link cek pelanggan:</p>
            <p className="text-sm font-semibold break-all mt-1">{cekLink}</p>

            <button
              onClick={() => navigator.clipboard.writeText(cekLink)}
              className="mt-3 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
            >
              📋 Copy Link
            </button>
          </div>
        </div>

        {/* UPLOAD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UploadCard
            title="Foto Before"
            value={photoBefore}
            uploading={uploadingKey === "before"}
            onChange={(file) => handleUpload(file, "before")}
          />

          <UploadCard
            title="Foto Process"
            value={photoProcess}
            uploading={uploadingKey === "process"}
            onChange={(file) => handleUpload(file, "process")}
          />

          <UploadCard
            title="Foto After"
            value={photoAfter}
            uploading={uploadingKey === "after"}
            onChange={(file) => handleUpload(file, "after")}
          />
        </div>

        {/* SAVE */}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={handleSave}
            disabled={saving || uploadingKey !== null}
            className={`w-full px-4 py-4 rounded-2xl font-extrabold ${
              saving || uploadingKey !== null
                ? "bg-zinc-700 opacity-70 cursor-not-allowed"
                : "bg-white text-black hover:opacity-90"
            }`}
          >
            {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
          </button>

          <button
            onClick={() => router.push("/admin/list")}
            className="w-full px-4 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-extrabold"
          >
            Batal
          </button>
        </div>
      </div>
    </main>
  );
}

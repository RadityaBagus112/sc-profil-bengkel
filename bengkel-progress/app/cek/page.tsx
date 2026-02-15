"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

type MotorDoc = {
  id: string;

  name?: string;
  plate?: string;
  code?: string;
  wa?: string;

  status?: string;
  detail?: string;
  progress?: number;

  photoBefore?: string;
  photoProcess?: string;
  photoAfter?: string;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function clampProgress(val: number) {
  if (val < 0) return 0;
  if (val > 100) return 100;
  return val;
}

function formatTime(ts?: Timestamp) {
  if (!ts) return "-";
  try {
    const d = ts.toDate();
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function statusBadge(status?: string) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1";

  const s = (status || "").toLowerCase();

  if (s.includes("selesai")) {
    return (
      <span className={`${base} bg-green-500/10 text-green-300 ring-green-500/20`}>
        Selesai
      </span>
    );
  }

  if (s.includes("proses") || s.includes("dikerjakan")) {
    return (
      <span className={`${base} bg-yellow-500/10 text-yellow-200 ring-yellow-500/20`}>
        Proses
      </span>
    );
  }

  if (s.includes("menunggu")) {
    return (
      <span className={`${base} bg-blue-500/10 text-blue-200 ring-blue-500/20`}>
        Menunggu
      </span>
    );
  }

  return (
    <span className={`${base} bg-white/10 text-white/80 ring-white/15`}>
      {status || "Status"}
    </span>
  );
}

function PhotoCard({
  title,
  url,
}: {
  title: string;
  url?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <p className="text-sm font-semibold">{title}</p>
        <span className="text-xs text-white/50">Foto</span>
      </div>

      {!url ? (
        <div className="p-6">
          <p className="text-sm text-white/60">
            Belum ada foto.
          </p>
        </div>
      ) : (
        <div className="bg-black/30">
          <img
            src={url}
            alt={title}
            className="h-[240px] w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default function CekPage() {
  const params = useSearchParams();

  const code = useMemo(() => {
    const c = (params.get("code") || "").trim().toUpperCase();
    return c;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MotorDoc | null>(null);
  const [msg, setMsg] = useState("");

  async function loadByCode() {
    setMsg("");
    setData(null);

    if (!code) {
      setLoading(false);
      setMsg("Kode cek tidak ditemukan di URL. Contoh: /cek?code=ABC123");
      return;
    }

    try {
      setLoading(true);

      // Cari motor berdasarkan code
      const q = query(collection(db, "motors"), where("code", "==", code));
      const snap = await getDocs(q);

      if (snap.empty) {
        setData(null);
        setMsg("Data tidak ditemukan. Pastikan kode cek benar.");
        return;
      }

      const doc = snap.docs[0];
      setData({
        id: doc.id,
        ...(doc.data() as any),
      });
    } catch (err: any) {
      console.error("Load cek error:", err);
      setMsg("Terjadi error saat memuat data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadByCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-[10%] top-[35%] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-[10%] top-[55%] h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center">
              <span className="text-sm font-semibold">BR</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">
                Bagus Restoration
              </p>
              <p className="text-xs text-white/60">Cek Progress</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Home
            </Link>

            <button
              onClick={loadByCode}
              className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-16">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Detail Progress
              </h1>
              <p className="mt-2 text-white/70">
                Masukkan kode cek dari bengkel untuk melihat progress motor.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs text-white/60">Kode Cek</p>
                <p className="text-sm font-bold tracking-wider">{code || "-"}</p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm text-white/70">Memuat data...</p>
            </div>
          )}

          {/* Error / Empty */}
          {!loading && !data && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm text-white/70">{msg || "Data kosong."}</p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/progress"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition text-center"
                >
                  Kembali ke Progress
                </Link>

                <Link
                  href="/"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 transition text-center"
                >
                  Ke Home
                </Link>
              </div>
            </div>
          )}

          {/* Data */}
          {!loading && data && (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {/* LEFT: Detail */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">
                        {data.name || "Motor"}
                      </h2>
                      <p className="mt-1 text-sm text-white/70">
                        Plat:{" "}
                        <span className="font-semibold text-white">
                          {data.plate || "-"}
                        </span>
                      </p>
                    </div>

                    {statusBadge(data.status)}
                  </div>

                  {/* Progress */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-white/70">
                      <span>Progress</span>
                      <span className="font-bold text-white">
                        {clampProgress(Number(data.progress) || 0)}%
                      </span>
                    </div>

                    <div className="mt-3 w-full h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-white/80"
                        style={{
                          width: `${clampProgress(Number(data.progress) || 0)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 text-xs text-white/50">
                      Update terakhir:{" "}
                      {formatTime(data.updatedAt || data.createdAt)}
                    </p>
                  </div>

                  {/* Detail */}
                  <div className="mt-6">
                    <p className="text-sm font-semibold">Detail Pengerjaan</p>
                    <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                      {data.detail || "Belum ada detail pengerjaan."}
                    </p>
                  </div>
                </div>

                {/* Photos */}
                <div className="grid gap-4 md:grid-cols-3">
                  <PhotoCard title="Foto Sebelum" url={data.photoBefore} />
                  <PhotoCard title="Foto Proses" url={data.photoProcess} />
                  <PhotoCard title="Foto Setelah" url={data.photoAfter} />
                </div>
              </div>

              {/* RIGHT: Info */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm font-semibold">Info</p>

                  <div className="mt-4 space-y-3 text-sm text-white/70">
                    <div className="flex items-center justify-between gap-3">
                      <span className="opacity-70">Kode</span>
                      <span className="font-semibold text-white">
                        {data.code || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="opacity-70">Status</span>
                      <span className="font-semibold text-white">
                        {data.status || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="opacity-70">Progress</span>
                      <span className="font-semibold text-white">
                        {clampProgress(Number(data.progress) || 0)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs text-white/60 leading-relaxed">
                      Jika ada pertanyaan, silakan hubungi bengkel.  
                      Halaman ini dibuat agar customer bisa melihat progress secara transparan.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-6">
                  <p className="text-sm font-semibold">
                    Bagus Restoration
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    Bengkel motor profesional dengan update progress realtime.
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      href="/progress"
                      className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition text-center"
                    >
                      Lihat Daftar Progress
                    </Link>

                    <Link
                      href="/"
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 transition text-center"
                    >
                      Kembali ke Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

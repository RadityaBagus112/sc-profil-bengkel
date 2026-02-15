"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type MotorDoc = {
  id: string;
  customerName?: string;
  phone?: string;
  motor?: string;
  platNomor?: string;
  keluhan?: string;

  status?: "menunggu" | "proses" | "selesai";
  progressText?: string;

  photoUrl?: string;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function statusBadge(status?: string) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1";

  if (status === "selesai") {
    return (
      <span
        className={`${base} bg-green-500/10 text-green-300 ring-green-500/20`}
      >
        Selesai
      </span>
    );
  }

  if (status === "proses") {
    return (
      <span
        className={`${base} bg-yellow-500/10 text-yellow-200 ring-yellow-500/20`}
      >
        Proses
      </span>
    );
  }

  return (
    <span className={`${base} bg-blue-500/10 text-blue-200 ring-blue-500/20`}>
      Menunggu
    </span>
  );
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

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MotorDoc[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "menunggu" | "proses" | "selesai"
  >("all");

  async function load() {
    try {
      setLoading(true);

      // 🔥 DATA ASLI KAMU ADA DI COLLECTION "motors"
      const q = query(collection(db, "motors"), orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);

      const list: MotorDoc[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setItems(list);
    } catch (err) {
      console.error("Load progress error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return items
      .filter((it) => {
        if (filterStatus === "all") return true;
        return (it.status || "menunggu") === filterStatus;
      })
      .filter((it) => {
        if (!s) return true;

        const hay = [
          it.customerName,
          it.motor,
          it.platNomor,
          it.progressText,
          it.keluhan,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return hay.includes(s);
      });
  }, [items, search, filterStatus]);

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
              <p className="text-xs text-white/60">Progress Pengerjaan</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Daftar Progress
              </h1>
              <p className="mt-2 text-white/70">
                Customer bisa cek status motor, progress terbaru, dan foto bukti.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama / motor / plat..."
                  className="w-full sm:w-[260px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
                />

                <button
                  onClick={load}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Refresh
                </button>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="proses">Proses</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm text-white/70">Memuat data progress...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm text-white/70">
                Data masih kosong / tidak ditemukan.
              </p>
              <p className="mt-2 text-xs text-white/50">
                Kalau kamu yakin sudah tambah data, berarti field updatedAt belum
                ada.
              </p>
            </div>
          )}

          {/* List */}
          {!loading && filtered.length > 0 && (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {filtered.map((it) => (
                <Link
                  key={it.id}
                  href={`/cek?id=${it.id}`}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {it.motor || "Motor"}
                        {it.platNomor ? ` • ${it.platNomor}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        Customer: {it.customerName || "-"}
                      </p>
                    </div>

                    {statusBadge(it.status)}
                  </div>

                  <p className="mt-4 text-sm text-white/70 leading-relaxed line-clamp-3">
                    {it.progressText ||
                      it.keluhan ||
                      "Belum ada update progress."}
                  </p>

                  {it.photoUrl && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                      <img
                        src={it.photoUrl}
                        alt="Foto progress"
                        className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between text-xs text-white/50">
                    <span>Update: {formatTime(it.updatedAt)}</span>
                    <span className="text-white/60 group-hover:text-white transition">
                      Lihat detail →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

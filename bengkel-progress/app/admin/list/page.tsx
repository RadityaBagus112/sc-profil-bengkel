'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from 'firebase/firestore';

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

export default function AdminListPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [motors, setMotors] = useState<Motor[]>([]);

  // filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // auth protect
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/admin/login');
      else setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // realtime motors
  useEffect(() => {
    const q = query(collection(db, 'motors'), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Motor[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));

        setMotors(data);
      },
      (err) => {
        console.error('Firestore error:', err);
      }
    );

    return () => unsub();
  }, []);

  // list status otomatis (biar dropdown ngikutin isi database)
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    motors.forEach((m) => {
      if (m.status?.trim()) set.add(m.status.trim());
    });

    return ['Semua', ...Array.from(set)];
  }, [motors]);

  const filteredMotors = useMemo(() => {
    const s = search.trim().toLowerCase();

    return motors.filter((m) => {
      const matchSearch =
        !s ||
        (m.name || '').toLowerCase().includes(s) ||
        (m.plate || '').toLowerCase().includes(s) ||
        (m.code || '').toLowerCase().includes(s) ||
        (m.wa || '').toLowerCase().includes(s) ||
        (m.status || '').toLowerCase().includes(s);

      const matchStatus =
        statusFilter === 'Semua' || (m.status || '') === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [motors, search, statusFilter]);

  const clampProgress = (val: number) => {
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  };

  const buildCekLink = (code: string) => {
    const base = 'https://sc-profil-bengkel-app.vercel.app/cek';
    return `${base}?code=${encodeURIComponent(code || '')}`;
  };

  const handleWA = (m: Motor) => {
    const wa = (m.wa || '').replace(/\s/g, '');

    if (!wa) {
      alert('Nomor WA kosong.');
      return;
    }

    const linkCek = buildCekLink(m.code || '');

    const text = `Halo Kak 👋
Ini update progress motor dari Bagus Restoration.

🛵 Motor: ${m.name || '-'}
📌 Plat: ${m.plate || '-'}
🔑 Kode Cek: ${m.code || '-'}
📍 Status: ${m.status || '-'}
📈 Progress: ${clampProgress(Number(m.progress) || 0)}%
🧾 Detail: ${m.detail || '-'}

🔎 Cek progress di sini:
${linkCek}

Terima kasih 🙏`;

    const url = `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('Yakin hapus data ini?');
    if (!ok) return;

    try {
      await deleteDoc(doc(db, 'motors', id));
      alert('Data berhasil dihapus.');
    } catch (err) {
      console.error(err);
      alert('Gagal hapus data.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="opacity-80">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">Admin - List Motor</h1>
              <p className="text-sm opacity-70">
                Total: {filteredMotors.length} motor
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push('/admin/add')}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold hover:opacity-90"
              >
                ➕ Add
              </button>

              <button
                onClick={() => auth.signOut().then(() => router.push('/'))}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
              >
                Logout
              </button>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari: nama / plat / kode / WA / status..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 outline-none focus:border-white/30"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 outline-none focus:border-white/30"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('Semua');
              }}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {filteredMotors.length === 0 ? (
          <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10">
            <p className="opacity-80">
              Belum ada data motor, atau filter kamu tidak menemukan hasil.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMotors.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-zinc-900 border border-white/10 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{m.name || '-'}</h2>
                    <p className="text-sm opacity-80 mt-1">
                      Plat: <span className="font-semibold">{m.plate}</span>
                    </p>
                    <p className="text-sm opacity-80">
                      Kode: <span className="font-semibold">{m.code}</span>
                    </p>
                    <p className="text-sm opacity-80">
                      WA: <span className="font-semibold">{m.wa}</span>
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
                    {m.status || '-'}
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm opacity-80">
                    <span>Progress</span>
                    <span className="font-bold">
                      {clampProgress(Number(m.progress) || 0)}%
                    </span>
                  </div>

                  <div className="mt-2 w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-white/70"
                      style={{
                        width: `${clampProgress(Number(m.progress) || 0)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Detail */}
                <div className="mt-4">
                  <p className="text-sm opacity-80">Detail</p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {m.detail || '-'}
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => router.push('/admin/edit/${m.id}')}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleWA(m)}
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold hover:opacity-90"
                  >
                    📲 WA Pelanggan
                  </button>

                  <button
                    onClick={() => window.open(buildCekLink(m.code), '_blank')}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
                  >
                    🔎 Link Cek
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-bold"
                  >
                    🗑 Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button (HP) */}
      <button
        onClick={() => router.push('/admin/add')}
        className="md:hidden fixed bottom-5 right-5 px-5 py-4 rounded-2xl bg-white text-black font-extrabold shadow-xl"
      >
        ➕ Add
      </button>
    </main>
  );
}

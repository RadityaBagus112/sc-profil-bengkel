'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

type Motor = {
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
};

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams();

  const id = useMemo(() => {
    const raw = params?.id;
    return typeof raw === 'string' ? raw : '';
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // form state
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [code, setCode] = useState('');
  const [wa, setWa] = useState('');

  const [status, setStatus] = useState('Motor masuk');
  const [detail, setDetail] = useState('');
  const [progress, setProgress] = useState<number>(0);

  const [photoBefore, setPhotoBefore] = useState('');
  const [photoProcess, setPhotoProcess] = useState('');
  const [photoAfter, setPhotoAfter] = useState('');

  const clampProgress = (val: number) => {
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  };

  // auth protect
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/admin/login');
      else setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // fetch motor
  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setFetching(true);
        setMsg('');

        const ref = doc(db, 'motors', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setMsg('❌ Data tidak ditemukan (doc tidak ada).');
          return;
        }

        const data = snap.data() as Motor;

        setName(data.name || '');
        setPlate(data.plate || '');
        setCode(data.code || '');
        setWa(data.wa || '');

        setStatus(data.status || 'Motor masuk');
        setDetail(data.detail || '');
        setProgress(clampProgress(Number(data.progress) || 0));

        setPhotoBefore(data.photoBefore || '');
        setPhotoProcess(data.photoProcess || '');
        setPhotoAfter(data.photoAfter || '');
      } catch (err: any) {
        console.error('Fetch error:', err);
        setMsg('❌ Gagal mengambil data: ' + (err?.message || 'Unknown error'));
      } finally {
        setFetching(false);
      }
    };

    run();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setMsg('❌ ID kosong. Route error.');
      return;
    }

    setMsg('');

    // validasi
    if (!name.trim()) return setMsg('❌ Nama motor wajib diisi.');
    if (!plate.trim()) return setMsg('❌ Plat nomor wajib diisi.');
    if (!code.trim()) return setMsg('❌ Kode cek wajib diisi.');
    if (!wa.trim()) return setMsg('❌ No WA pelanggan wajib diisi.');

    try {
      setSaving(true);

      const ref = doc(db, 'motors', id);

      await updateDoc(ref, {
        name: name.trim(),
        plate: plate.trim().toUpperCase(),
        code: code.trim().toUpperCase(),
        wa: wa.trim(),

        status: status.trim(),
        detail: detail.trim(),
        progress: clampProgress(Number(progress) || 0),

        photoBefore: photoBefore.trim(),
        photoProcess: photoProcess.trim(),
        photoAfter: photoAfter.trim(),

        updatedAt: serverTimestamp(),
      });

      setMsg('✅ Data berhasil diupdate!');
      setTimeout(() => router.push('/admin/list'), 700);
    } catch (err: any) {
      console.error('Update error:', err);
      setMsg('❌ Gagal update: ' + (err?.message || 'Unknown error'));
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">✏️ Edit Data Motor</h1>
            <p className="text-sm opacity-70 mt-1">
              Update status, progress, detail, dan foto.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin/list')}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
          >
            ⬅️ Back
          </button>
        </div>

        {/* INFO */}
        <div className="mt-4 p-4 rounded-2xl bg-zinc-900 border border-white/10">
          <p className="text-xs opacity-70">
            ID: <span className="font-mono">{id || '-'}</span>
          </p>
        </div>

        {msg && (
          <div className="mt-4 p-4 rounded-2xl bg-zinc-900 border border-white/10">
            <p className="font-bold text-yellow-300">{msg}</p>
          </div>
        )}

        {fetching ? (
          <div className="mt-6 p-6 rounded-2xl bg-zinc-900 border border-white/10">
            <p className="opacity-80">Mengambil data...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="mt-6 p-5 rounded-2xl bg-zinc-900 border border-white/10"
          >
            {/* Nama */}
            <label className="text-sm font-bold">Nama Motor</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              placeholder="Contoh: Honda Vario 125"
            />

            {/* Plat */}
            <div className="mt-4">
              <label className="text-sm font-bold">Plat Nomor</label>
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
                placeholder="Contoh: R 1234 ABC"
              />
            </div>

            {/* Code */}
            <div className="mt-4">
              <label className="text-sm font-bold">Kode Cek</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
                placeholder="Contoh: X9A21B"
              />
            </div>

            {/* WA */}
            <div className="mt-4">
              <label className="text-sm font-bold">No WA Pelanggan</label>
              <input
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
                placeholder="Contoh: 6281234567890"
              />
              <p className="text-xs opacity-60 mt-2">
                Wajib format 62xxxx (tanpa +)
              </p>
            </div>

            {/* Status */}
            <div className="mt-4">
              <label className="text-sm font-bold">Status</label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
                placeholder="Contoh: Motor masuk"
              />
            </div>

            {/* Detail */}
            <div className="mt-4">
              <label className="text-sm font-bold">Detail</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30 min-h-[120px]"
                placeholder="Contoh: Service CVT, ganti kampas rem..."
              />
            </div>

            {/* Progress */}
            <div className="mt-4">
              <label className="text-sm font-bold">Progress (%)</label>
              <input
                type="number"
                value={progress}
                onChange={(e) =>
                  setProgress(clampProgress(Number(e.target.value)))
                }
                min={0}
                max={100}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              />
            </div>

            {/* Foto URL */}
            <div className="mt-6">
              <p className="font-bold text-sm">📸 Foto (URL)</p>
              <p className="text-xs opacity-60 mt-1">
                Untuk sekarang pakai link foto dulu. Upload Firebase Storage kita
                bikin setelah ini.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-bold opacity-80">Before</label>
                  <input
                    value={photoBefore}
                    onChange={(e) => setPhotoBefore(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-sm font-bold opacity-80">Process</label>
                  <input
                    value={photoProcess}
                    onChange={(e) => setPhotoProcess(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-sm font-bold opacity-80">After</label>
                  <input
                    value={photoAfter}
                    onChange={(e) => setPhotoAfter(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-black font-extrabold hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Menyimpan...' : '💾 Simpan Update'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/list')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
              >
                📋 Kembali ke List
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

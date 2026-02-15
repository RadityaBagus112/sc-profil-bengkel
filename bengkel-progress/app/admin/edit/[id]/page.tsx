'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

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

export default function EditMotorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState<Motor>({
    name: '',
    plate: '',
    code: '',
    wa: '',
    status: '',
    detail: '',
    progress: 0,
    photoBefore: '',
    photoProcess: '',
    photoAfter: '',
  });

  // =========================
  // Auth protect
  // =========================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/admin/login');
      else setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // =========================
  // Fetch data by id
  // =========================
  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        const snap = await getDoc(doc(db, 'motors', id));

        if (!snap.exists()) {
          setNotFound(true);
          return;
        }

        const data = snap.data() as any;

        setForm({
          name: data.name || '',
          plate: data.plate || '',
          code: data.code || '',
          wa: data.wa || '',
          status: data.status || '',
          detail: data.detail || '',
          progress: Number(data.progress || 0),
          photoBefore: data.photoBefore || '',
          photoProcess: data.photoProcess || '',
          photoAfter: data.photoAfter || '',
        });
      } catch (err) {
        console.error(err);
        setNotFound(true);
      }
    };

    run();
  }, [id]);

  const clampProgress = (val: number) => {
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  };

  const handleChange = (key: keyof Motor, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================
  // Upload helper
  // =========================
  const uploadPhoto = async (
    file: File,
    type: 'before' | 'process' | 'after'
  ) => {
    if (!id) return '';

    const ext = file.name.split('.').pop() || 'jpg';

    // folder storage rapih
    const fileRef = ref(storage, `motors/${id}/${type}.${ext}`);

    // upload
    await uploadBytes(fileRef, file);

    // get url
    const url = await getDownloadURL(fileRef);

    return url;
  };

  const deletePhotoFromStorage = async (url: string) => {
    try {
      if (!url) return;

      // Firebase bisa delete pakai ref dari url
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (err) {
      console.log('Delete storage error:', err);
    }
  };

  // =========================
  // Handle upload input
  // =========================
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'process' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);

    try {
      // hapus foto lama dulu (kalau ada)
      const oldUrl =
        type === 'before'
          ? form.photoBefore
          : type === 'process'
          ? form.photoProcess
          : form.photoAfter;

      if (oldUrl) {
        await deletePhotoFromStorage(oldUrl);
      }

      // upload baru
      const url = await uploadPhoto(file, type);

      // update state dulu biar preview langsung muncul
      if (type === 'before') handleChange('photoBefore', url);
      if (type === 'process') handleChange('photoProcess', url);
      if (type === 'after') handleChange('photoAfter', url);

      // update firestore
      await updateDoc(doc(db, 'motors', id), {
        photoBefore: type === 'before' ? url : form.photoBefore,
        photoProcess: type === 'process' ? url : form.photoProcess,
        photoAfter: type === 'after' ? url : form.photoAfter,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      alert('Upload gagal. Cek Storage Rules / koneksi.');
    }

    setSaving(false);
  };

  // =========================
  // Delete photo
  // =========================
  const handleDeletePhoto = async (type: 'before' | 'process' | 'after') => {
    const url =
      type === 'before'
        ? form.photoBefore
        : type === 'process'
        ? form.photoProcess
        : form.photoAfter;

    if (!url) return;

    const ok = confirm('Yakin hapus foto ini?');
    if (!ok) return;

    setSaving(true);

    try {
      await deletePhotoFromStorage(url);

      if (type === 'before') handleChange('photoBefore', '');
      if (type === 'process') handleChange('photoProcess', '');
      if (type === 'after') handleChange('photoAfter', '');

      await updateDoc(doc(db, 'motors', id), {
        photoBefore: type === 'before' ? '' : form.photoBefore,
        photoProcess: type === 'process' ? '' : form.photoProcess,
        photoAfter: type === 'after' ? '' : form.photoAfter,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      alert('Gagal hapus foto.');
    }

    setSaving(false);
  };

  // =========================
  // Save
  // =========================
  const handleSave = async () => {
    if (!id) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, 'motors', id), {
        name: form.name,
        plate: form.plate,
        code: form.code,
        wa: form.wa,
        status: form.status,
        detail: form.detail,
        progress: clampProgress(Number(form.progress || 0)),
        updatedAt: serverTimestamp(),
      });

      alert('Data berhasil disimpan!');
      router.push('/admin/list');
    } catch (err) {
      console.error(err);
      alert('Gagal simpan.');
    }

    setSaving(false);
  };

  // =========================
  // UI
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="opacity-80">Loading...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-zinc-900 border border-white/10">
          <p className="text-lg font-bold">❌ Data tidak ditemukan</p>
          <p className="text-sm opacity-70 mt-2">
            ID motor tidak ada di Firestore.
          </p>

          <button
            onClick={() => router.push('/admin/list')}
            className="mt-4 w-full px-4 py-3 rounded-xl bg-white text-black font-bold"
          >
            Kembali ke List
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-bold">✏️ Edit Data Motor</h1>
        <p className="text-sm opacity-70 mt-1">
          Update status, progres, detail, dan foto.
        </p>

        {/* FORM */}
        <div className="mt-5 p-5 rounded-2xl bg-zinc-900 border border-white/10">
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-semibold mb-2">Nama Motor</p>
              <input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Plat Nomor</p>
              <input
                value={form.plate}
                onChange={(e) => handleChange('plate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Kode Cek</p>
              <input
                value={form.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">No WA Pelanggan</p>
              <input
                value={form.wa}
                onChange={(e) => handleChange('wa', e.target.value)}
                placeholder="628xxxx"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Status</p>
              <input
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                placeholder="Contoh: Proses / Antri / Selesai"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Detail</p>
              <textarea
                value={form.detail}
                onChange={(e) => handleChange('detail', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Progress (%)</p>
              <input
                type="number"
                value={form.progress}
                onChange={(e) =>
                  handleChange('progress', clampProgress(Number(e.target.value)))
                }
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 outline-none focus:border-white/30"
              />
            </div>

            {/* FOTO */}
            <div className="mt-2">
              <p className="text-sm font-semibold mb-3">
                🖼 Foto (Before / Process / After)
              </p>

              {/* BEFORE */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 mb-3">
                <p className="font-bold text-sm mb-2">Before</p>

                {form.photoBefore ? (
                  <div>
                    <img
                      src={form.photoBefore}
                      alt="Before"
                      className="w-full rounded-xl border border-white/10"
                    />

                    <button
                      onClick={() => handleDeletePhoto('before')}
                      className="mt-3 w-full px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-bold"
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <p className="text-sm opacity-70">Belum ada foto</p>
                )}

                <label className="mt-3 block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, 'before')}
                    className="hidden"
                  />

                  <div className="cursor-pointer mt-2 w-full px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-center">
                    {saving ? 'Uploading...' : 'Pilih Foto'}
                  </div>
                </label>
              </div>

              {/* PROCESS */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 mb-3">
                <p className="font-bold text-sm mb-2">Process</p>

                {form.photoProcess ? (
                  <div>
                    <img
                      src={form.photoProcess}
                      alt="Process"
                      className="w-full rounded-xl border border-white/10"
                    />

                    <button
                      onClick={() => handleDeletePhoto('process')}
                      className="mt-3 w-full px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-bold"
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <p className="text-sm opacity-70">Belum ada foto</p>
                )}

                <label className="mt-3 block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, 'process')}
                    className="hidden"
                  />

                  <div className="cursor-pointer mt-2 w-full px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-center">
                    {saving ? 'Uploading...' : 'Pilih Foto'}
                  </div>
                </label>
              </div>

              {/* AFTER */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10">
                <p className="font-bold text-sm mb-2">After</p>

                {form.photoAfter ? (
                  <div>
                    <img
                      src={form.photoAfter}
                      alt="After"
                      className="w-full rounded-xl border border-white/10"
                    />

                    <button
                      onClick={() => handleDeletePhoto('after')}
                      className="mt-3 w-full px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-bold"
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <p className="text-sm opacity-70">Belum ada foto</p>
                )}

                <label className="mt-3 block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, 'after')}
                    className="hidden"
                  />

                  <div className="cursor-pointer mt-2 w-full px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-center">
                    {saving ? 'Uploading...' : 'Pilih Foto'}
                  </div>
                </label>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/admin/list')}
                className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold"
              >
                ⬅️ Kembali
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-3 rounded-xl bg-white text-black font-bold hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import { uploadToCloudinary } from '@/lib/cloudinary';

type MotorData = {
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
};

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');

  const [data, setData] = useState<MotorData>({
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

  const [msg, setMsg] = useState('');

  // Proteksi admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      }
    });

    return () => unsub();
  }, [router]);

  // Load data by ID
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const ref = doc(db, 'motors', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setMsg('❌ Data tidak ditemukan.');
          setLoading(false);
          return;
        }

        setData(snap.data() as MotorData);
      } catch (err: any) {
        console.error(err);
        setMsg('❌ Gagal mengambil data: ' + (err?.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const clampProgress = (val: number) => {
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  };

  const handleSave = async () => {
    setMsg('');

    if (!data.name?.trim()) return setMsg('❌ Nama motor wajib diisi.');
    if (!data.plate?.trim()) return setMsg('❌ Plat nomor wajib diisi.');
    if (!data.code?.trim()) return setMsg('❌ Kode cek wajib diisi.');
    if (!data.wa?.trim()) return setMsg('❌ No WA pelanggan wajib diisi.');

    if (!auth.currentUser) {
      setMsg('❌ Kamu belum login. Silakan login ulang.');
      router.push('/admin/login');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: data.name.trim(),
        plate: data.plate.trim().toUpperCase(),
        code: data.code.trim().toUpperCase(),
        wa: data.wa.trim(),

        status: (data.status || '').trim(),
        detail: (data.detail || '').trim(),
        progress: clampProgress(Number(data.progress) || 0),

        photoBefore: data.photoBefore || '',
        photoProcess: data.photoProcess || '',
        photoAfter: data.photoAfter || '',
      };

      await updateDoc(doc(db, 'motors', id), payload);

      setMsg('✅ Data berhasil diupdate!');
      setTimeout(() => {
        router.push('/admin/list');
      }, 700);
    } catch (err: any) {
      console.error(err);
      setMsg('❌ Gagal update: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = confirm('Yakin mau hapus data ini?');
    if (!ok) return;

    try {
      await deleteDoc(doc(db, 'motors', id));
      alert('✅ Data berhasil dihapus.');
      router.push('/admin/list');
    } catch (err: any) {
      console.error(err);
      alert('❌ Gagal hapus: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleUpload = async (
    type: 'before' | 'process' | 'after',
    file: File
  ) => {
    try {
      setUploading(`Uploading ${type}...`);

      const url = await uploadToCloudinary(file);

      const field =
        type === 'before'
          ? 'photoBefore'
          : type === 'process'
          ? 'photoProcess'
          : 'photoAfter';

      // update di firestore
      await updateDoc(doc(db, 'motors', id), {
        [field]: url,
      });

      // update state lokal biar langsung muncul
      setData((prev) => ({
        ...prev,
        [field]: url,
      }));
    } catch (err: any) {
      console.error(err);
      alert('❌ Upload gagal: ' + (err?.message || 'Unknown error'));
    } finally {
      setUploading('');
    }
  };

  const removePhoto = async (field: 'photoBefore' | 'photoProcess' | 'photoAfter') => {
    const ok = confirm('Hapus foto ini?');
    if (!ok) return;

    try {
      await updateDoc(doc(db, 'motors', id), {
        [field]: '',
      });

      setData((prev) => ({
        ...prev,
        [field]: '',
      }));
    } catch (err: any) {
      console.error(err);
      alert('❌ Gagal hapus foto.');
    }
  };

  if (loading) {
    return (
      <main style={{ padding: 20, fontFamily: 'Arial', color: 'white' }}>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <main style={{ padding: 20, fontFamily: 'Arial', color: 'white' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 'bold' }}>✏️ Edit Data Motor</h1>
        <p style={{ opacity: 0.8, marginTop: 6 }}>
          Update status, progres, detail, dan foto.
        </p>

        {msg && (
          <p style={{ marginTop: 14, fontWeight: 'bold', color: 'yellow' }}>
            {msg}
          </p>
        )}

        {/* FORM */}
        <div
          style={{
            marginTop: 20,
            border: '1px solid #333',
            borderRadius: 14,
            padding: 16,
            background: '#0f0f0f',
          }}
        >
          <label style={{ fontWeight: 'bold' }}>Nama Motor</label>
          <input
            value={data.name || ''}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
              marginBottom: 14,
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Plat Nomor</label>
          <input
            value={data.plate || ''}
            onChange={(e) => setData({ ...data, plate: e.target.value })}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
              marginBottom: 14,
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Kode Cek</label>
          <input
            value={data.code || ''}
            onChange={(e) => setData({ ...data, code: e.target.value })}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
              marginBottom: 14,
            }}
          />

          <label style={{ fontWeight: 'bold' }}>No WA Pelanggan</label>
          <input
            value={data.wa || ''}
            onChange={(e) => setData({ ...data, wa: e.target.value })}
            placeholder="628xxxx"
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
              marginBottom: 14,
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Status</label>
          <input
            value={data.status || ''}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
              marginBottom: 14,
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Detail</label>
          <textarea
            value={data.detail || ''}
            onChange={(e) => setData({ ...data, detail: e.target.value })}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
              minHeight: 120,
              marginBottom: 14,
            }}
          />

          <label style={{ fontWeight: 'bold' }}>Progress (%)</label>
          <input
            type="number"
            value={data.progress || 0}
            onChange={(e) =>
              setData({
                ...data,
                progress: clampProgress(Number(e.target.value)),
              })
            }
            min={0}
            max={100}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
            }}
          />

          {/* FOTO */}
          <div style={{ marginTop: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>
              📸 Foto (Before / Process / After)
            </h3>

            {uploading && (
              <p style={{ marginTop: 10, color: 'yellow', fontWeight: 'bold' }}>
                {uploading}
              </p>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: 14,
                marginTop: 14,
              }}
            >
              {[
                { label: 'Before', field: 'photoBefore', type: 'before' },
                { label: 'Process', field: 'photoProcess', type: 'process' },
                { label: 'After', field: 'photoAfter', type: 'after' },
              ].map((item) => {
                const url = (data as any)[item.field] as string;

                return (
                  <div
                    key={item.field}
                    style={{
                      border: '1px solid #333',
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <b>{item.label}</b>

                    <div style={{ marginTop: 10 }}>
                      {url ? (
                        <img
                          src={url}
                          alt={item.label}
                          style={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: 12,
                            border: '1px solid #222',
                          }}
                        />
                      ) : (
                        <p style={{ opacity: 0.7, marginTop: 10 }}>
                          Belum ada foto
                        </p>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      style={{ marginTop: 10, width: '100%' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        handleUpload(item.type as any, file);
                      }}
                    />

                    {url && (
                      <button
                        onClick={() => removePhoto(item.field as any)}
                        style={{
                          marginTop: 10,
                          width: '100%',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        🗑️ Hapus Foto
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '12px 16px',
                fontWeight: 'bold',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Menyimpan...' : '💾 Simpan Update'}
            </button>

            <button
              onClick={() => router.push('/admin/list')}
              style={{
                padding: '12px 16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ⬅️ Kembali
            </button>

            <button
              onClick={handleDelete}
              style={{
                padding: '12px 16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ❌ Hapus Data
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

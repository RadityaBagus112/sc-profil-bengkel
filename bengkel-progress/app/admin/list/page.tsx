'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { uploadToCloudinary } from '@/lib/cloudinary';

type MotorData = {
  id: string;
  name?: string;
  plate?: string;
  code?: string;
  wa?: string;

  progress?: number;
  status?: string;
  detail?: string;

  photoBefore?: string;
  photoProcess?: string;
  photoAfter?: string;
};

export default function AdminListPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [motors, setMotors] = useState<MotorData[]>([]);
  const [error, setError] = useState('');

  // status upload per motor
  const [uploading, setUploading] = useState<Record<string, string>>({});

  // =========================
  // AUTH PROTECTION
  // =========================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        setLoading(false);
        loadData();
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // LOAD DATA
  // =========================
  const loadData = async () => {
    setError('');
    try {
      const q = query(collection(db, 'motors'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);

      const data: MotorData[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setMotors(data);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data dari Firebase.');
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    const ok = confirm('Yakin mau logout?');
    if (!ok) return;

    await signOut(auth);
    router.push('/admin/login');
  };

  // =========================
  // UPDATE FIELD
  // =========================
  const updateField = async (id: string, field: string, value: any) => {
    try {
      const ref = doc(db, 'motors', id);
      await updateDoc(ref, {
        [field]: value,
      });
    } catch (err) {
      console.error(err);
      alert('Gagal update data.');
    }
  };

  const changeProgress = async (id: string, current: number, step: number) => {
    let next = (current || 0) + step;
    if (next < 0) next = 0;
    if (next > 100) next = 100;
    await updateField(id, 'progress', next);
    loadData();
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    const ok = confirm('Yakin hapus data ini?');
    if (!ok) return;

    try {
      await deleteDoc(doc(db, 'motors', id));
      loadData();
    } catch (err) {
      console.error(err);
      alert('Gagal hapus data.');
    }
  };

  // =========================
  // UPLOAD FOTO
  // =========================
  const handleUploadPhoto = async (
    motorId: string,
    type: 'before' | 'process' | 'after',
    file: File
  ) => {
    try {
      setUploading((prev) => ({
        ...prev,
        [motorId]: `Uploading ${type}...`,
      }));

      const url = await uploadToCloudinary(file);

      const fieldName =
        type === 'before'
          ? 'photoBefore'
          : type === 'process'
          ? 'photoProcess'
          : 'photoAfter';

      await updateField(motorId, fieldName, url);

      await loadData();
    } catch (err: any) {
      console.error(err);
      alert('Upload gagal: ' + (err?.message || 'Unknown error'));
    } finally {
      setUploading((prev) => {
        const copy = { ...prev };
        delete copy[motorId];
        return copy;
      });
    }
  };

  // =========================
  // UI
  // =========================
  if (loading) {
    return (
      <main
        style={{
          padding: 30,
          fontFamily: 'Arial',
          background: '#0b0b0b',
          minHeight: '100vh',
          color: 'white',
        }}
      >
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 30,
        fontFamily: 'Arial',
        background: '#0b0b0b',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>
        Admin - List Motor Masuk
      </h1>

      <p style={{ marginTop: 10, marginBottom: 20, opacity: 0.85 }}>
        Halaman ini untuk update progres motor yang sedang dikerjakan.
      </p>

      {/* MENU BUTTON */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => router.push('/admin/add')}
          style={{
            padding: '10px 14px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ➕ Tambah Motor
        </button>

        <button
          onClick={loadData}
          style={{
            padding: '10px 14px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🔄 Refresh Data
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: '10px 14px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🚪 Logout
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {motors.length === 0 && (
        <p style={{ opacity: 0.8 }}>Belum ada motor masuk.</p>
      )}

      {motors.map((m) => (
        <div
          key={m.id}
          style={{
            border: '1px solid #333',
            padding: 18,
            borderRadius: 14,
            marginBottom: 20,
            maxWidth: 980,
            background: '#111',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>
            {m.name || 'Motor'} — {m.plate} ({m.code})
          </h2>

          <p style={{ marginTop: 8, opacity: 0.9 }}>
            <b>WA:</b> {m.wa || '-'}
          </p>

          <p style={{ marginTop: 8 }}>
            <b>Progress:</b> {m.progress || 0}%
          </p>

          {/* PROGRESS BUTTON */}
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <button onClick={() => changeProgress(m.id, m.progress || 0, -10)}>
              -10%
            </button>

            <button onClick={() => changeProgress(m.id, m.progress || 0, 10)}>
              +10%
            </button>

            <button onClick={() => updateField(m.id, 'progress', 100)}>
              ✅ Selesai (100%)
            </button>
          </div>

          {/* FOTO */}
          <div style={{ marginTop: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>
              📸 Foto Before / Process / After
            </h3>

            {uploading[m.id] && (
              <p style={{ marginTop: 8, color: 'yellow' }}>
                {uploading[m.id]}
              </p>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 14,
                marginTop: 12,
              }}
            >
              {/* BEFORE */}
              <div
                style={{
                  border: '1px solid #222',
                  padding: 12,
                  borderRadius: 12,
                  background: '#0d0d0d',
                }}
              >
                <b>Before</b>

                <div style={{ marginTop: 10 }}>
                  {m.photoBefore ? (
                    <img
                      src={m.photoBefore}
                      alt="Before"
                      style={{
                        width: '100%',
                        height: 160,
                        objectFit: 'cover',
                        borderRadius: 10,
                        border: '1px solid #222',
                      }}
                    />
                  ) : (
                    <p style={{ opacity: 0.7, marginTop: 10 }}>Belum ada foto</p>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  style={{ marginTop: 10, width: '100%' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleUploadPhoto(m.id, 'before', file);
                  }}
                />
              </div>

              {/* PROCESS */}
              <div
                style={{
                  border: '1px solid #222',
                  padding: 12,
                  borderRadius: 12,
                  background: '#0d0d0d',
                }}
              >
                <b>Process</b>

                <div style={{ marginTop: 10 }}>
                  {m.photoProcess ? (
                    <img
                      src={m.photoProcess}
                      alt="Process"
                      style={{
                        width: '100%',
                        height: 160,
                        objectFit: 'cover',
                        borderRadius: 10,
                        border: '1px solid #222',
                      }}
                    />
                  ) : (
                    <p style={{ opacity: 0.7, marginTop: 10 }}>Belum ada foto</p>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  style={{ marginTop: 10, width: '100%' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleUploadPhoto(m.id, 'process', file);
                  }}
                />
              </div>

              {/* AFTER */}
              <div
                style={{
                  border: '1px solid #222',
                  padding: 12,
                  borderRadius: 12,
                  background: '#0d0d0d',
                }}
              >
                <b>After</b>

                <div style={{ marginTop: 10 }}>
                  {m.photoAfter ? (
                    <img
                      src={m.photoAfter}
                      alt="After"
                      style={{
                        width: '100%',
                        height: 160,
                        objectFit: 'cover',
                        borderRadius: 10,
                        border: '1px solid #222',
                      }}
                    />
                  ) : (
                    <p style={{ opacity: 0.7, marginTop: 10 }}>Belum ada foto</p>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  style={{ marginTop: 10, width: '100%' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleUploadPhoto(m.id, 'after', file);
                  }}
                />
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div style={{ marginTop: 18 }}>
            <label style={{ fontWeight: 'bold' }}>Status:</label>
            <input
              defaultValue={m.status || ''}
              onBlur={(e) => updateField(m.id, 'status', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                marginTop: 8,
                borderRadius: 10,
              }}
              placeholder="Contoh: Sedang dikerjakan"
            />
            <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              (Auto save setelah klik keluar dari input)
            </p>
          </div>

          {/* DETAIL */}
          <div style={{ marginTop: 18 }}>
            <label style={{ fontWeight: 'bold' }}>Detail Pengerjaan:</label>
            <textarea
              defaultValue={m.detail || ''}
              onBlur={(e) => updateField(m.id, 'detail', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                marginTop: 8,
                borderRadius: 10,
                minHeight: 100,
              }}
              placeholder="Contoh: Ganti kampas rem, service CVT, dll"
            />
            <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              (Auto save setelah klik keluar dari textarea)
            </p>
          </div>

          {/* DELETE */}
          <button
            onClick={() => handleDelete(m.id)}
            style={{
              marginTop: 16,
              padding: '10px 14px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🗑️ Hapus Data
          </button>
        </div>
      ))}
    </main>
  );
}

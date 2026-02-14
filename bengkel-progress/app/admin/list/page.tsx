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
  progress?: number;
  status?: string;
  detail?: string;

  // nomor WA pelanggan (format 62xxxx)
  phone?: string;

  // foto
  photoBefore?: string;
  photoProcess?: string;
  photoAfter?: string;
};

export default function AdminListPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [motors, setMotors] = useState<MotorData[]>([]);
  const [error, setError] = useState('');

  // state untuk loading upload per motor
  const [uploading, setUploading] = useState<Record<string, string>>({});

  // =============================
  // PROTEKSI HALAMAN ADMIN
  // =============================
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

  // =============================
  // LOAD DATA
  // =============================
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

  // =============================
  // LOGOUT
  // =============================
  const handleLogout = async () => {
    const ok = confirm('Yakin mau logout?');
    if (!ok) return;

    await signOut(auth);
    router.push('/admin/login');
  };

  // =============================
  // UPDATE FIELD
  // =============================
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

  // =============================
  // CHANGE PROGRESS
  // =============================
  const changeProgress = async (id: string, current: number, step: number) => {
    let next = (current || 0) + step;
    if (next < 0) next = 0;
    if (next > 100) next = 100;

    await updateField(id, 'progress', next);
    await loadData();
  };

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (id: string) => {
    const ok = confirm('Yakin hapus data ini?');
    if (!ok) return;

    try {
      await deleteDoc(doc(db, 'motors', id));
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Gagal hapus data.');
    }
  };

  // =============================
  // UPLOAD FOTO (Cloudinary)
  // =============================
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

  // =============================
  // KIRIM WHATSAPP
  // =============================
  const sendWhatsApp = (m: MotorData) => {
    if (!m.phone) {
      alert('Nomor WhatsApp pelanggan belum diisi!');
      return;
    }

    // Ambil angka saja
    const phone = m.phone.replace(/\D/g, '');

    if (!phone.startsWith('62')) {
      alert('Nomor WA harus format 62xxxx (tanpa +).');
      return;
    }

    const baseUrl = window.location.origin;
    const cekLink = `${baseUrl}/cek?code=${m.code || ''}`;

    const msg = `
Halo kak 👋

Update motor dari Bagus Restoration:

🛵 Motor: ${m.name || '-'}
📌 Plat: ${m.plate || '-'}
🔢 Kode: ${m.code || '-'}
📊 Progress: ${m.progress || 0}%
📝 Status: ${m.status || '-'}

Silakan cek detail & foto di sini:
${cekLink}

Terima kasih 🙏
    `.trim();

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return (
      <main style={{ padding: 30, fontFamily: 'Arial' }}>
        <h2>Loading...</h2>
      </main>
    );
  }

  // =============================
  // UI
  // =============================
  return (
    <main style={{ padding: 30, fontFamily: 'Arial', color: 'white' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>
        Admin - List Motor Masuk
      </h1>

      <p style={{ marginTop: 10, marginBottom: 20 }}>
        Halaman ini untuk update progres motor yang sedang dikerjakan.
      </p>

      {/* tombol */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
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

      {motors.length === 0 && <p>Belum ada motor masuk.</p>}

      {motors.map((m) => (
        <div
          key={m.id}
          style={{
            border: '1px solid #444',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            maxWidth: 950,
            background: '#111',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 'bold' }}>
            {m.name || 'Motor'} — {m.plate || '-'} ({m.code || '-'})
          </h2>

          <p style={{ marginTop: 10 }}>
            <b>Progress:</b> {m.progress || 0}%
          </p>

          {/* tombol progress */}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
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

          {/* tombol WA */}
          <button
            onClick={() => sendWhatsApp(m)}
            style={{
              marginTop: 12,
              padding: '10px 14px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            📲 Kirim Update WhatsApp ke Pelanggan
          </button>

          {/* =========================
              FOTO BEFORE/PROCESS/AFTER
             ========================= */}
          <div style={{ marginTop: 25 }}>
            <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>
              📸 Upload Foto (Before / Process / After)
            </h3>

            {uploading[m.id] && (
              <p style={{ marginTop: 8, color: 'yellow' }}>
                {uploading[m.id]}
              </p>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 14,
                marginTop: 12,
              }}
            >
              {/* BEFORE */}
              <div
                style={{
                  border: '1px solid #333',
                  padding: 12,
                  borderRadius: 12,
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
                    handleUploadPhoto(m.id, 'before', file);
                  }}
                />
              </div>

              {/* PROCESS */}
              <div
                style={{
                  border: '1px solid #333',
                  padding: 12,
                  borderRadius: 12,
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
                    handleUploadPhoto(m.id, 'process', file);
                  }}
                />
              </div>

              {/* AFTER */}
              <div
                style={{
                  border: '1px solid #333',
                  padding: 12,
                  borderRadius: 12,
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
                    handleUploadPhoto(m.id, 'after', file);
                  }}
                />
              </div>
            </div>
          </div>

          {/* NOMOR WA */}
          <div style={{ marginTop: 20 }}>
            <label style={{ fontWeight: 'bold' }}>No WhatsApp Pelanggan:</label>
            <input
              defaultValue={m.phone || ''}
              onBlur={(e) => updateField(m.id, 'phone', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                marginTop: 8,
                borderRadius: 8,
              }}
              placeholder="Contoh: 6281234567890"
            />
            <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              Format: 62xxxx (tanpa +, tanpa spasi)
            </p>
          </div>

          {/* STATUS */}
          <div style={{ marginTop: 20 }}>
            <label style={{ fontWeight: 'bold' }}>Status:</label>
            <input
              defaultValue={m.status || ''}
              onBlur={(e) => updateField(m.id, 'status', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                marginTop: 8,
                borderRadius: 8,
              }}
              placeholder="Contoh: Sedang dikerjakan"
            />
            <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              (Auto save setelah klik keluar dari input)
            </p>
          </div>

          {/* DETAIL */}
          <div style={{ marginTop: 20 }}>
            <label style={{ fontWeight: 'bold' }}>Detail Pengerjaan:</label>
            <textarea
              defaultValue={m.detail || ''}
              onBlur={(e) => updateField(m.id, 'detail', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                marginTop: 8,
                borderRadius: 8,
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
              marginTop: 15,
              padding: '10px 14px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            🗑️ Hapus Data
          </button>
        </div>
      ))}
    </main>
  );
}

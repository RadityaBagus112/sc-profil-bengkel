'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

export default function AdminEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);

  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [code, setCode] = useState('');
  const [wa, setWa] = useState('');

  const [status, setStatus] = useState('');
  const [detail, setDetail] = useState('');
  const [progress, setProgress] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // === base url untuk link cek ===
  const baseUrl = 'https://sc-profil-bengkel-app.vercel.app';

  const clampProgress = (val: number) => {
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  };

  const motorRef = useMemo(() => {
    if (!id) return null;
    return doc(db, 'motors', id);
  }, [id]);

  // proteksi admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/admin/login');
      else setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // ambil data
  useEffect(() => {
    const run = async () => {
      if (!motorRef) {
        setMsg('❌ ID motor tidak ditemukan di URL.');
        setFetching(false);
        return;
      }

      try {
        setFetching(true);

        const snap = await getDoc(motorRef);

        if (!snap.exists()) {
          setMsg('❌ Data motor tidak ditemukan.');
          setFetching(false);
          return;
        }

        const data: any = snap.data();

        setName(data?.name || '');
        setPlate(data?.plate || '');
        setCode(data?.code || '');
        setWa(data?.wa || '');

        setStatus(data?.status || '');
        setDetail(data?.detail || '');
        setProgress(Number(data?.progress || 0));
      } catch (err: any) {
        console.error(err);
        setMsg('❌ Gagal mengambil data: ' + (err?.message || 'Unknown error'));
      } finally {
        setFetching(false);
      }
    };

    run();
  }, [motorRef]);

  const cekLink = useMemo(() => {
    // cek page kamu: /cek
    // query code tetap kita kirim biar otomatis keisi kalau page cek support query
    // kalau tidak support query, tetap aman karena user bisa copy code
    const finalCode = (code || '').trim().toUpperCase();
    return `${baseUrl}/cek?code=${encodeURIComponent(finalCode)}`;
  }, [code]);

  const waNumber = useMemo(() => {
    // bersihin spasi dan tanda +
    return (wa || '').replace(/\s+/g, '').replace('+', '');
  }, [wa]);

  const handleSave = async () => {
    setMsg('');

    if (!motorRef) return setMsg('❌ Data tidak valid (id kosong).');
    if (!name.trim()) return setMsg('❌ Nama motor wajib diisi.');
    if (!plate.trim()) return setMsg('❌ Plat wajib diisi.');
    if (!code.trim()) return setMsg('❌ Kode cek wajib diisi.');
    if (!wa.trim()) return setMsg('❌ No WA wajib diisi.');

    try {
      setSaving(true);

      await updateDoc(motorRef, {
        name: name.trim(),
        plate: plate.trim().toUpperCase(),
        code: code.trim().toUpperCase(),
        wa: waNumber,

        status: status.trim(),
        detail: detail.trim(),
        progress: clampProgress(Number(progress) || 0),

        updatedAt: serverTimestamp(),
      });

      setMsg('✅ Data berhasil diupdate!');
    } catch (err: any) {
      console.error(err);
      setMsg('❌ Gagal update: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!motorRef) return;

    const ok = confirm('Yakin mau hapus data motor ini?');
    if (!ok) return;

    try {
      setSaving(true);
      await deleteDoc(motorRef);
      alert('✅ Data berhasil dihapus!');
      router.push('/admin/list');
    } catch (err: any) {
      console.error(err);
      alert('❌ Gagal hapus: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleWA = () => {
    if (!waNumber) return alert('No WA belum diisi.');

    const text = `Halo Kak 👋

Ini update dari Bagus Restoration.

📌 Motor: ${name || '-'}
🪪 Plat: ${plate || '-'}
📍 Status: ${status || '-'}
📊 Progress: ${progress || 0}%
📝 Detail: ${detail || '-'}

Cek progress di sini:
${cekLink}

Terima kasih 🙏`;

    const link = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(link, '_blank');
  };

  if (loading) {
    return (
      <main style={{ padding: 24, fontFamily: 'Arial', color: 'white' }}>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 20,
        fontFamily: 'Arial',
        background: 'linear-gradient(135deg, #0f172a, #111827)',
        color: 'white',
      }}
    >
      <div style={{ maxWidth: 650, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 'bold' }}>
              ✏️ Edit Data Motor
            </h1>
            <p style={{ opacity: 0.8, marginTop: 6 }}>
              Update progress, status, dan info pelanggan.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin/list')}
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.08)',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ⬅ Kembali
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 18,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {fetching ? (
            <p style={{ opacity: 0.85 }}>Mengambil data...</p>
          ) : (
            <>
              {/* NAMA */}
              <label style={{ fontWeight: 'bold' }}>Nama Motor</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Honda Vario 125"
                style={inputStyle}
              />

              {/* PLATE */}
              <label style={{ fontWeight: 'bold' }}>Plat Nomor</label>
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Contoh: R 1234 ABC"
                style={inputStyle}
              />

              {/* CODE */}
              <label style={{ fontWeight: 'bold' }}>Kode Cek</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Contoh: AB12CD"
                style={inputStyle}
              />

              {/* WA */}
              <label style={{ fontWeight: 'bold' }}>No WA Pelanggan</label>
              <input
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                placeholder="Contoh: 6281234567890"
                style={inputStyle}
              />
              <p style={{ fontSize: 12, opacity: 0.7, marginTop: -10 }}>
                Format wajib 62xxxx (tanpa spasi).
              </p>

              {/* STATUS */}
              <label style={{ fontWeight: 'bold' }}>Status</label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Contoh: Proses CVT"
                style={inputStyle}
              />

              {/* DETAIL */}
              <label style={{ fontWeight: 'bold' }}>Detail</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Contoh: Service CVT, ganti kampas rem..."
                style={{
                  ...inputStyle,
                  minHeight: 120,
                  resize: 'vertical',
                }}
              />

              {/* PROGRESS */}
              <label style={{ fontWeight: 'bold' }}>Progress (%)</label>
              <input
                type="number"
                value={progress}
                onChange={(e) =>
                  setProgress(clampProgress(Number(e.target.value)))
                }
                min={0}
                max={100}
                style={inputStyle}
              />

              {/* LINK CEK */}
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
                  Link cek progress (untuk WA):
                </p>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: 13,
                    wordBreak: 'break-all',
                  }}
                >
                  {cekLink}
                </div>
              </div>

              {/* BUTTONS */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginTop: 18,
                }}
              >
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={primaryBtn}
                >
                  {saving ? 'Menyimpan...' : '💾 Simpan Update'}
                </button>

                <button onClick={handleWA} style={waBtn}>
                  📲 WA Pelanggan
                </button>

                <button
                  onClick={handleDelete}
                  disabled={saving}
                  style={dangerBtn}
                >
                  🗑 Hapus
                </button>
              </div>

              {msg && (
                <p style={{ marginTop: 14, fontWeight: 'bold', color: 'yellow' }}>
                  {msg}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  borderRadius: 12,
  marginTop: 8,
  marginBottom: 16,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.08)',
  color: 'white',
  outline: 'none',
};

const primaryBtn: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 14,
  border: 'none',
  background: '#22c55e',
  color: 'black',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const waBtn: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 14,
  border: 'none',
  background: '#25D366',
  color: 'black',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const dangerBtn: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 14,
  border: 'none',
  background: '#ef4444',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
};

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function AdminAddPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [code, setCode] = useState('');
  const [wa, setWa] = useState('');

  const [status, setStatus] = useState('Motor masuk');
  const [detail, setDetail] = useState('');
  const [progress, setProgress] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // proteksi halaman admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const generateCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(random);
  };

  const clampProgress = (val: number) => {
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setMsg('');

    // validasi
    if (!name.trim()) return setMsg('❌ Nama motor wajib diisi.');
    if (!plate.trim()) return setMsg('❌ Plat nomor wajib diisi.');
    if (!code.trim()) return setMsg('❌ Kode cek wajib diisi.');
    if (!wa.trim()) return setMsg('❌ No WA pelanggan wajib diisi.');

    // pastikan user login
    if (!auth.currentUser) {
      setMsg('❌ Kamu belum login. Silakan login ulang.');
      router.push('/admin/login');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        plate: plate.trim().toUpperCase(),
        code: code.trim().toUpperCase(),
        wa: wa.trim(),

        status: status.trim(),
        detail: detail.trim(),
        progress: clampProgress(Number(progress) || 0),

        // foto
        photoBefore: '',
        photoProcess: '',
        photoAfter: '',

        createdAt: serverTimestamp(),
      };

      console.log('Simpan payload:', payload);

      await addDoc(collection(db, 'motors'), payload);

      setMsg('✅ Data berhasil ditambahkan!');

      // reset
      setName('');
      setPlate('');
      setCode('');
      setWa('');
      setStatus('Motor masuk');
      setDetail('');
      setProgress(0);

      // auto pindah ke list (lebih enak)
      setTimeout(() => {
        router.push('/admin/list');
      }, 800);
    } catch (err: any) {
      console.error('Gagal simpan:', err);

      // tampilkan error asli biar kelihatan
      setMsg('❌ Gagal menyimpan: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: 30, fontFamily: 'Arial', color: 'white' }}>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <main style={{ padding: 30, fontFamily: 'Arial', color: 'white' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Admin - Tambah Motor</h1>
      <p style={{ marginTop: 10, opacity: 0.8 }}>
        Tambahkan motor baru yang masuk bengkel.
      </p>

      <form onSubmit={handleSave} style={{ marginTop: 25, maxWidth: 520 }}>
        {/* NAMA */}
        <label style={{ fontWeight: 'bold' }}>Nama Motor</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Honda Vario 125"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 10,
            marginTop: 8,
            marginBottom: 16,
          }}
        />

        {/* PLATE */}
        <label style={{ fontWeight: 'bold' }}>Plat Nomor</label>
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Contoh: R 1234 ABC"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 10,
            marginTop: 8,
            marginBottom: 16,
          }}
        />

        {/* CODE */}
        <label style={{ fontWeight: 'bold' }}>Kode Cek</label>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Contoh: X9A21B"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
            }}
          />
          <button
            type="button"
            onClick={generateCode}
            style={{
              padding: '12px 14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🎲 Generate
          </button>
        </div>
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
          (Kode ini dipakai pelanggan untuk cek progress)
        </p>

        {/* WA */}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontWeight: 'bold' }}>No WA Pelanggan</label>
          <input
            value={wa}
            onChange={(e) => setWa(e.target.value)}
            placeholder="Contoh: 6281234567890"
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
            }}
          />
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            Format wajib pakai 62 (contoh: 628xxxx)
          </p>
        </div>

        {/* STATUS */}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Status</label>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Contoh: Motor masuk"
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
            }}
          />
        </div>

        {/* DETAIL */}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Detail</label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Contoh: Service CVT, ganti kampas rem..."
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
              minHeight: 110,
            }}
          />
        </div>

        {/* PROGRESS */}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Progress (%)</label>
          <input
            type="number"
            value={progress}
            onChange={(e) => setProgress(clampProgress(Number(e.target.value)))}
            min={0}
            max={100}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              marginTop: 8,
            }}
          />
        </div>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '12px 16px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Menyimpan...' : '💾 Simpan'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/list')}
            style={{
              padding: '12px 16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            📋 Ke List
          </button>
        </div>

        {msg && (
          <p style={{ marginTop: 16, fontWeight: 'bold', color: 'yellow' }}>
            {msg}
          </p>
        )}
      </form>
    </main>
  );
}

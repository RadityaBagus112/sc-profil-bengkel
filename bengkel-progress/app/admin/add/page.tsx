'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function AdminAddPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [code, setCode] = useState('');
  const [wa, setWa] = useState('');
  const [detail, setDetail] = useState('');

  // =========================
  // AUTH CHECK (SUPERR AMAN)
  // =========================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/admin/login');
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsub();
  }, [router]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    const ok = confirm('Yakin mau logout?');
    if (!ok) return;

    await signOut(auth);
    router.replace('/admin/login');
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    if (saving) return;

    // validasi sederhana
    if (!name.trim()) return alert('Nama motor wajib diisi.');
    if (!plate.trim()) return alert('Plat nomor wajib diisi.');
    if (!code.trim()) return alert('Kode motor wajib diisi.');
    if (!wa.trim()) return alert('Nomor WA wajib diisi.');

    try {
      setSaving(true);

      await addDoc(collection(db, 'motors'), {
        name: name.trim(),
        plate: plate.trim().toUpperCase(),
        code: code.trim().toUpperCase(),
        wa: wa.trim(),
        detail: detail.trim(),

        progress: 0,
        status: 'Masuk Bengkel',

        photoBefore: '',
        photoProcess: '',
        photoAfter: '',

        createdAt: serverTimestamp(),
      });

      alert('✅ Data berhasil ditambahkan!');
      router.push('/admin/list');
    } catch (err) {
      console.error(err);
      alert('❌ Gagal menyimpan data. Cek console.');
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UI LOADING (BIAR GAK BLANK DI HP)
  // =========================
  if (checkingAuth) {
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
        <h2 style={{ fontSize: 20, fontWeight: 'bold' }}>
          Loading admin...
        </h2>
        <p style={{ opacity: 0.8, marginTop: 10 }}>
          Sedang cek login...
        </p>
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
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>
            Admin - Tambah Motor
          </h1>
          <p style={{ opacity: 0.85, marginTop: 6 }}>
            Isi data motor yang masuk bengkel.
          </p>
        </div>

        {/* MENU BUTTON */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/admin/list')}
            style={{
              padding: '10px 14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            📋 List
          </button>

          <button
            onClick={() => router.push('/admin/add')}
            style={{
              padding: '10px 14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ➕ Add
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
      </div>

      {/* FORM CARD */}
      <div
        style={{
          maxWidth: 720,
          background: '#111',
          border: '1px solid #333',
          borderRadius: 16,
          padding: 18,
        }}
      >
        {/* INPUT */}
        <label style={{ fontWeight: 'bold' }}>Nama Motor</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Vario 160"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 12,
            marginTop: 8,
            marginBottom: 16,
          }}
        />

        <label style={{ fontWeight: 'bold' }}>Plat Nomor</label>
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Contoh: R 1234 ABC"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 12,
            marginTop: 8,
            marginBottom: 16,
          }}
        />

        <label style={{ fontWeight: 'bold' }}>Kode Motor (unik)</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Contoh: BR-001"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 12,
            marginTop: 8,
            marginBottom: 16,
          }}
        />
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: -10 }}>
          Kode ini dipakai customer untuk cek progress.
        </p>

        <div style={{ marginTop: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Nomor WhatsApp</label>
          <input
            value={wa}
            onChange={(e) => setWa(e.target.value)}
            placeholder="Contoh: 6281234567890"
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 12,
              marginTop: 8,
              marginBottom: 16,
            }}
          />
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: -10 }}>
            Pakai format 62 (contoh: 628xxx).
          </p>
        </div>

        <label style={{ fontWeight: 'bold' }}>Detail Pengerjaan (opsional)</label>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Contoh: service CVT, ganti kampas rem, dll"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 12,
            marginTop: 8,
            minHeight: 120,
          }}
        />

        {/* BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            marginTop: 18,
            padding: '12px 14px',
            fontWeight: 'bold',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Menyimpan...' : '💾 Simpan Data'}
        </button>

        <button
          onClick={() => router.push('/admin/list')}
          style={{
            width: '100%',
            marginTop: 10,
            padding: '12px 14px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ⬅️ Kembali ke List
        </button>
      </div>
    </main>
  );
}

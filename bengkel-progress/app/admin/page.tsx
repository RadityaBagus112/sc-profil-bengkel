'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminPage() {
  const [plate, setPlate] = useState('');
  const [code, setCode] = useState('');
  const [motorName, setMotorName] = useState('');
  const [status, setStatus] = useState('');
  const [detail, setDetail] = useState('');
  const [progress, setProgress] = useState<number>(0);

  const router = useRouter();

useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/admin/login');
    }
  });

  return () => unsub();
}, [router]);


  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');



  const handleAdd = async () => {
    setMsg('');

    if (!plate.trim() || !code.trim() || !motorName.trim()) {
      setMsg('⚠️ Plat, kode unik, dan nama motor wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'motors'), {
        plate: plate.toUpperCase().trim(),
        code: code.toUpperCase().trim(),
        motorName: motorName.trim(),
        status: status.trim() || 'Dalam pengerjaan',
        detail: detail.trim() || '-',
        progress: Number(progress) || 0,
        createdAt: serverTimestamp(),
      });

      setMsg('✅ Data motor berhasil ditambahkan!');

      // reset form
      setPlate('');
      setCode('');
      setMotorName('');
      setStatus('');
      setDetail('');
      setProgress(0);
    } catch (err) {
      console.error(err);
      setMsg('❌ Gagal menambahkan data. Cek console.');
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: 30, fontFamily: 'Arial', maxWidth: 600 }}>
      <h1 style={{ fontSize: 26, fontWeight: 'bold' }}>Admin Bengkel</h1>
      <p style={{ marginTop: 8, marginBottom: 20 }}>
        Tambah data motor masuk (Firestore: motors)
      </p>

      <div style={{ display: 'grid', gap: 10 }}>
        <input
          placeholder="Plat Nomor (contoh: R 1234 AB)"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Kode Unik (contoh: 4821)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Nama Motor (contoh: Vario 125)"
          value={motorName}
          onChange={(e) => setMotorName(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Status (contoh: Menunggu sparepart / Proses servis)"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 10 }}
        />

        <textarea
          placeholder="Detail pengerjaan (contoh: Ganti kampas rem, servis CVT)"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          style={{ padding: 10, minHeight: 90 }}
        />

        <input
          type="number"
          placeholder="Progress (0 - 100)"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          style={{ padding: 10 }}
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          style={{
            padding: 12,
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Menyimpan...' : 'Tambah Data'}
        </button>

        {msg && (
          <p style={{ marginTop: 10, fontWeight: 'bold' }}>
            {msg}
          </p>
        )}
      </div>
    </main>
  );
}

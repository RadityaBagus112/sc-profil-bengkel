'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type MotorData = {
  name?: string;
  plate?: string;
  code?: string;
  progress?: number;
  status?: string;
  detail?: string;

  photoBefore?: string;
  photoProcess?: string;
  photoAfter?: string;
};

export default function CekPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MotorData | null>(null);
  const [error, setError] = useState('');

  // auto isi code dari URL (?code=XXXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('code');
    if (c) setCode(c.toUpperCase());
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const q = query(
        collection(db, 'motors'),
        where('code', '==', code.toUpperCase().trim())
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setError('Data tidak ditemukan. Cek kode unik yang kamu masukkan.');
      } else {
        setResult(snap.docs[0].data() as MotorData);
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi error saat mengambil data.');
    }

    setLoading(false);
  };

  const progress = result?.progress || 0;

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0b0b0b',
        color: 'white',
        padding: 24,
        fontFamily: 'Arial',
      }}
    >
      {/* HEADER */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>
          🔧 Cek Progres Motor
        </h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          Masukkan kode unik yang diberikan admin bengkel untuk melihat progres,
          detail pengerjaan, dan foto.
        </p>

        {/* SEARCH BOX */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 14,
            background: '#121212',
            border: '1px solid #222',
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <input
            placeholder="Masukkan Kode Unik (contoh: A1B2)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{
              padding: 12,
              borderRadius: 10,
              border: '1px solid #333',
              outline: 'none',
              flex: 1,
              minWidth: 220,
              background: '#0f0f0f',
              color: 'white',
            }}
          />

          <button
            onClick={handleSearch}
            disabled={loading || !code.trim()}
            style={{
              padding: '12px 16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              borderRadius: 10,
              border: '1px solid #333',
              background: loading ? '#222' : '#1f6feb',
              color: 'white',
              minWidth: 120,
            }}
          >
            {loading ? 'Loading...' : 'Cek'}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 12,
              background: '#2a0f0f',
              border: '1px solid #4d1a1a',
              color: '#ffb4b4',
            }}
          >
            {error}
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div
            style={{
              marginTop: 22,
              padding: 20,
              borderRadius: 16,
              background: '#121212',
              border: '1px solid #222',
            }}
          >
            {/* TOP INFO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h2 style={{ fontSize: 22, fontWeight: 'bold' }}>
                {result.name || 'Motor'}{' '}
                <span style={{ opacity: 0.7, fontSize: 14 }}>
                  ({result.plate || '-'})
                </span>
              </h2>

              <p style={{ opacity: 0.85 }}>
                <b>Kode:</b> {result.code || '-'}
              </p>

              <p style={{ opacity: 0.85 }}>
                <b>Status:</b> {result.status || '-'}
              </p>
            </div>

            {/* PROGRESS */}
            <div style={{ marginTop: 18 }}>
              <p style={{ fontWeight: 'bold', marginBottom: 8 }}>
                Progress: {progress}%
              </p>

              <div
                style={{
                  width: '100%',
                  height: 14,
                  borderRadius: 999,
                  background: '#1b1b1b',
                  border: '1px solid #2a2a2a',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: progress >= 100 ? '#22c55e' : '#1f6feb',
                    transition: '0.3s',
                  }}
                />
              </div>
            </div>

            {/* DETAIL */}
            <div style={{ marginTop: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>
                📝 Detail Pengerjaan
              </h3>

              <div
                style={{
                  marginTop: 10,
                  padding: 14,
                  borderRadius: 12,
                  background: '#0f0f0f',
                  border: '1px solid #222',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  opacity: 0.9,
                }}
              >
                {result.detail || 'Belum ada detail pengerjaan.'}
              </div>
            </div>

            {/* FOTO */}
            <div style={{ marginTop: 22 }}>
              <h3 style={{ fontSize: 16, fontWeight: 'bold' }}>
                📸 Foto Pengerjaan
              </h3>

              <div
                style={{
                  marginTop: 12,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 14,
                }}
              >
                {/* BEFORE */}
                <div
                  style={{
                    borderRadius: 14,
                    border: '1px solid #222',
                    background: '#0f0f0f',
                    padding: 12,
                  }}
                >
                  <b>Before</b>
                  <div style={{ marginTop: 10 }}>
                    {result.photoBefore ? (
                      <img
                        src={result.photoBefore}
                        alt="Before"
                        style={{
                          width: '100%',
                          height: 180,
                          objectFit: 'cover',
                          borderRadius: 12,
                          border: '1px solid #222',
                        }}
                      />
                    ) : (
                      <p style={{ opacity: 0.6 }}>Belum ada foto</p>
                    )}
                  </div>
                </div>

                {/* PROCESS */}
                <div
                  style={{
                    borderRadius: 14,
                    border: '1px solid #222',
                    background: '#0f0f0f',
                    padding: 12,
                  }}
                >
                  <b>Process</b>
                  <div style={{ marginTop: 10 }}>
                    {result.photoProcess ? (
                      <img
                        src={result.photoProcess}
                        alt="Process"
                        style={{
                          width: '100%',
                          height: 180,
                          objectFit: 'cover',
                          borderRadius: 12,
                          border: '1px solid #222',
                        }}
                      />
                    ) : (
                      <p style={{ opacity: 0.6 }}>Belum ada foto</p>
                    )}
                  </div>
                </div>

                {/* AFTER */}
                <div
                  style={{
                    borderRadius: 14,
                    border: '1px solid #222',
                    background: '#0f0f0f',
                    padding: 12,
                  }}
                >
                  <b>After</b>
                  <div style={{ marginTop: 10 }}>
                    {result.photoAfter ? (
                      <img
                        src={result.photoAfter}
                        alt="After"
                        style={{
                          width: '100%',
                          height: 180,
                          objectFit: 'cover',
                          borderRadius: 12,
                          border: '1px solid #222',
                        }}
                      />
                    ) : (
                      <p style={{ opacity: 0.6 }}>Belum ada foto</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 14,
                borderTop: '1px solid #222',
                opacity: 0.7,
                fontSize: 13,
              }}
            >
              Jika ada pertanyaan, silakan hubungi admin bengkel.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

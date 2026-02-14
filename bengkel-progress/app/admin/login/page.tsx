'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/admin/list');
    } catch (err) {
      console.error(err);
      setError('Login gagal. Email / password salah.');
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: 30, fontFamily: 'Arial', maxWidth: 450 }}>
      <h1 style={{ fontSize: 26, fontWeight: 'bold' }}>Login Admin</h1>
      <p style={{ marginTop: 8, marginBottom: 20 }}>
        Masuk untuk mengelola data motor bengkel.
      </p>

      <div style={{ display: 'grid', gap: 10 }}>
        <input
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            padding: 12,
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

        {error && (
          <p style={{ color: 'red', fontWeight: 'bold', marginTop: 10 }}>
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          Progress Pengerjaan
        </h1>
        <p className="mt-3 text-white/70">
          Halaman ini akan menampilkan daftar progress pengerjaan motor.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/70">
            (Nanti kita sambungkan ke Firestore)
          </p>
        </div>
      </div>
    </main>
  );
}

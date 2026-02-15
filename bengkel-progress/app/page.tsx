import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07070A] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      {/* Container */}
      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-16">
        {/* Top nav */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-white/10 grid place-items-center border border-white/10">
              <span className="text-lg">🛠️</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide">
                Bagus Restoration
              </p>
              <p className="text-xs text-white/60">Progress Tracking</p>
            </div>
          </div>

          <Link
            href="/admin/login"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"
          >
            Admin
          </Link>
        </header>

        {/* Hero */}
        <section className="mt-12 md:mt-16 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Online • Cek progres motor kapan saja
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
              Bengkel motor yang{" "}
              <span className="text-white/70">rapi, transparan</span>, dan{" "}
              <span className="text-white/70">profesional</span>.
            </h1>

            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              Cek status pengerjaan motor kamu secara realtime, lengkap dengan
              progres, detail pekerjaan, dan foto (before / process / after).
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/cek"
                className="rounded-2xl bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-white/90 transition text-center"
              >
                🔍 Cek Progres Motor
              </Link>

              <Link
                href="/admin/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition text-center"
              >
                ⚙️ Masuk Admin
              </Link>
            </div>

            {/* Trust mini stats */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">+100</p>
                <p className="text-xs text-white/60 mt-1">Motor dikerjakan</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">Tepat</p>
                <p className="text-xs text-white/60 mt-1">Update progres</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">Rapi</p>
                <p className="text-xs text-white/60 mt-1">Dokumentasi foto</p>
              </div>
            </div>
          </div>

          {/* Preview card */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 md:p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white/90">
                Contoh Progres Pengerjaan
              </p>
              <span className="text-xs text-white/60">Realtime</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">📌 Diterima Bengkel</p>
                <p className="mt-1 text-xs text-white/60">
                  Motor sudah masuk, dilakukan pengecekan awal.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">🔧 Pembongkaran</p>
                <p className="mt-1 text-xs text-white/60">
                  Pengecekan mesin, kelistrikan, dan part yang rusak.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">🧪 Finishing</p>
                <p className="mt-1 text-xs text-white/60">
                  Final check, test jalan, dan motor siap diambil.
                </p>
              </div>

              {/* Progress bar */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Progress</p>
                  <p className="text-xs text-white/60">72%</p>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-white" />
                </div>

                <p className="mt-3 text-xs text-white/60">
                  Kamu bisa lihat foto before / process / after.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 md:mt-20 border-t border-white/10 pt-8 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Bagus Restoration • Dibuat dengan Next.js
          + Firebase
        </footer>
      </div>
    </main>
  );
}

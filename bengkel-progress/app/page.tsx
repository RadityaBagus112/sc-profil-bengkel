import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050507] text-white">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute left-[-200px] top-[40%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute right-[-200px] bottom-[-200px] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 grid place-items-center">
              <span className="text-lg">🛠️</span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                Bagus Restoration
              </p>
              <p className="text-xs text-white/60 leading-tight">
                Bengkel Progress Tracking
              </p>
            </div>
          </div>

          {/* tombol kanan atas */}
          <Link
            href="/cek"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            Cek Progres
          </Link>
        </header>

        {/* Hero */}
        <section className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Online • Transparan • Profesional
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
              Pantau progres motor{" "}
              <span className="text-white/60">lebih gampang</span>.
            </h1>

            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              Website ini dibuat untuk memudahkan pelanggan melihat status
              pengerjaan motor: detail servis, progres %, dan dokumentasi foto.
            </p>

            {/* Buttons utama */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/cek"
                className="rounded-2xl bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-white/90 transition text-center"
              >
                🔍 Cek Progres Motor
              </Link>

              {/* ROUTE ADMIN - jangan diubah */}
              <Link
                href="/admin"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition text-center"
              >
                ⚙️ Masuk Admin
              </Link>
            </div>

            {/* Admin quick menu */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/admin/add"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <p className="text-sm font-semibold">➕ Tambah Data</p>
                <p className="mt-1 text-xs text-white/60">
                  Input motor baru + progres.
                </p>
              </Link>

              <Link
                href="/admin/list"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <p className="text-sm font-semibold">📋 Data List</p>
                <p className="mt-1 text-xs text-white/60">
                  Cari & edit data motor.
                </p>
              </Link>

              <Link
                href="/cek"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <p className="text-sm font-semibold">📌 Cek Progres</p>
                <p className="mt-1 text-xs text-white/60">
                  Pelanggan cek status servis.
                </p>
              </Link>
            </div>

            {/* mini stats */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">Cepat</p>
                <p className="text-xs text-white/60 mt-1">Update progres</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">Rapi</p>
                <p className="text-xs text-white/60 mt-1">Data tersusun</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">Aman</p>
                <p className="text-xs text-white/60 mt-1">Admin terproteksi</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 md:p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white/90">
                Preview Progress Card
              </p>
              <span className="text-xs text-white/60">Realtime</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">Nama Motor</p>
                <p className="mt-1 text-xs text-white/60">
                  Honda Vario 125 • R 1234 XX
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">Status</p>
                <p className="mt-1 text-xs text-white/60">
                  Sedang pengerjaan • Servis mesin & CVT
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Progress</p>
                  <p className="text-xs text-white/60">70%</p>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[70%] rounded-full bg-white" />
                </div>

                <p className="mt-3 text-xs text-white/60">
                  Foto before / process / after tersedia.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">Aksi cepat</p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
                    Edit Data
                  </span>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
                    Kirim WA
                  </span>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
                    Copy Link
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 md:mt-20 border-t border-white/10 pt-8 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Bagus Restoration • Built with Next.js +
          Firebase + Cloudinary
        </footer>
      </div>
    </main>
  );
}

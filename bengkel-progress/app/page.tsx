import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07070A] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] left-[-200px] h-[520px] w-[520px] rounded-full bg-white/5 blur-[140px]" />
        <div className="absolute bottom-[-220px] right-[-220px] h-[520px] w-[520px] rounded-full bg-white/5 blur-[140px]" />
      </div>

      {/* Container */}
      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-16">
        {/* NAVBAR */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center border border-white/10">
              <span className="text-lg">🛠️</span>
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide">
                Bagus Restoration
              </p>
              <p className="text-xs text-white/60">
                Bengkel Progress Tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* route tetap */}
            <Link
              href="/cek"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Cek Progres
            </Link>

            {/* route tetap */}
            <Link
              href="/admin/login"
              className="rounded-2xl bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition"
            >
              Admin
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="mt-14 md:mt-16 grid gap-12 md:grid-cols-2 md:items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Online • Transparan • Profesional
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
              Cek progres motor kamu{" "}
              <span className="text-white/60">kapan saja</span>.
            </h1>

            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              Website ini dibuat untuk memudahkan pelanggan melihat status
              pengerjaan motor: progres %, detail servis, serta dokumentasi foto
              before / process / after.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/cek"
                className="rounded-2xl bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition text-center"
              >
                🔍 Cek Progres Motor
              </Link>

              <Link
                href="/admin/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition text-center"
              >
                ⚙️ Masuk Admin
              </Link>
            </div>

            {/* MINI STATS */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">Realtime</p>
                <p className="text-xs text-white/60 mt-1">
                  Update status cepat
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">Rapi</p>
                <p className="text-xs text-white/60 mt-1">
                  Data tersusun otomatis
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold">Aman</p>
                <p className="text-xs text-white/60 mt-1">
                  Admin terproteksi login
                </p>
              </div>
            </div>

            {/* QUICK MENU */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/add"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <p className="text-sm font-semibold">➕ Tambah Motor</p>
                <p className="mt-1 text-xs text-white/60">
                  Input data motor baru + kode cek.
                </p>
              </Link>

              <Link
                href="/admin/list"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <p className="text-sm font-semibold">📋 Admin List</p>
                <p className="mt-1 text-xs text-white/60">
                  Cari, edit, upload foto, kirim WA.
                </p>
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 md:p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white/90">
                Preview Progress
              </p>
              <span className="text-xs text-white/60">Customer View</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">🛵 Honda Vario 125</p>
                <p className="mt-1 text-xs text-white/60">
                  Plat: R 1234 ABC • Kode: X9A21B
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">📍 Status</p>
                <p className="mt-1 text-xs text-white/60">
                  Sedang pengerjaan • Servis CVT + ganti kampas
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Progress</p>
                  <p className="text-xs text-white/60">72%</p>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-white" />
                </div>

                <p className="mt-3 text-xs text-white/60">
                  Foto before / process / after bisa dilihat pelanggan.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">✨ Fitur</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/70">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    🔍 Cek via kode
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    📲 Kirim WA
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    🖼 Upload foto
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    ✏️ Edit progres
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm font-semibold">📌 Tips</p>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                  Pelanggan cukup masukkan kode cek untuk melihat progres. Admin
                  tinggal update status & upload foto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section className="mt-14 md:mt-20">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            Kenapa sistem ini berguna?
          </h2>
          <p className="mt-2 text-white/60 max-w-2xl">
            Biar pelanggan tenang, bengkel lebih profesional, dan komunikasi
            lebih rapi.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold">📌 Transparansi</p>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                Pelanggan bisa cek status tanpa harus chat berkali-kali.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold">🧾 Dokumentasi</p>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                Foto before/process/after bikin pengerjaan lebih jelas.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold">⚡ Efisiensi</p>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                Admin cukup update sekali, pelanggan langsung lihat.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-16 md:mt-24 border-t border-white/10 pt-8 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Bagus Restoration • Built with Next.js +
          Firebase + Cloudinary
        </footer>
      </div>
    </main>
  );
}

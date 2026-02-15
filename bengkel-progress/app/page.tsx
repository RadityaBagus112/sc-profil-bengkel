export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-[10%] top-[35%] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-[10%] top-[55%] h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center">
              <span className="text-sm font-semibold">BR</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">
                Bagus Restoration
              </p>
              <p className="text-xs text-white/60">Bengkel Motor Restorasi</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a href="#fitur" className="hover:text-white transition">
              Fitur
            </a>
            <a href="#progress" className="hover:text-white transition">
              Progress
            </a>
            <a href="#kontak" className="hover:text-white transition">
              Kontak
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/admin/login"
              className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition"
            >
              Admin
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 md:pt-24 md:pb-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Sistem transparan & rapi
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                Bengkel motor yang{" "}
                <span className="text-white/70">rapi</span>,{" "}
                <span className="text-white/70">transparan</span>, dan{" "}
                <span className="text-white/70">profesional</span>.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                Bagus Restoration membantu kamu melihat progress pengerjaan
                motor, riwayat servis, serta update foto pengerjaan secara jelas
                dan terpercaya.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/progress"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 transition"
                >
                  Lihat Progress
                </a>

                <a
                  href="#kontak"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Hubungi Bengkel
                </a>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs text-white/50">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-lg bg-white/10 ring-1 ring-white/10" />
                  Update realtime
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-lg bg-white/10 ring-1 ring-white/10" />
                  Bukti foto
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-lg bg-white/10 ring-1 ring-white/10" />
                  Riwayat servis
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="text-sm font-semibold">Contoh Progress</p>
                  <span className="text-xs text-white/50">Live</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">CBR 150R</p>
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300 ring-1 ring-green-500/20">
                        Selesai
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-white/60">
                      Servis besar + cek kelistrikan + ganti oli
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Vario 125</p>
                      <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-200 ring-1 ring-yellow-500/20">
                        Proses
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-white/60">
                      Bongkar CVT + pembersihan + cek belt
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">NMAX</p>
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200 ring-1 ring-blue-500/20">
                        Menunggu
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-white/60">
                      Menunggu sparepart datang
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/0 p-4">
                  <p className="text-xs text-white/60">
                    Semua update dikelola oleh admin bengkel dan bisa dilihat
                    customer kapan saja.
                  </p>
                </div>
              </div>

              <div className="absolute -right-10 -top-10 hidden h-40 w-40 rounded-full bg-white/10 blur-3xl md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Fitur yang bikin customer makin percaya
            </h2>
            <p className="mt-3 text-white/70">
              Ini bukan cuma website bengkel biasa. Ini sistem kerja bengkel yang
              terlihat profesional.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Update Foto Progress",
                desc: "Admin bisa upload foto pengerjaan langsung dari galeri HP.",
              },
              {
                title: "Status Transparan",
                desc: "Customer tahu motornya sedang dikerjakan, menunggu, atau selesai.",
              },
              {
                title: "Riwayat Servis",
                desc: "Setiap pekerjaan tercatat rapi. Cocok untuk repeat customer.",
              },
              {
                title: "Cepat & Ringan",
                desc: "Tampilan modern, loading cepat, enak dibuka dari HP.",
              },
              {
                title: "Admin Panel",
                desc: "Admin bisa tambah, edit, hapus data dengan aman.",
              },
              {
                title: "Cloudinary Upload",
                desc: "Upload foto tanpa Firebase Storage (gratis & stabil).",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
              >
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="mt-2 text-sm text-white/65 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress section */}
      <section id="progress" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Customer bisa lihat progress kapan saja
              </h2>
              <p className="mt-3 text-white/70 leading-relaxed">
                Kamu bisa kasih link ke customer. Mereka tinggal buka, langsung
                lihat update terbaru, status pengerjaan, dan foto-foto bukti.
              </p>

              <div className="mt-6 space-y-3 text-sm text-white/65">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white/60" />
                  Tidak perlu chat bolak-balik.
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white/60" />
                  Customer percaya karena ada bukti foto.
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white/60" />
                  Tampilan rapi bikin bengkel kamu naik kelas.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold">Contoh tampilan progress</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm font-semibold">Motor: Beat 2020</p>
                  <p className="mt-1 text-xs text-white/60">
                    Status: Proses - Bongkar CVT
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm font-semibold">Motor: Ninja 250</p>
                  <p className="mt-1 text-xs text-white/60">
                    Status: Menunggu - Sparepart
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <a
                  href="/progress"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 transition"
                >
                  Buka Halaman Progress
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* CTA / Kontak */}
<section id="kontak" className="relative border-t border-white/10">
  <div className="mx-auto max-w-6xl px-4 py-16">
    <div className="grid gap-6 md:grid-cols-2">


      {/* Left CTA */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-8 md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Siap bikin bengkel kamu terlihat profesional?
        </h2>
        <p className="mt-3 max-w-xl text-white/70 leading-relaxed">
          Mulai sekarang customer tidak cuma percaya dari omongan, tapi dari
          sistem yang jelas. Progress, status, dan bukti foto.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/628xxxxxxxxxx"
            target="_blank"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 transition"
            rel="noreferrer"
          >
            Chat WhatsApp
          </a>

          <a
            href="/progress"
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Lihat Progress
          </a>
        </div>

        <p className="mt-6 text-xs text-white/50">
          *Ganti link WhatsApp di kode ini dengan nomor bengkel kamu.
        </p>
      </div>

      {/* Right Info Card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm font-semibold">Alamat Bengkel</p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Bagus Restoration <br />
          Desa Kasegeran Rt 02/Rw 02 Kec.Cilongok Kab.Banyumas <br />
          Jawa Tengah, Indonesia
        </p>

        <div className="mt-6 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-white/50">Jam Buka</p>
            <p className="mt-1 text-sm font-semibold">
              Senin – Sabtu (08.00 – 17.00)
            </p>
            <p className="mt-1 text-xs text-white/60">Minggu: Libur</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-white/50">Layanan</p>
            <p className="mt-1 text-sm text-white/70">
              Servis ringan • Servis besar • Kelistrikan • CVT • Restoration
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://maps.app.goo.gl/vpiC942hEnFzx32N6"
            target="_blank"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 transition"
            rel="noreferrer"
          >
            📍Buka di Google Maps
          </a>

          <a
            href="tel:+62859126469320"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Telepon
          </a>
        </div>

        <p className="mt-5 text-xs text-white/50">
          *Ganti alamat & link maps sesuai lokasi bengkel kamu.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} Bagus Restoration. All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-sm text-white/60">
              <a href="/progress" className="hover:text-white transition">
                Progress
              </a>
              <a href="/admin/login" className="hover:text-white transition">
                Admin
              </a>
              <a href="#fitur" className="hover:text-white transition">
                Fitur
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

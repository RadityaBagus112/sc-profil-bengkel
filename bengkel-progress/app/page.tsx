'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
              🔧
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">
                Bagus Restoration
              </h1>
              <p className="text-xs text-white/60">Bengkel • Service • Detail</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#layanan" className="text-sm text-white/70 hover:text-white">
              Layanan
            </a>
            <a href="#keunggulan" className="text-sm text-white/70 hover:text-white">
              Keunggulan
            </a>
            <a href="#kontak" className="text-sm text-white/70 hover:text-white">
              Kontak
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cek"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Cek Progres
            </Link>

            <Link
              href="/admin/login"
              className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black hover:bg-white/90"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_55%)]" />

        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* TEXT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80">
                ⚡ Progres motor bisa dicek online
              </div>

              <h2 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
                Bengkel motor yang{' '}
                <span className="text-white/80">rapi, transparan,</span> dan
                profesional.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/70">
                Bagus Restoration menyediakan sistem cek progres motor berbasis
                kode. Pelanggan bisa melihat status pengerjaan, catatan admin,
                serta foto proses secara real-time.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/cek"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black hover:bg-white/90"
                >
                  🔍 Cek Progres Motor
                </Link>

                <a
                  href="https://wa.me/62859126469320"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold hover:bg-white/10"
                >
                  💬 Chat WhatsApp
                </a>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xl font-extrabold">+100</p>
                  <p className="mt-1 text-xs text-white/60">Motor dikerjakan</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xl font-extrabold">Tepat</p>
                  <p className="mt-1 text-xs text-white/60">Update progres</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xl font-extrabold">Rapi</p>
                  <p className="mt-1 text-xs text-white/60">Pengerjaan detail</p>
                </div>
              </div>
            </div>

            {/* CARD */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold">Contoh Progres Pengerjaan</h3>
              <p className="mt-2 text-sm text-white/70">
                Sistem pelanggan akan melihat status + catatan admin seperti ini.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  { title: 'Diterima Bengkel', desc: 'Motor masuk & dicatat.' },
                  { title: 'Pembongkaran', desc: 'Mulai cek bagian mesin.' },
                  { title: 'Pengerjaan', desc: 'Perbaikan / service berjalan.' },
                  { title: 'Finishing', desc: 'QC + persiapan penyerahan.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="mt-1 h-3 w-3 rounded-full bg-white/70" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                💡 Pelanggan cukup masukkan <b>kode</b> untuk melihat progres.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAYANAN */}
      <section id="layanan" className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold">Layanan Bengkel</h3>
            <p className="mt-2 text-white/70">
              Pengerjaan fokus rapi, aman, dan detail.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Service Ringan',
              desc: 'Tune up, ganti oli, cek rutin.',
            },
            {
              title: 'Service Besar',
              desc: 'Bongkar mesin, overhaul, perbaikan total.',
            },
            {
              title: 'Restoration & Detail',
              desc: 'Perbaikan body, detail finishing, cat ulang.',
            },
            {
              title: 'Kelistrikan',
              desc: 'Starter, lampu, aki, wiring.',
            },
            {
              title: 'CVT & Transmisi',
              desc: 'Beat, Vario, Scoopy, NMAX, dll.',
            },
            {
              title: 'Custom Request',
              desc: 'Request khusus sesuai kebutuhan pelanggan.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
            >
              <h4 className="text-lg font-bold">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section
        id="keunggulan"
        className="border-t border-white/10 bg-white/5"
      >
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h3 className="text-2xl font-extrabold">
            Kenapa Pilih Bagus Restoration?
          </h3>
          <p className="mt-2 text-white/70">
            Bukan cuma service — tapi sistemnya juga profesional.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              'Progres bisa dicek online kapan saja.',
              'Update foto proses pengerjaan.',
              'Catatan admin jelas & rapi.',
              'Komunikasi cepat via WhatsApp.',
              'Pengerjaan detail & bertanggung jawab.',
              'Lebih transparan, pelanggan lebih tenang.',
            ].map((text, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-black/30 p-6"
              >
                <p className="text-sm leading-relaxed text-white/80">✅ {text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h3 className="text-xl font-extrabold">Kontak & Lokasi</h3>

            <div className="mt-4 space-y-2 text-sm text-white/70">
              <p>
                <b className="text-white">Alamat:</b> Cilongok, Banyumas
                (Desa Kasegeran RT 02/RW02 Kec.Cilongok Kab.Banyumas)
              </p>
              <p>
                <b className="text-white">Jam buka:</b> Senin - Sabtu (08.00 -
                17.00)
              </p>
              <p>
                <b className="text-white">WhatsApp:</b> +62 859126469320
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://maps.app.goo.gl/vpiC942hEnFzx32N6"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold hover:bg-white/10"
              >
                📍 Buka Maps
              </a>

              <a
                href="https://wa.me/62859126469320"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black hover:bg-white/90"
              >
                💬 Chat WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-7">
            <h3 className="text-xl font-extrabold">Cara Cek Progres</h3>

            <ol className="mt-4 space-y-3 text-sm text-white/70">
              <li>1. Masuk menu <b className="text-white">Cek Progres</b></li>
              <li>2. Masukkan <b className="text-white">Kode Motor</b></li>
              <li>3. Lihat status + foto proses pengerjaan</li>
              <li>4. Jika ada pertanyaan, chat WhatsApp</li>
            </ol>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              ⚡ Sistem ini bikin pelanggan lebih tenang karena progres bisa
              dipantau tanpa harus datang ke bengkel.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Bagus Restoration — Sistem Progres Bengkel
      </footer>
    </main>
  );
}

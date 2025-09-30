import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">{/* Menggunakan bg-gray-50 untuk konsistensi */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-16 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-pretty text-4xl font-bold leading-tight md:text-5xl">Ayo lakukan pendaftaran online</h1>
          <p className="mt-4 text-muted-foreground">Cukup dengan klik ini</p>
          <div className="mt-6">
            <Link
              href="/daftar"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>

        <div className="grid place-items-center">
          <Image
            src="/placeholder.svg"
            alt="Ilustrasi pendaftaran"
            width={480}
            height={360}
            className="h-auto w-full max-w-[480px]"
          />
        </div>
      </section>

      {/* Hidden design reference images to keep assets referenced in code */}
      <div className="hidden">
        <img src="/images/ref-hero.png" alt="reference hero" />
        <img src="/images/ref-register.png" alt="reference register" />
        <img src="/images/ref-register-success.png" alt="reference register success" />
        <img src="/images/ref-dashboard.png" alt="reference dashboard" />
        <img src="/images/ref-login-required.png" alt="reference login required" />
      </div>
    </main>
  )
}

import SiteNavbar from "@/components/site-navbar"
import RegisterForm from "@/components/register-form"

export default function DaftarPage() {
  return (
    <main className="min-h-screen bg-[oklch(0.97_0_0)]">
      <SiteNavbar />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <RegisterForm />
      </section>
    </main>
  )
}

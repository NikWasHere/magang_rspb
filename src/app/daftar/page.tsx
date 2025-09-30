import RegisterForm from "@/components/register-form"

export default function DaftarPage() {
  return (
    <main className="min-h-screen bg-gray-50">{/* Menggunakan bg-gray-50 untuk konsistensi */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <RegisterForm />
      </section>
    </main>
  )
}

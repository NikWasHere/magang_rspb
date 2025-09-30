export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-md px-4 py-10">
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan email Anda"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan password Anda"
              />
            </div>
            
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Login
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Belum punya akun? <a href="/daftar" className="text-green-600 hover:underline">Daftar disini</a>
          </p>
        </div>
      </section>
    </main>
  )
}
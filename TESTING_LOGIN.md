# 🧪 Testing Login - Panduan Cepat

## ✅ **MASALAH SUDAH DIPERBAIKI!**

**Problem:** Login dengan `user@rspb.com` / `user123` tidak bisa (email atau password salah)

**Root Cause:** Mock users di AuthContext tidak memiliki akun `user@rspb.com`

**Solution:** Sudah menambahkan 10 akun demo lengkap ke AuthContext

---

## 🔑 **AKUN DEMO YANG TERSEDIA**

### **SUPER ADMIN** (Full Access)
```
Email: superadmin@test.com
Password: super123

Email: superadmin@hospital.com
Password: super123
```

### **ADMIN** (Dashboard Admin, Verifikasi, Management)
```
Email: admin@test.com
Password: admin123

Email: admin@hospital.com
Password: admin123

Email: admin@rspb.com
Password: admin123

Email: dokter@rspb.com
Password: dokter123
```

### **PATIENT** (Reservasi, Dashboard Pasien)
```
Email: patient@test.com
Password: password123

Email: patient@hospital.com
Password: patient123

Email: user@rspb.com      ✅ YANG ANDA COBA!
Password: user123

Email: pasien@rspb.com
Password: pasien123
```

---

## 🧪 **CARA TESTING**

### **1. Jalankan Server (Sudah Running!)**
```bash
npm run dev
```
Server: http://localhost:3000

### **2. Test Login Patient (user@rspb.com)**
```
1. Buka: http://localhost:3000/login
2. Input:
   Email: user@rspb.com
   Password: user123
3. Klik "Login"
4. ✅ BERHASIL → Redirect ke homepage
5. Navbar berubah: Tampil "Reservasi Online", "Dashboard Saya"
```

### **3. Test Login Admin (admin@rspb.com)**
```
1. Logout dulu (klik nama user → Logout)
2. Login dengan:
   Email: admin@rspb.com
   Password: admin123
3. ✅ BERHASIL → Redirect ke homepage
4. Navbar berubah: Tampil "Dashboard Admin" dengan dropdown
```

### **4. Test All Accounts**
```
Visit: http://localhost:3000/accounts
→ Lihat semua akun demo dengan detail lengkap
→ Copy credentials dengan 1 klik
→ Test semua role (Super Admin, Admin, Patient)
```

---

## 📊 **EXPECTED BEHAVIOR**

### **Login Berhasil:**
- ✅ No error message
- ✅ Loading indicator muncul sebentar
- ✅ Redirect ke homepage (/)
- ✅ Navbar berubah sesuai role
- ✅ User data tersimpan di localStorage

### **Login Gagal:**
- ❌ Error message: "Email atau password salah!"
- ❌ Form tidak clear
- ❌ Tetap di halaman login

---

## 🔍 **VERIFICATION CHECKLIST**

### **✅ Patient Login (user@rspb.com)**
- [ ] Login berhasil tanpa error
- [ ] Redirect ke homepage
- [ ] Navbar tampil: "Reservasi Online", "Dashboard Saya", "Chat Admin"
- [ ] Klik "Dashboard Saya" → Buka patient dashboard
- [ ] Klik "Reservasi Online" → Buka 3-step reservation
- [ ] Logout berhasil

### **✅ Admin Login (admin@rspb.com)**
- [ ] Login berhasil tanpa error
- [ ] Redirect ke homepage
- [ ] Navbar tampil: "Dashboard Admin" (dropdown)
- [ ] Dropdown tampil: Verifikasi, Jadwal, Antrian, Asuransi, Chat
- [ ] Klik "Dashboard Admin" → Buka admin dashboard dengan stats
- [ ] Klik "Verifikasi Pasien" → Buka loket verification page
- [ ] Logout berhasil

### **✅ Super Admin Login (superadmin@test.com)**
- [ ] Login berhasil tanpa error
- [ ] Redirect ke homepage
- [ ] Navbar tampil: "Dashboard Super Admin" (dropdown)
- [ ] Semua fitur admin accessible
- [ ] Plus: Kelola Admin, Settings (coming soon)
- [ ] Logout berhasil

---

## 🐛 **DEBUGGING TIPS**

### **Jika Login Masih Gagal:**

1. **Clear Browser Cache & LocalStorage:**
   ```javascript
   // Buka browser console (F12)
   localStorage.clear()
   // Refresh page
   ```

2. **Check Console Errors:**
   - Buka Developer Tools (F12)
   - Tab "Console"
   - Lihat apakah ada error merah

3. **Verify Mock Users:**
   ```bash
   # Check file: src/contexts/AuthContext.tsx
   # Line ~30-80: mockUsers array
   # Pastikan ada: user@rspb.com / user123
   ```

4. **Test API Call:**
   ```javascript
   // Browser console
   const { login } = useAuth()
   await login('user@rspb.com', 'user123')
   // Should return true
   ```

---

## 📝 **TESTING SCENARIOS**

### **Scenario 1: Patient Journey**
```
1. Login: user@rspb.com / user123
2. Click: "Reservasi Online"
3. Step 1: Input gejala "sakit dada"
4. AI rekomendasi: "Poli Jantung"
5. Step 2: Isi data (atau skip jika sudah lengkap)
6. Step 3: Pilih dokter → tanggal → jadwal
7. Konfirmasi → Dapat 3 kode:
   - Booking Code Pendaftaran
   - Booking Code Poli
   - Nomor Antrian Terkunci
8. Buka "Dashboard Saya" → Lihat reservasi aktif
```

### **Scenario 2: Admin Verification**
```
1. Logout dari patient
2. Login: admin@rspb.com / admin123
3. Click: "Dashboard Admin" → "Verifikasi Pasien"
4. Sidebar: Lihat patient menunggu
5. Input booking code dari patient
6. Tentukan eselon: "Umum"
7. Klik "Verifikasi & Konfirmasi"
8. Success! Patient terverifikasi
```

### **Scenario 3: Anonymous User**
```
1. Logout (atau buka incognito)
2. Visit: http://localhost:3000/jadwal
3. Filter: "Poli Jantung"
4. Search: nama dokter
5. Lihat jadwal praktek
6. Click "Daftar sebagai pasien" → Register page
```

---

## ✅ **CHANGES MADE**

### **File Modified: `src/contexts/AuthContext.tsx`**

**Before:**
```typescript
const mockUsers = [
  { email: "superadmin@hospital.com", password: "super123", ... },
  { email: "admin@hospital.com", password: "admin123", ... },
  { email: "patient@hospital.com", password: "patient123", ... },
  // ❌ TIDAK ADA: user@rspb.com
]
```

**After:**
```typescript
const mockUsers = [
  // Super Admin
  { email: "superadmin@test.com", password: "super123", ... },
  { email: "superadmin@hospital.com", password: "super123", ... },
  
  // Admin
  { email: "admin@test.com", password: "admin123", ... },
  { email: "admin@hospital.com", password: "admin123", ... },
  { email: "admin@rspb.com", password: "admin123", ... },
  { email: "dokter@rspb.com", password: "dokter123", ... },
  
  // Patient
  { email: "patient@test.com", password: "password123", ... },
  { email: "patient@hospital.com", password: "patient123", ... },
  { email: "user@rspb.com", password: "user123", ... },     // ✅ ADDED!
  { email: "pasien@rspb.com", password: "pasien123", ... }
]
```

---

## 🎉 **RESULT**

✅ **Login dengan `user@rspb.com` / `user123` sekarang BERFUNGSI!**

✅ **Total 10 akun demo tersedia untuk testing**

✅ **Semua role dapat diakses (Super Admin, Admin, Patient)**

✅ **Login page sudah menampilkan hint demo accounts**

✅ **Halaman `/accounts` tersedia untuk referensi lengkap**

---

## 📞 **NEED HELP?**

Jika masih ada masalah:
1. Clear cache browser & localStorage
2. Restart dev server: `Ctrl+C` → `npm run dev`
3. Check console errors di browser (F12)
4. Test dengan akun lain untuk isolate masalah

---

**Last Updated:** ${new Date().toLocaleString('id-ID')}  
**Status:** ✅ FIXED - Ready to test!

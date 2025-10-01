<h1 align="center">🩺 BackEnd Register Pasien</h1>

<p align="center">
  API Backend untuk registrasi pasien, manajemen poli dan dokter, serta pengaturan antrian di rumah sakit.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js">
  <img src="https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-316192?logo=postgresql">
  <img src="https://img.shields.io/badge/Multer-File%20Upload-orange">
  <img src="https://img.shields.io/badge/License-MIT-yellow">
</p>

---

## 📋 Fitur
- 🔐 **CRUD** untuk `users`, `dokters`, `polis`, `poli_dokter`, `registrations`
- 📷 Upload foto dokter (multer) + serving file statis
- 🔗 Relasi poli ↔ dokter
- 📦 API berbasis **Express + Prisma**
- 🗄 PostgreSQL sebagai database utama

---

## 🛠 Tech Stack
| Layer        | Teknologi           |
|--------------|--------------------|
| **Backend**  | Node.js, Express    |
| **ORM**      | Prisma              |
| **Database** | PostgreSQL          |
| **Upload**   | Multer              |
| **Lainnya**  | cors, dotenv        |

---

## 🚀 Instalasi & Menjalankan Project

### 1️⃣ Clone repository
```bash
git clone <repo-url>
cd BackEnd-Register-Pasien

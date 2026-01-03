# BAB 4

# TUGAS KHUSUS

## 4.1 Pendahuluan

### 4.1.1 Latar Belakang Masalah

Rumah Sakit Pertamina Balikpapan (RSPB) sebagai institusi pelayanan kesehatan memerlukan sistem informasi yang efisien untuk mengelola data pasien dan proses pendaftaran. Pada era digital saat ini, transformasi sistem manual menjadi sistem berbasis web menjadi kebutuhan mendesak untuk meningkatkan efisiensi pelayanan, mengurangi waktu tunggu pasien, dan meminimalkan kesalahan dalam pengelolaan data.

Sistem pendaftaran pasien konvensional yang masih menggunakan pencatatan manual atau sistem yang kurang terintegrasi sering menghadapi berbagai kendala seperti redundansi data, kesulitan dalam pencarian informasi pasien, dan proses administrasi yang memakan waktu lama. Selain itu, tidak adanya sistem tracking status pendaftaran membuat pasien kesulitan untuk memantau perkembangan proses pendaftaran mereka.

Untuk mengatasi permasalahan tersebut, diperlukan pengembangan sistem informasi pendaftaran pasien berbasis web yang modern, responsif, dan mudah digunakan. Sistem ini harus mampu mengakomodasi kebutuhan berbagai pihak mulai dari pasien, petugas administrasi, hingga manajemen rumah sakit. Dengan memanfaatkan teknologi web modern seperti Next.js untuk frontend, Express.js untuk backend, dan Prisma sebagai ORM, diharapkan dapat tercipta sistem yang robust, scalable, dan maintainable.

### 4.1.2 Rumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, maka dapat dirumuskan permasalahan sebagai berikut:

1. Bagaimana merancang dan mengimplementasikan sistem pendaftaran pasien berbasis web yang user-friendly dan efisien?
2. Bagaimana mengintegrasikan sistem frontend dan backend agar dapat berkomunikasi secara optimal?
3. Bagaimana menerapkan sistem autentikasi dan otorisasi yang aman untuk melindungi data pasien?
4. Bagaimana mengimplementasikan fitur tracking status pendaftaran pasien secara real-time?
5. Bagaimana merancang database yang efisien untuk menyimpan data pasien, dokter, dan poli dengan menggunakan Prisma ORM?

### 4.1.3 Tujuan Masalah

Tujuan dari pengembangan sistem ini adalah:

1. Mengembangkan sistem pendaftaran pasien berbasis web yang dapat meningkatkan efisiensi proses administrasi di Rumah Sakit Pertamina Balikpapan
2. Mengimplementasikan arsitektur aplikasi modern dengan pemisahan frontend dan backend yang jelas
3. Menerapkan sistem keamanan yang robust untuk melindungi data sensitif pasien
4. Menyediakan interface yang intuitif dan responsif untuk berbagai perangkat (desktop, tablet, mobile)
5. Membangun sistem manajemen data pasien yang terintegrasi dengan informasi dokter dan poli
6. Memberikan fitur tracking status pendaftaran yang memudahkan pasien memantau proses mereka
7. Menciptakan sistem yang scalable dan mudah dikembangkan untuk kebutuhan masa depan

### 4.1.4 Batasan Masalah

Agar pengembangan sistem lebih fokus dan terarah, maka ditetapkan batasan masalah sebagai berikut:

1. Sistem yang dikembangkan terbatas pada modul pendaftaran pasien, manajemen data dokter, dan manajemen poli
2. Sistem tidak mencakup modul medical record elektronik (EMR) yang lengkap
3. Sistem pembayaran tidak diintegrasikan dengan payment gateway eksternal
4. Sistem hanya mendukung bahasa Indonesia
5. Fitur notifikasi terbatas pada notifikasi dalam aplikasi (toast notification)
6. Upload dokumen dibatasi pada format gambar (JPG, PNG) dengan ukuran maksimal 5MB
7. Sistem dikembangkan untuk deployment pada environment development/staging
8. Integrasi dengan sistem legacy rumah sakit tidak termasuk dalam scope pengembangan

## 4.2 Tinjauan Pustaka

### 4.2.1 SQLite

SQLite adalah sistem manajemen basis data relasional (RDBMS) yang bersifat serverless, zero-configuration, dan transactional. SQLite merupakan database engine yang paling banyak digunakan di dunia, terutama untuk aplikasi embedded dan development environment (Owens, 2006).

**Karakteristik SQLite:**

- **Serverless**: Tidak memerlukan proses server terpisah, database langsung diakses sebagai file
- **Zero-configuration**: Tidak memerlukan instalasi atau administrasi database yang kompleks
- **Cross-platform**: File database dapat dipindahkan antar platform tanpa konversi
- **Compact**: Ukuran library yang kecil (< 600KB) cocok untuk embedded systems
- **ACID Compliant**: Mendukung transaksi yang atomic, consistent, isolated, dan durable

SQLite sangat cocok digunakan untuk tahap development dan testing karena kemudahan setup dan portabilitasnya. Dalam proyek ini, SQLite digunakan sebagai database development sebelum di-migrate ke PostgreSQL untuk production.

### 4.2.2 Prisma

Prisma adalah Next-generation ORM (Object-Relational Mapping) modern untuk Node.js dan TypeScript yang menyediakan cara yang type-safe untuk berinteraksi dengan database (Prisma Labs, 2024). Prisma terdiri dari tiga komponen utama:

**Komponen Prisma:**

1. **Prisma Client**: Auto-generated dan type-safe query builder untuk Node.js & TypeScript
2. **Prisma Migrate**: Sistem migrasi database yang declarative
3. **Prisma Studio**: GUI untuk melihat dan mengedit data dalam database

**Keunggulan Prisma:**

- Type-safety yang kuat dengan TypeScript support
- Auto-completion untuk query database
- Migrasi database yang mudah dan aman
- Support untuk multiple database (PostgreSQL, MySQL, SQLite, SQL Server, MongoDB)
- Generated documentation otomatis dari schema
- Performance yang optimal dengan lazy loading dan connection pooling

Dalam proyek ini, Prisma digunakan untuk mendefinisikan schema database, melakukan migrasi, dan sebagai interface untuk query database dari aplikasi backend.

```prisma
// Contoh Prisma Schema
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4.2.3 Node.js

Node.js adalah runtime environment JavaScript yang dibangun di atas Chrome V8 JavaScript engine, memungkinkan JavaScript untuk dijalankan di sisi server (Tilkov & Vinoski, 2010). Node.js menggunakan event-driven, non-blocking I/O model yang membuatnya lightweight dan efisien untuk aplikasi data-intensive real-time.

**Karakteristik Node.js:**

- **Asynchronous & Event-Driven**: Semua API bersifat asynchronous (non-blocking)
- **Single-Threaded**: Menggunakan single-threaded model dengan event looping
- **Highly Scalable**: Dapat menangani concurrent requests dalam jumlah besar
- **NPM Ecosystem**: Memiliki package manager terbesar dengan jutaan library
- **Cross-platform**: Berjalan di Windows, Linux, Unix, Mac OS X

**Kegunaan dalam Proyek:**
Node.js digunakan sebagai runtime environment untuk menjalankan server backend Express.js dan build tools untuk Next.js. Package manager npm digunakan untuk mengelola dependencies proyek.

### 4.2.4 React

React adalah JavaScript library untuk membangun user interfaces, khususnya untuk single-page applications (SPA). React dikembangkan oleh Meta (Facebook) dan merupakan salah satu library frontend paling populer di dunia (React Team, 2024).

**Konsep Inti React:**

1. **Components**: Building blocks dari aplikasi React, dapat berupa function atau class
2. **JSX (JavaScript XML)**: Syntax extension yang memungkinkan menulis HTML-like code dalam JavaScript
3. **Props**: Data yang dikirim dari parent component ke child component
4. **State**: Data internal component yang dapat berubah dan trigger re-render
5. **Hooks**: Functions yang memungkinkan menggunakan state dan lifecycle features dalam function components

**React Hooks yang Sering Digunakan:**

```javascript
// useState - untuk state management
const [count, setCount] = useState(0);

// useEffect - untuk side effects
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

// useContext - untuk global state
const user = useContext(AuthContext);
```

**Virtual DOM:**
React menggunakan Virtual DOM untuk optimasi performa. Ketika state berubah, React:

1. Membuat Virtual DOM tree baru
2. Membandingkan dengan Virtual DOM sebelumnya (diffing)
3. Hanya update bagian yang berubah di Real DOM (reconciliation)

**Keunggulan React:**

- **Component Reusability**: Komponen dapat digunakan kembali di berbagai bagian aplikasi
- **Declarative**: Mudah membuat interactive UI dengan code yang predictable
- **Large Ecosystem**: Banyak library dan tools pendukung
- **Strong Community**: Dokumentasi lengkap dan community support yang besar
- **React Developer Tools**: Tools untuk debugging dan profiling

Dalam proyek ini, React digunakan sebagai foundation library untuk membangun UI components di Next.js. Semua components seperti forms, modals, dan layouts dibangun menggunakan React functional components dengan hooks.

### 4.2.5 TypeScript

TypeScript adalah superset dari JavaScript yang menambahkan static typing dan fitur-fitur modern lainnya (Microsoft, 2024). TypeScript di-compile menjadi JavaScript murni dan dapat berjalan di environment manapun yang support JavaScript.

**Fitur Utama TypeScript:**

1. **Static Type Checking**: Mendeteksi error pada saat development, bukan runtime
2. **Type Inference**: TypeScript dapat menebak tipe data secara otomatis
3. **Interfaces & Types**: Mendefinisikan struktur object dan contract
4. **Generics**: Membuat reusable components yang type-safe
5. **Advanced Types**: Union types, intersection types, conditional types, dll

**Contoh TypeScript:**

```typescript
// Interface untuk type safety
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "patient";
}

// Function dengan type annotations
function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then((res) => res.json());
}

// Type untuk React component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

**Keuntungan TypeScript:**

- **Early Error Detection**: Catch bugs pada saat development
- **Better IDE Support**: Auto-completion, refactoring, navigation
- **Self-Documenting Code**: Types berfungsi sebagai documentation
- **Refactoring Confidence**: Safe refactoring dengan type checking
- **Team Collaboration**: Code contract yang jelas untuk tim

**TypeScript dalam Proyek:**
Dalam proyek ini, TypeScript digunakan di frontend (Next.js) untuk:

- Type-safe component props
- API response types
- Form data validation
- Service layer interfaces
- Context API types

Ini membantu mengurangi bugs dan meningkatkan developer experience dengan IntelliSense yang lebih baik.

### 4.2.6 Tailwind CSS

Tailwind CSS adalah utility-first CSS framework yang menyediakan low-level utility classes untuk membangun custom designs tanpa harus menulis CSS custom (Wathan, 2024). Berbeda dengan framework seperti Bootstrap yang menyediakan pre-built components, Tailwind memberikan building blocks untuk membuat design sistem sendiri.

**Prinsip Utility-First:**

```html
<!-- Contoh Tailwind CSS -->
<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Button
</button>
```

**Keunggulan Tailwind CSS:**

- **Highly Customizable**: Dapat dikonfigurasi sesuai design system
- **Responsive Design**: Built-in responsive utilities untuk berbagai breakpoint
- **Small Bundle Size**: PurgeCSS menghapus unused styles di production
- **Consistency**: Utility classes mendorong consistency dalam design
- **Development Speed**: Rapid prototyping tanpa context switching antara HTML dan CSS

Dalam proyek ini, Tailwind CSS digunakan untuk styling seluruh aplikasi frontend, termasuk responsive design dan dark mode support.

### 4.2.7 Next.js

Next.js adalah React framework yang menyediakan building blocks untuk membuat web applications dengan fitur seperti Server-Side Rendering (SSR), Static Site Generation (SSG), dan API routes (Vercel, 2024). Next.js dikembangkan oleh Vercel dan telah menjadi salah satu framework paling populer untuk production-ready React applications.

**Fitur Utama Next.js:**

1. **App Router**: Sistem routing berbasis file system dengan support untuk layouts, nested routes, dan loading states
2. **Server & Client Components**: Memisahkan komponen yang render di server dan client untuk optimasi
3. **Data Fetching**: Multiple strategi untuk fetching data (SSR, SSG, ISR, CSR)
4. **Image Optimization**: Automatic image optimization dengan next/image
5. **TypeScript Support**: First-class TypeScript support out of the box
6. **API Routes**: Membangun API endpoints dalam project Next.js

**Rendering Strategies:**

- **SSR (Server-Side Rendering)**: Page di-render di server untuk setiap request
- **SSG (Static Site Generation)**: Page di-render pada build time
- **ISR (Incremental Static Regeneration)**: Update static pages setelah deployment
- **CSR (Client-Side Rendering)**: Page di-render di browser

Dalam proyek ini, Next.js 14 dengan App Router digunakan untuk membangun frontend aplikasi, memanfaatkan Server Components untuk optimasi performa dan TypeScript untuk type safety.

### 4.2.8 Express

Express.js adalah minimal dan flexible Node.js web application framework yang menyediakan fitur robust untuk web dan mobile applications (StrongLoop, 2024). Express adalah de facto standard server framework untuk Node.js dan menjadi basis dari banyak framework lainnya.

**Fitur Express:**

- **Routing**: Sistem routing yang powerful dan flexible
- **Middleware**: Support untuk middleware stack untuk menangani requests
- **Template Engines**: Integrasi dengan berbagai template engines
- **HTTP Utility Methods**: Simplifikasi HTTP operations
- **Error Handling**: Mekanisme error handling yang comprehensive

**Arsitektur Middleware:**

```javascript
// Contoh middleware di Express
app.use(express.json());
app.use(authMiddleware);
app.use("/api/users", userRoutes);
```

Dalam proyek ini, Express digunakan untuk membangun RESTful API backend yang menangani:

- Authentication & Authorization
- CRUD operations untuk data pasien, dokter, poli
- File upload handling
- Error handling dan logging

### 4.2.9 JSON Web Token (JWT)

JSON Web Token (JWT) adalah open standard (RFC 7519) untuk securely transmitting information antara parties sebagai JSON object (Jones et al., 2015). JWT banyak digunakan untuk authentication dan information exchange dalam aplikasi web modern.

**Struktur JWT:**

JWT terdiri dari tiga bagian yang dipisahkan dengan titik (.):

```
header.payload.signature
```

1. **Header**: Berisi tipe token (JWT) dan algoritma hashing (HS256, RS256)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

2. **Payload**: Berisi claims (pernyataan tentang entity dan data tambahan)

```json
{
  "sub": "user123",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}
```

3. **Signature**: Verifikasi bahwa token tidak diubah

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

**Cara Kerja JWT Authentication:**

1. User login dengan credentials
2. Server memvalidasi dan menghasilkan JWT
3. Client menyimpan JWT (biasanya di localStorage/sessionStorage)
4. Client mengirim JWT di header untuk setiap request:
   ```
   Authorization: Bearer <token>
   ```
5. Server memverifikasi JWT sebelum memproses request

**Keunggulan JWT:**

- **Stateless**: Server tidak perlu menyimpan session
- **Scalable**: Mudah untuk horizontal scaling
- **Cross-Domain**: Dapat digunakan across different domains
- **Self-Contained**: Payload berisi semua informasi yang dibutuhkan
- **Compact**: Ukuran kecil, cocok untuk HTTP headers

**Security Considerations:**

- Jangan simpan data sensitif di payload (payload dapat di-decode)
- Gunakan HTTPS untuk transmit token
- Set expiration time yang reasonable
- Implementasi token refresh mechanism
- Validasi token signature di setiap request

**Implementasi dalam Proyek:**
Dalam proyek ini, JWT digunakan untuk:

- User authentication setelah login
- Authorization untuk protected routes
- Menyimpan user ID dan role dalam payload
- Token expiration 24 jam dengan refresh mechanism
- Middleware untuk validasi token di backend Express

```javascript
// Contoh generate JWT
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);

// Contoh verify JWT
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 4.2.10 RESTful API

REST (Representational State Transfer) adalah architectural style untuk designing networked applications (Fielding, 2000). RESTful API adalah API yang mengikuti prinsip-prinsip REST dan menggunakan HTTP methods untuk operasi CRUD.

**Prinsip REST:**

1. **Client-Server Architecture**: Pemisahan antara client dan server
2. **Stateless**: Setiap request berdiri sendiri, tidak ada session state di server
3. **Cacheable**: Response harus mendefinisikan apakah cacheable atau tidak
4. **Uniform Interface**: Interface yang konsisten untuk semua resources
5. **Layered System**: Arsitektur dapat terdiri dari multiple layers

**HTTP Methods dalam REST:**

| Method | Operation | Deskripsi                |
| ------ | --------- | ------------------------ |
| GET    | Read      | Mengambil data/resource  |
| POST   | Create    | Membuat resource baru    |
| PUT    | Update    | Update entire resource   |
| PATCH  | Update    | Update sebagian resource |
| DELETE | Delete    | Menghapus resource       |

**RESTful URL Design:**

```
# Resource Collections
GET    /api/users           # Get all users
POST   /api/users           # Create new user

# Individual Resources
GET    /api/users/123       # Get user with ID 123
PUT    /api/users/123       # Update user 123
DELETE /api/users/123       # Delete user 123

# Nested Resources
GET    /api/users/123/registrations  # Get registrations for user 123
POST   /api/users/123/registrations  # Create registration for user 123
```

**HTTP Status Codes:**

- **2xx Success**

  - 200 OK: Request berhasil
  - 201 Created: Resource berhasil dibuat
  - 204 No Content: Berhasil tanpa response body

- **4xx Client Errors**

  - 400 Bad Request: Request tidak valid
  - 401 Unauthorized: Authentication required
  - 403 Forbidden: Tidak ada permission
  - 404 Not Found: Resource tidak ditemukan

- **5xx Server Errors**
  - 500 Internal Server Error: Error di server
  - 503 Service Unavailable: Server tidak tersedia

**Best Practices:**

1. **Versioning**: `/api/v1/users`
2. **Filtering & Sorting**: `/api/users?role=admin&sort=name`
3. **Pagination**: `/api/users?page=2&limit=10`
4. **Consistent Naming**: Gunakan plural nouns untuk collections
5. **JSON Response**: Standard format untuk response

**Contoh Response Format:**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "User retrieved successfully"
}
```

**Implementasi dalam Proyek:**
Proyek ini mengimplementasikan RESTful API dengan:

- Resource-based URLs (`/api/users`, `/api/registrations`, `/api/dokters`)
- Proper HTTP methods untuk CRUD operations
- Standard HTTP status codes untuk responses
- JSON format untuk request dan response
- Error handling yang konsisten
- Authentication dengan JWT token

```javascript
// Contoh RESTful routes di Express
router.get("/api/users", userController.getAllUsers); // GET all
router.get("/api/users/:id", userController.getUserById); // GET one
router.post("/api/users", userController.createUser); // CREATE
router.put("/api/users/:id", userController.updateUser); // UPDATE
router.delete("/api/users/:id", userController.deleteUser); // DELETE
```

### 4.2.11 Git

Git adalah distributed version control system yang dirancang untuk menangani proyek dari skala kecil hingga sangat besar dengan kecepatan dan efisiensi (Chacon & Straub, 2014). Git dikembangkan oleh Linus Torvalds dan telah menjadi standar industri untuk version control.

**Konsep Dasar Git:**

- **Repository**: Database yang menyimpan history perubahan proyek
- **Commit**: Snapshot dari perubahan pada titik waktu tertentu
- **Branch**: Pointer movable ke commit, memungkinkan parallel development
- **Merge**: Menggabungkan perubahan dari berbagai branch
- **Remote**: Repository yang hosted di server (GitHub, GitLab)

**Workflow Git:**

```bash
# Basic Git workflow
git add .
git commit -m "Add feature"
git push origin main
```

**Keuntungan Menggunakan Git:**

- Version control untuk tracking perubahan code
- Collaboration yang efisien dalam tim
- Branching untuk feature development
- Backup code di remote repository
- Code review melalui pull requests

Dalam proyek ini, Git digunakan untuk version control dan GitHub sebagai remote repository untuk collaboration dan backup.

## 4.3 Metodologi

Pengembangan sistem pendaftaran pasien Rumah Sakit Pertamina Balikpapan menggunakan metodologi Agile dengan pendekatan iterative dan incremental. Berikut adalah tahapan yang dilakukan:

### 4.3.1 Analisis Kebutuhan

Tahap ini meliputi:

- **Requirement Gathering**: Mengidentifikasi kebutuhan fungsional dan non-fungsional sistem melalui observasi dan diskusi dengan stakeholder
- **Use Case Analysis**: Mendefinisikan actor (pasien, admin, dokter) dan interaksi mereka dengan sistem
- **User Story Mapping**: Membuat user stories untuk setiap fitur yang akan dikembangkan

**Kebutuhan Fungsional:**

1. Sistem login dan registrasi user
2. Form pendaftaran pasien dengan upload dokumen
3. Manajemen data dokter dan poli
4. Dashboard admin untuk melihat dan mengelola data
5. Tracking status pendaftaran
6. Profile management untuk user

**Kebutuhan Non-Fungsional:**

1. Responsive design untuk berbagai perangkat
2. Security: Autentikasi dan otorisasi
3. Performance: Load time < 3 detik
4. Usability: Interface yang intuitif
5. Maintainability: Code yang clean dan terdokumentasi

### 4.3.2 Perancangan Sistem

**A. Arsitektur Sistem**

Sistem dirancang dengan arsitektur client-server dengan pemisahan yang jelas antara frontend dan backend:

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│   Frontend      │         │   Backend       │         │   Database   │
│   (Next.js)     │◄───────►│   (Express)     │◄───────►│   (SQLite/   │
│   Port: 3000    │   HTTP  │   Port: 5000    │  Prisma │   PostgreSQL)│
└─────────────────┘   API   └─────────────────┘         └──────────────┘
```

**B. Database Schema Design**

Menggunakan Prisma Schema untuk mendefinisikan struktur database:

```prisma
// Core Models
- User: Data user untuk login
- Patient: Data pasien yang mendaftar
- Doctor: Data dokter
- Poli: Data poliklinik
- PoliDoctor: Relasi many-to-many antara poli dan dokter
- Registration: Data pendaftaran pasien
```

**C. API Design**

Merancang RESTful API endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/patients/*` - Patient data
- `/api/doctors/*` - Doctor data
- `/api/poli/*` - Poli data
- `/api/registrations/*` - Registration management

**D. UI/UX Design**

- Wireframing untuk setiap halaman
- Design system dengan Tailwind CSS
- Responsive breakpoints (mobile, tablet, desktop)
- Color scheme dan typography

### 4.3.3 Implementasi

**A. Setup Development Environment**

1. **Inisialisasi Project:**

   ```bash
   # Frontend
   npx create-next-app@latest magang_rspb

   # Backend
   mkdir BackEnd-Register-Pasien
   npm init -y
   ```

2. **Instalasi Dependencies:**

   - Frontend: Next.js, React, Tailwind CSS, TypeScript
   - Backend: Express, Prisma, bcrypt, jsonwebtoken, multer

3. **Konfigurasi:**
   - Next.js config untuk routing dan environment variables
   - Prisma schema dan connection
   - Tailwind config untuk custom theme

**B. Backend Development**

1. **Database Schema dengan Prisma:**

   ```bash
   npx prisma init
   npx prisma migrate dev --name init
   ```

2. **Implementasi Layered Architecture:**

   - **Routes Layer**: Mendefinisikan endpoints
   - **Controllers Layer**: Handle HTTP requests/responses
   - **Services Layer**: Business logic
   - **Middleware**: Authentication, upload, error handling

3. **Authentication System:**

   - Password hashing dengan bcrypt
   - JWT token generation dan validation
   - Protected routes dengan middleware

4. **File Upload System:**
   - Multer untuk handling multipart/form-data
   - Validasi file type dan size
   - Storage organization per document type

**C. Frontend Development**

1. **Setup Next.js App Router:**

   ```
   src/app/
   ├── layout.tsx          # Root layout
   ├── page.tsx            # Home page
   ├── login/              # Login page
   ├── buat-akun/          # Registration page
   ├── daftar/             # Patient registration form
   ├── dashboard/          # Admin dashboard
   └── ...
   ```

2. **State Management:**

   - React Context API untuk global state (AuthContext)
   - Local state dengan useState dan useEffect
   - Form state management

3. **Component Development:**

   - Reusable UI components (Button, Input, Card)
   - Feature components (Forms, Modals, Tables)
   - Layout components (Navbar, Footer, Sidebar)

4. **API Integration:**
   - Service layer untuk API calls
   - Error handling dan loading states
   - Token management untuk authenticated requests

**D. Integration**

1. **Frontend-Backend Communication:**

   - CORS configuration di backend
   - API base URL configuration
   - Token-based authentication

2. **File Upload Integration:**
   - FormData untuk multipart requests
   - Progress indication
   - Preview uploaded images

### 4.3.4 Testing

**A. Unit Testing**

- Testing individual functions dan components
- Mock data untuk isolated testing

**B. Integration Testing**

- Testing API endpoints dengan Postman/Thunder Client
- Testing frontend-backend integration

**C. User Acceptance Testing (UAT)**

- Testing dengan user scenarios
- Feedback collection dan iteration

**D. Bug Tracking**

- Dokumentasi bugs yang ditemukan
- Prioritization dan fixing

### 4.3.5 Deployment

**Development Deployment:**

1. Setup environment variables
2. Build optimization
3. Local server deployment untuk testing

**Tools & Technologies:**

- Version Control: Git & GitHub
- Code Editor: Visual Studio Code
- API Testing: Postman/Thunder Client
- Database GUI: Prisma Studio

## 4.4 Hasil dan Pembahasan

### 4.4.1 Hasil Implementasi

Sistem pendaftaran pasien Rumah Sakit Pertamina Balikpapan telah berhasil diimplementasikan dengan fitur-fitur sebagai berikut:

**A. Fitur Autentikasi**

1. **Login System**

   - Login dengan email dan password
   - JWT-based authentication
   - Session management dengan localStorage
   - Protected routes untuk halaman yang memerlukan autentikasi

   File: [login/page.tsx](magang_rspb/src/app/login/page.tsx)

2. **Registration System**

   - Form registrasi user baru
   - Validasi input (email format, password strength)
   - Password confirmation
   - Auto-redirect setelah registrasi sukses

   File: [buat-akun/page.tsx](magang_rspb/src/app/buat-akun/page.tsx)

**B. Fitur Pendaftaran Pasien**

1. **Form Pendaftaran Komprehensif**

   - Data pribadi (NIK, nama, tanggal lahir, gender)
   - Data kontak (alamat, telepon, email)
   - Upload dokumen (KTP, KK, Dokumen Tambahan)
   - Pemilihan poli tujuan
   - Validasi form dengan error messages

   File: [daftar/page.tsx](magang_rspb/src/app/daftar/page.tsx)
   Component: [patient-registration-form.tsx](magang_rspb/src/components/patient-registration-form.tsx)

2. **Upload Dokumen**

   - Support untuk multiple file types (JPG, PNG)
   - Preview gambar sebelum upload
   - Validasi ukuran file (max 5MB)
   - Organized storage struktur

   Backend: [upload.js](BackEnd-Register-Pasien/src/middleware/upload.js)

**C. Dashboard Admin**

1. **Manajemen Pasien**

   - Tabel daftar semua pasien terdaftar
   - Search dan filter functionality
   - Detail view dengan modal
   - Update status pendaftaran
   - View uploaded documents

   File: [admin/page.tsx](magang_rspb/src/app/admin/page.tsx)
   Component: [patient-modal.tsx](magang_rspb/src/components/dashboard/patient-modal.tsx)

2. **Sidebar Navigation**

   - Menu navigasi untuk berbagai fitur admin
   - Active state indication
   - Responsive design dengan toggle untuk mobile

   Component: [sidebar.tsx](magang_rspb/src/components/dashboard/sidebar.tsx)

**D. Manajemen Dokter dan Poli**

1. **Data Dokter**

   - List dokter dengan informasi lengkap (nama, spesialisasi, foto)
   - Detail dokter individual
   - Schedule dan poli yang ditangani

   File: [dokters/page.tsx](magang_rspb/src/app/dokters/page.tsx)
   Backend: [dokterController.js](BackEnd-Register-Pasien/src/controllers/dokterController.js)

2. **Data Poli**

   - List poliklinik yang tersedia
   - Dokter yang bertugas di setiap poli
   - Jadwal operasional

   Backend: [poliController.js](BackEnd-Register-Pasien/src/controllers/poliController.js)

**E. Fitur Tracking Status**

1. **Cek Status Pendaftaran**

   - Input NIK untuk tracking
   - Tampilan status pendaftaran (Menunggu, Diproses, Selesai)
   - Informasi detail pendaftaran

   File: [cek-status/page.tsx](magang_rspb/src/app/cek-status/page.tsx)

**F. User Profile Management**

1. **View Profile**

   - Tampilan informasi user
   - Data pendaftaran yang telah dilakukan

   File: [profile/page.tsx](magang_rspb/src/app/profile/page.tsx) (jika ada)

2. **Edit Profile**

   - Update informasi personal
   - Change password

   File: [profile/edit/page.tsx](magang_rspb/src/app/profile/edit/page.tsx)

### 4.4.2 Struktur Database

Database dirancang dengan Prisma ORM menggunakan relational model:

**Tabel Utama:**

1. **User** - Data akun user untuk login
2. **Patient** - Data pasien dengan relasi ke User
3. **Doctor** - Data dokter rumah sakit
4. **Poli** - Data poliklinik
5. **PoliDoctor** - Relasi many-to-many poli dan dokter
6. **Registration** - Data pendaftaran pasien

File: [schema.prisma](BackEnd-Register-Pasien/prisma/schema.prisma)

### 4.4.3 API Endpoints yang Diimplementasikan

**Authentication APIs:**

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout

**User APIs:**

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Patient/Registration APIs:**

- `POST /api/registrations` - Create new patient registration
- `GET /api/registrations` - Get all registrations
- `GET /api/registrations/:id` - Get registration by ID
- `PUT /api/registrations/:id` - Update registration
- `GET /api/registrations/nik/:nik` - Get registration by NIK

**Doctor APIs:**

- `GET /api/dokters` - Get all doctors
- `GET /api/dokters/:id` - Get doctor by ID
- `POST /api/dokters` - Create new doctor (admin)

**Poli APIs:**

- `GET /api/poli` - Get all poli
- `GET /api/poli/:id` - Get poli by ID

### 4.4.4 Pembahasan

**A. Keberhasilan Implementasi**

1. **Arsitektur yang Scalable**

   - Pemisahan frontend dan backend memungkinkan independent scaling
   - Layered architecture di backend memudahkan maintenance
   - Component-based development di frontend meningkatkan reusability

2. **Type Safety dengan TypeScript**

   - Mengurangi runtime errors
   - Better IDE support dengan auto-completion
   - Self-documenting code

3. **Modern UI/UX**

   - Responsive design bekerja di berbagai device
   - Konsisten dengan design system Tailwind CSS
   - Loading states dan error handling yang baik

4. **Security Implementation**
   - Password hashing dengan bcrypt
   - JWT authentication untuk protected routes
   - Input validation di frontend dan backend
   - File upload validation

**B. Tantangan yang Dihadapi**

1. **File Upload Handling**

   - Challenge: Handling multiple file uploads dengan preview
   - Solution: Implementasi multer di backend dan FormData di frontend dengan state management untuk preview

2. **State Management**

   - Challenge: Sharing authentication state across components
   - Solution: React Context API (AuthContext) untuk global state

3. **CORS Issues**

   - Challenge: Cross-origin requests antara frontend (port 3000) dan backend (port 5000)
   - Solution: Konfigurasi CORS middleware di Express dengan proper headers

4. **Database Relations**
   - Challenge: Complex relations antara User, Patient, Doctor, dan Poli
   - Solution: Prisma relation syntax dan proper foreign key constraints

**C. Kelebihan Sistem**

1. **User-Friendly Interface**: Interface yang intuitif dan mudah digunakan oleh berbagai kalangan user
2. **Responsive Design**: Dapat diakses dari berbagai perangkat
3. **Real-time Feedback**: Toast notifications untuk setiap action
4. **Secure**: Implementasi authentication dan authorization yang proper
5. **Maintainable Code**: Clean code dengan separation of concerns
6. **Type-Safe**: TypeScript mengurangi potential bugs

**D. Kekurangan dan Limitasi**

1. **Notifikasi**: Belum ada email notification untuk status update
2. **Real-time Updates**: Belum menggunakan WebSocket untuk real-time updates
3. **Advanced Search**: Fitur search masih basic, belum ada advanced filtering
4. **Reporting**: Belum ada fitur generate report/analytics
5. **Mobile App**: Belum ada native mobile application
6. **Integration**: Belum terintegrasi dengan sistem pembayaran atau EMR lengkap

**E. Rekomendasi Pengembangan Lanjutan**

1. **Notification System**: Implementasi email notification dengan service seperti SendGrid atau Nodemailer
2. **Real-time Features**: Integrasi Socket.io untuk real-time updates
3. **Analytics Dashboard**: Dashboard analytics untuk admin dengan charts dan statistics
4. **Payment Integration**: Integrasi dengan payment gateway
5. **Mobile Application**: Develop mobile app dengan React Native
6. **Advanced Security**: Implementasi 2FA, rate limiting, dan audit logs
7. **Performance Optimization**: Implement caching, lazy loading, dan code splitting
8. **Testing**: Comprehensive unit tests, integration tests, dan E2E tests
9. **Documentation**: API documentation dengan Swagger/OpenAPI
10. **Deployment**: Production deployment dengan proper CI/CD pipeline

### 4.4.5 Kesimpulan

Sistem pendaftaran pasien berbasis web untuk Rumah Sakit Pertamina Balikpapan telah berhasil diimplementasikan dengan menggunakan teknologi modern seperti Next.js, Express.js, dan Prisma ORM. Sistem ini berhasil memenuhi kebutuhan dasar untuk digitalisasi proses pendaftaran pasien dengan fitur-fitur utama seperti:

- Authentication dan authorization yang secure
- Form pendaftaran pasien yang komprehensif dengan upload dokumen
- Dashboard admin untuk manajemen data
- Tracking status pendaftaran
- Manajemen data dokter dan poli

Dengan arsitektur yang scalable dan maintainable, sistem ini dapat dikembangkan lebih lanjut untuk memenuhi kebutuhan yang lebih kompleks di masa depan. Penggunaan TypeScript dan framework modern memberikan foundation yang kuat untuk pengembangan berkelanjutan.

---

## DAFTAR PUSTAKA

Chacon, S., & Straub, B. (2014). _Pro Git_ (2nd ed.). Apress. https://git-scm.com/book/en/v2

Express.js. (2024). _Express - Node.js web application framework_. OpenJS Foundation. https://expressjs.com/

Fielding, R. T. (2000). _Architectural Styles and the Design of Network-based Software Architectures_ (Doctoral dissertation). University of California, Irvine.

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). _Design Patterns: Elements of Reusable Object-Oriented Software_. Addison-Wesley.

Fowler, M. (2018). _Refactoring: Improving the Design of Existing Code_ (2nd ed.). Addison-Wesley Professional.

Jones, M., Bradley, J., & Sakimura, N. (2015). _JSON Web Token (JWT)_. RFC 7519, IETF. https://datatracker.ietf.org/doc/html/rfc7519

Hogan, B. P. (2015). _Exercises for Programmers: 57 Challenges to Develop Your Coding Skills_. Pragmatic Bookshelf.

MDN Web Docs. (2024). _JavaScript | MDN_. Mozilla. https://developer.mozilla.org/en-US/docs/Web/JavaScript

Microsoft. (2024). _TypeScript: JavaScript With Syntax For Types_. Microsoft Corporation. https://www.typescriptlang.org/docs

Next.js Documentation. (2024). _Next.js by Vercel - The React Framework_. Vercel. https://nextjs.org/docs

Node.js Foundation. (2024). _Node.js®_. OpenJS Foundation. https://nodejs.org/

Owens, M. (2006). _The Definitive Guide to SQLite_. Apress.

Prisma. (2024). _Prisma | Next-generation ORM for Node.js & TypeScript_. Prisma Data, Inc. https://www.prisma.io/docs

React. (2024). _React - A JavaScript library for building user interfaces_. Meta Platforms, Inc. https://react.dev/

React Team. (2024). _React Documentation_. Meta Platforms, Inc. https://react.dev/learn

Sommerville, I. (2015). _Software Engineering_ (10th ed.). Pearson Education Limited.

StrongLoop. (2024). _Express.js Documentation_. IBM & StrongLoop. https://expressjs.com/

Tilkov, S., & Vinoski, S. (2010). Node.js: Using JavaScript to Build High-Performance Network Programs. _IEEE Internet Computing_, 14(6), 80-83.

Vercel. (2024). _Next.js 14 Documentation_. Vercel Inc. https://nextjs.org/

Wathan, A. (2024). _Tailwind CSS - Rapidly build modern websites without ever leaving your HTML_. Tailwind Labs Inc. https://tailwindcss.com/docs

W3C. (2023). _Web Content Accessibility Guidelines (WCAG) 2.1_. World Wide Web Consortium. https://www.w3.org/WAI/WCAG21/quickref/

---

**Catatan:**

- Semua URL terakhir diakses pada Desember 2025
- Referensi disesuaikan dengan standar penulisan ilmiah Indonesia
- Untuk keperluan akademis, pastikan mengikuti format sitasi yang ditentukan oleh institusi (APA, IEEE, Harvard, dll.)

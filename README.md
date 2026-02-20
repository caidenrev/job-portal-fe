# 🚀 LokerIn - Solusi Karir Masa Depan

LokerIn adalah platform rekrutmen modern yang menghubungkan talenta berbakat dengan perusahaan impian secara efisien, aman, dan transparan. Dibangun dengan fokus pada pengalaman pengguna (UX) yang premium dan keamanan data menggunakan infrastruktur cloud terkemuka.

---

## 👤 Executive Leadership
**CEO & Founder:**  
**Revan** - *Software & Cloud Engineer*

---

## 🛠️ Tech Stack

### Frontend (User Interface)
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 & Vanilla CSS
- **Components:** Shadcn UI & Radix UI
- **Icons:** Lucide React
- **Typography:** Google Sans
- **Animations:** Tailwind Animate & CSS Micro-animations

### Backend (Core Engine)
- **Runtime:** Node.js
- **Framework:** Express.js
- **DB ORM:** Prisma
- **Auth:** JSON Web Token (JWT) & Bcrypt hashing
- **File Handling:** Multer & Multer-S3

### Infrastructure & Cloud
- **Database:** AWS RDS (PostgreSQL)
- **File Storage:** AWS S3 Cloud Storage
- **Security:** S3 Bucket Policy & IAM Roles

---

## 🏗️ Architecture & App Flow

### System Architecture
LokerIn menggunakan arsitektur **Decoupled Frontend-Backend** untuk memastikan skalabilitas dan performa maksimal.
- **Client Side:** Menghandle rendering UI, state management auth di localStorage, dan interaksi dinamis.
- **Server Side:** Bertanggung jawab atas logika bisnis, validasi keamanan, hashing password, dan integrasi pihak ketiga (AWS).
- **Persistence Layer:** Data relasional disimpan di AWS RDS, sementara aset fisik (PDF/Gambar) disimpan secara terpisah di AWS S3.

### Application Flow
1. **Public/Guest Exploration:**
   - Pengunjung dapat mengeksplorasi Landing Page yang modern.
   - Pengunjung dapat melihat daftar lowongan pekerjaan secara publik di `/jobs`.
   - Pengunjung dapat mencoba melamar; jika belum login, sistem akan menampilkan **Inline Login Modal** (Pop-up) untuk transisi yang mulus.

2. **Applicant Journey:**
   - **Profile Completion:** Pelamar mengisi biodata (Bio, Skill, Pengalaman) dan mengunggah CV permanen sekali saja.
   - **1-Click Apply:** Dengan fitur "Auto-Apply", pelamar hanya perlu satu klik untuk melamar ke banyak pekerjaan tanpa perlu unggah ulang file.
   - **Application Tracking:** Melacak status lamaran (Pending, Interview, Accepted, Rejected) secara real-time.

3. **HR Management Performance:**
   - **Job Posting:** Membuat dan mempublikasikan lowongan pekerjaan baru.
   - **Candidate Management:** Dashboard khusus untuk melihat semua pelamar, mengunduh CV langsung dari S3, dan mengubah tahapan rekrutmen.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (or AWS RDS access)
- AWS Account (S3 access)

### Installation
1. Clone the repository
2. Install dependencies for both Frontend & Backend:
   ```bash
   # Root (Frontend)
   npm install
   # Server
   cd server && npm install
   ```
3. Configure environment variables (`.env`) in both directories.
4. Run development server:
   ```bash
   # Frontend
   npm run dev
   # Backend
   cd server && npm run dev
   ```

---
© 2026 LokerIn. Developed by **Revan**.

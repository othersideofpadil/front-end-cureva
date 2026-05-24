# Cureva Fisioterapi Frontend

Frontend aplikasi untuk sistem pemesanan layanan homecare fisioterapi Cureva. Aplikasi ini menyediakan alur pasien untuk booking layanan, memantau status pemesanan, menerima notifikasi, serta panel admin untuk mengelola booking, jadwal, pembayaran, pengguna, dan laporan.

## 🧭 Gambaran Aplikasi

Frontend Cureva dibangun sebagai satu aplikasi React yang melayani dua peran utama: pasien dan admin. Pasien fokus pada pencarian layanan, pembuatan booking, notifikasi, dan riwayat layanan. Admin menggunakan dashboard terpusat untuk memantau pemesanan, memperbarui status, melihat statistik, dan mengekspor laporan PDF.

Fokus implementasi frontend saat ini:

- Navigasi berbeda untuk pasien dan admin.
- Notifikasi real-time di navbar dan halaman notifikasi.
- Layout admin dengan sidebar, topbar notifikasi, dan halaman manajemen yang terintegrasi.
- Halaman laporan admin dengan grafik dan export PDF.

## 🚀 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Notifications:** React Hot Toast

## 📁 Struktur Folder

```
cureva-frontend/
├── public/
│   └── images/           # Static images
├── src/
│   ├── assets/           # Assets (images, fonts, etc.)
│   ├── components/       # Reusable components
│   │   ├── common/       # UI components
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── RatingCard.jsx
│   │   │   └── RatingModal.jsx
│   │   ├── layout/       # Layout components
│   │   │   ├── MainLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   └── sections/     # Landing page sections
│   │       ├── CTASection.jsx
│   │       ├── FisioterapisSection.jsx
│   │       ├── FooterSection.jsx
│   │       ├── HeroSection.jsx
│   │       ├── ReviewsSection.jsx
│   │       └── ServicesSection.jsx
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── LandingPage.jsx
│   │   ├── admin/        # Admin pages
│   │   ├── auth/         # Authentication pages
│   │   ├── booking/      # Booking pages
│   │   ├── dashboard/    # User dashboard
│   │   ├── jadwal/       # Schedule pages
│   │   ├── layanan/      # Services pages
│   │   ├── notifications/# Notification pages
│   │   ├── profile/      # Profile pages
│   │   └── ratings/      # Rating pages
│   ├── services/         # API services
│   │   ├── api.js        # Axios instance
│   │   ├── adminService.js
│   │   ├── authService.js
│   │   ├── bookingService.js
│   │   ├── jadwalService.js
│   │   ├── layananService.js
│   │   ├── notificationService.js
│   │   └── paymentService.js
│   ├── App.jsx           # Main app component
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Instalasi

### 1. Install Dependencies

```bash
cd cureva-frontend
npm install
```

### 2. Konfigurasi Environment

Buat file `.env` di root folder:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📜 Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build untuk production   |
| `npm run preview` | Preview production build |
| `npm run lint`    | Jalankan ESLint          |

## 📱 Halaman Aplikasi

### Public Pages

| Route              | Description          |
| ------------------ | -------------------- |
| `/`                | Landing page         |
| `/login`           | Login page           |
| `/register`        | Register page        |
| `/forgot-password` | Forgot password page |

### User Pages (Authenticated)

| Route            | Description        |
| ---------------- | ------------------ |
| `/dashboard`     | User dashboard     |
| `/bookings`      | Booking list       |
| `/bookings/new`  | Create new booking |
| `/bookings/:id`  | Booking detail     |
| `/layanan`       | Services list      |
| `/jadwal`        | Schedule view      |
| `/notifications` | Notifications      |
| `/profile`       | User profile       |
| `/ratings`       | Ratings & reviews  |

### Admin Pages

| Route             | Description          |
| ----------------- | -------------------- |
| `/admin`          | Admin dashboard      |
| `/admin/bookings` | Manage bookings      |
| `/admin/users`    | Manage users         |
| `/admin/layanan`  | Manage services      |
| `/admin/jadwal`   | Manage schedules     |
| `/admin/payments` | Manage payments      |
| `/admin/ratings`  | Manage ratings       |
| `/admin/reports`  | Reports & statistics |

## 🧩 Components

### Common Components

| Component        | Description                       |
| ---------------- | --------------------------------- |
| `Badge`          | Status badge dengan warna dinamis |
| `Button`         | Button dengan variants & loading  |
| `Card`           | Container card component          |
| `EmptyState`     | Empty state dengan icon & action  |
| `Input`          | Form input dengan label & error   |
| `LoadingSpinner` | Loading indicator                 |
| `Modal`          | Modal dialog                      |
| `RatingCard`     | Card untuk menampilkan rating     |
| `RatingModal`    | Modal untuk submit rating         |

### Layout Components

| Component        | Description                          |
| ---------------- | ------------------------------------ |
| `MainLayout`     | Layout utama dengan navbar & sidebar |
| `Navbar`         | Navigation bar                       |
| `Sidebar`        | Side navigation                      |
| `ProtectedRoute` | Route guard untuk auth               |

## ✨ Fitur Frontend Utama

- Landing page dengan section layanan, fisioterapis, ulasan, dan CTA.
- Booking flow untuk pasien dengan validasi slot dan detail layanan.
- Notification drawer/list dengan badge unread dan realtime update via socket.
- Admin dashboard dengan sidebar navigasi, preview notifikasi, dan halaman manajemen.
- Halaman reports admin yang menampilkan statistik operasional dan export PDF.

## 🔐 Authentication

Aplikasi menggunakan JWT token yang disimpan di localStorage:

```javascript
// Token disimpan setelah login
localStorage.setItem('token', accessToken);

// Token dikirim di setiap request
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Auth Context

```javascript
import { useAuth } from "./context/AuthContext";

const { user, login, logout, isAuthenticated } = useAuth();
```

## 🎨 Styling

Menggunakan Tailwind CSS 4 dengan konfigurasi default. Warna utama:

- **Primary:** Sky blue (`sky-500`, `sky-600`)
- **Secondary:** Slate (`slate-600`, `slate-800`)
- **Success:** Emerald (`emerald-500`)
- **Warning:** Amber (`amber-500`)
- **Danger:** Red (`red-500`)

## 📡 API Services

### Contoh Penggunaan

```javascript
import { bookingService, layananService } from "./services";

// Get all services
const layanan = await layananService.getAll();

// Create booking
const booking = await bookingService.create({
  id_layanan: 1,
  tanggal: "2026-01-20",
  waktu: "10:00",
  alamat: "Jl. Contoh No. 123",
  keluhan: "Sakit pinggang",
});

// Add rating
await bookingService.addRating(bookingId, 5, "Pelayanan sangat baik!");
```

## 🔔 Notifications

### Toast Notifications

```javascript
import toast from "react-hot-toast";

toast.success("Berhasil menyimpan!");
toast.error("Terjadi kesalahan");
toast.loading("Memproses...");
```

### Notification Badge

Navbar menampilkan jumlah notifikasi yang belum dibaca dengan badge merah.

### Admin Notification Preview

Di layout admin, ikon bell membuka panel preview notifikasi yang bisa ditutup dengan klik di luar panel atau tombol Escape. Item notifikasi admin mengarahkan ke halaman pemesanan untuk memudahkan tindak lanjut.

## 📊 Status Booking

| Status                | Badge Color | Description                   |
| --------------------- | ----------- | ----------------------------- |
| `menunggu_konfirmasi` | Yellow      | Menunggu konfirmasi admin     |
| `dikonfirmasi`        | Blue        | Sudah dikonfirmasi            |
| `dijadwalkan`         | Indigo      | Sudah dijadwalkan             |
| `dalam_perjalanan`    | Purple      | Fisioterapis dalam perjalanan |
| `sedang_berlangsung`  | Cyan        | Sesi sedang berlangsung       |
| `selesai`             | Green       | Booking selesai               |
| `ditolak`             | Red         | Booking ditolak               |
| `dibatalkan_pasien`   | Gray        | Dibatalkan oleh pasien        |
| `dibatalkan_sistem`   | Gray        | Dibatalkan oleh sistem        |

## 📄 Reports & Export

Halaman `/admin/reports` menampilkan ringkasan performa bisnis, grafik pendapatan, booking terbaru, dan tombol export PDF untuk mengunduh laporan langsung dari browser.

## ⭐ Rating System

User dapat memberikan rating setelah booking selesai:

- **Rating:** 1-5 bintang (wajib)
- **Review:** Text opsional (maksimal 500 karakter)
- Rating ditampilkan di halaman publik

## 🧑‍💻 Development

### Prerequisites

- Node.js 18+
- npm atau yarn

### Development Mode

```bash
npm run dev
```

### Build Production

```bash
npm run build
```

Output akan ada di folder `dist/`

### Preview Production Build

```bash
npm run preview
```

## 🔧 Environment Variables

| Variable                | Required | Description            |
| ----------------------- | -------- | ---------------------- |
| `VITE_API_URL`          | ✅       | Backend API URL        |
| `VITE_GOOGLE_CLIENT_ID` | ❌       | Google OAuth client ID |

## 📱 Responsive Design

Aplikasi dioptimalkan untuk:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 📄 License

MIT License - Cureva Fisioterapi © 2024-2026

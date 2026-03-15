# 🌶️ Janya Masala — Full MERN Stack Website

**Unjha's Famous Premium Spices — Complete Business Website**

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MongoDB URI
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📋 URLs
| URL | Description |
|-----|-------------|
| http://localhost:3000 | Public Website |
| http://localhost:3000/admin | Admin Dashboard |
| http://localhost:3000/admin/login | Admin Login |
| http://localhost:3000/retailer/login | Retailer Login |
| http://localhost:5000/api/health | API Health Check |

## 🔑 Default Admin Login
- **Email:** janyamasala@gmail.com
- **Password:** admin123

## 📁 Project Structure
```
janya-masala/
├── backend/
│   ├── models/          # MongoDB schemas (User, Product, Inquiry, Order)
│   ├── routes/          # Express API routes
│   ├── middleware/       # JWT auth middleware
│   ├── seeders/         # Auto-seed admin + sample products
│   └── server.js        # Main Express server
└── frontend/
    └── src/
        ├── pages/
        │   ├── public/  # Home, Products, Contact, Retailer pages
        │   ├── admin/   # Dashboard, Products, Inquiries, Orders, Retailers
        │   └── retailer/ # Retailer portal + ordering
        ├── components/  # Navbar, Footer, Admin/Retailer layouts
        └── context/     # Auth context (JWT)
```

## ✅ Features
- 🌐 **Public Website** — Home, Products, Contact, Retailer registration
- 🔐 **Admin Dashboard** — Stats, Charts, Product/Inquiry/Order/Retailer management
- 🤝 **Retailer Portal** — Browse products, add to cart, place orders, track status
- 📩 **Inquiry System** — Customers submit enquiries, admin manages them
- 💬 **WhatsApp Integration** — Direct WhatsApp links throughout
- 📊 **Analytics** — Revenue charts, order stats, inquiry tracking
- 🔑 **JWT Auth** — Secure admin + retailer authentication

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend:** React 18, Vite, React Router v6, Axios, Recharts, React Hot Toast
- **Design:** Custom CSS with Playfair Display + DM Sans fonts, brand colors

## 📞 Contact Info in Website
- 📍 Unjha, Gujarat
- 📞 +91 93284 54346
- ✉️ janyamasala@gmail.com

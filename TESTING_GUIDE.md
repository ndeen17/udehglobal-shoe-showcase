# 🧪 Testing Guide - Backend & Frontend Connection

## 📋 Prerequisites

1. **Backend running** on `http://localhost:5000`
2. **MongoDB** connected and running
3. **Admin user** created in database

---

## 🚀 Quick Start

### **1. Backend Setup**

```bash
cd udehglobal-backend

# Install dependencies (if not done)
npm install

# Start backend server
npm run dev
```

✅ Backend should be running on: `http://localhost:5000`

---

### **2. Frontend Setup**

```bash
# From project root
cd c:\Users\HP\Desktop\FESTUS\udehglobal-shoe-showcase

# Install dependencies (if not done)
npm install

# Start frontend development server
npm run dev
```

✅ Frontend should be running on: `http://localhost:5173` (or similar)

---

## 🔧 Environment Configuration

### **Frontend `.env` File:**
Located at: `c:\Users\HP\Desktop\FESTUS\udehglobal-shoe-showcase\.env`

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Environment
VITE_NODE_ENV=development
```

### **Change Backend URL:**
If your backend runs on a different port, update the `.env` file:
```env
VITE_API_BASE_URL=http://localhost:YOUR_PORT/api/v1
```

**Note:** After changing `.env`, restart the frontend dev server!

---

## ✅ Testing Checklist

### **1. Test Backend Connection**
Open browser console (F12) and navigate to frontend. Check for:
- ❌ No CORS errors
- ❌ No 404 errors on API calls
- ✅ API responses returning data

### **2. Test User Features**

#### **Authentication:**
- [ ] Register new user → Check user created in MongoDB
- [ ] Login with credentials → Check JWT token in localStorage
- [ ] Logout → Check token removed

#### **Products:**
- [ ] View products on homepage → Check data loads from backend
- [ ] View product details → Check individual product data loads
- [ ] Search products → Check search query works
- [ ] Filter by category → Check category filter works

#### **Cart:**
- [ ] Add product to cart (guest) → Check localStorage
- [ ] Add product to cart (logged in) → Check backend `/api/v1/cart`
- [ ] Update quantity → Check cart updates
- [ ] Remove item → Check cart updates
- [ ] Login merges guest cart → Check cart merge works

#### **Checkout:**
- [ ] Navigate to checkout → Check cart data loads
- [ ] Fill shipping form → Check validation
- [ ] Submit order → Check order created in MongoDB

#### **Orders:**
- [ ] View order history → Check `/api/v1/orders` returns user orders
- [ ] View order details → Check order details load

#### **Profile:**
- [ ] View profile → Check user data loads
- [ ] Edit profile → Check updates save to MongoDB
- [ ] Add address → Check address saves
- [ ] Edit address → Check address updates
- [ ] Delete address → Check address removes

---

### **3. Test Admin Features**

#### **Admin Access:**
- [ ] Navigate to `/admin` → Check redirects if not admin
- [ ] Login as admin → Check admin role validated
- [ ] View admin dashboard → Check stats load

#### **Product Management:**
- [ ] View products list → Check `/api/v1/admin/products` loads
- [ ] Create new product:
  - [ ] Fill form with all fields
  - [ ] Upload images (test primary + additional)
  - [ ] Submit → Check product created in MongoDB
  - [ ] Verify images saved to `udehglobal-backend/public/uploads/products/`
  - [ ] Check product appears in list
- [ ] Edit existing product:
  - [ ] Open edi  t form
  - [ ] Modify fields
  - [ ] Upload new images
  - [ ] Submit → Check updates saved
- [ ] Delete product:
  - [ ] Delete product with no orders → Check hard delete
  - [ ] Try deleting product with orders → Check soft delete (isActive=false)

#### **Category Management:**
- [ ] View categories → Check categories load
- [ ] Create category → Check category created
- [ ] Edit category → Check updates save
- [ ] Delete empty category → Check deletion works
- [ ] Try deleting category with products → Check error message

#### **Order Management:**
- [ ] View all orders → Check orders load
- [ ] Filter by status → Check filter works
- [ ] Update order status → Check status updates

#### **Customer Management:**
- [ ] View customers → Check users load
- [ ] Search customers → Check search works

---

## 🐛 Troubleshooting

### **CORS Errors:**
**Symptom:** Console shows "CORS policy" errors

**Solution:** Check backend CORS settings in `udehglobal-backend/src/index.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

---

### **404 Not Found:**
**Symptom:** API calls return 404

**Fixes:**
1. **Check backend is running** on `http://localhost:5000`
2. **Check `.env` file** has correct `VITE_API_BASE_URL`
3. **Restart frontend** after changing `.env`
4. **Check backend routes** are registered in `src/routes/index.ts`

---

### **Unauthorized Errors:**
**Symptom:** API returns 401 Unauthorized

**Fixes:**
1. **Check token exists** in localStorage (key: `authToken`)
2. **Check token format**: Should be `Bearer <token>`
3. **Check backend auth middleware** validates token correctly
4. **Re-login** to get fresh token

---

### **Images Not Loading:**
**Symptom:** Product images show broken image icon

**Fixes:**
1. **Check images uploaded** to `udehglobal-backend/public/uploads/products/`
2. **Check static file serving** in backend:
   ```typescript
   app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
   ```
3. **Check image URLs** in database (should be like `/uploads/products/filename.jpg`)
4. **Access image directly**: `http://localhost:5000/uploads/products/filename.jpg`

---

### **Database Connection Issues:**
**Symptom:** Backend logs show MongoDB connection errors

**Fixes:**
1. **Check MongoDB running**: Open MongoDB Compass or run `mongosh`
2. **Check `.env` in backend** has correct `MONGODB_URI`
3. **Check MongoDB connection string** format:
   ```
   MONGODB_URI=mongodb://localhost:27017/udehglobal-shoe-showcase
   ```

---

## 🎯 Manual Testing Workflow

### **Full E2E Test:**

```bash
# 1. Start backend
cd udehglobal-backend
npm run dev

# 2. In new terminal, start frontend
cd c:\Users\HP\Desktop\FESTUS\udehglobal-shoe-showcase
npm run dev

# 3. Open browser
# Navigate to: http://localhost:5173

# 4. Test User Flow:
- Register new account
- Browse products
- Add products to cart
- Checkout
- View order history

# 5. Test Admin Flow:
- Login as admin user
- Navigate to /admin
- Create product with images
- Create category
- View orders
- Update order status

# 6. Check MongoDB:
# Open MongoDB Compass
# Database: udehglobal-shoe-showcase
# Verify collections:
- users (new user registered)
- products (new product created)
- categories (new category created)
- orders (new order created)
- carts (cart data saved)
```

---

## 📊 Database Verification

### **Using MongoDB Compass:**
1. Connect to: `mongodb://localhost:27017`
2. Select database: `udehglobal-shoe-showcase`
3. Check collections:
   - `users` - User accounts
   - `products` - Product catalog
   - `categories` - Product categories
   - `orders` - Order history
   - `carts` - Shopping carts

### **Using mongosh (CLI):**
```bash
mongosh

use udehglobal-shoe-showcase

# View all collections
show collections

# Check users
db.users.find().pretty()

# Check products
db.products.find().pretty()

# Check orders
db.orders.find().pretty()

# Count documents
db.products.countDocuments()
db.orders.countDocuments()
```

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ **No console errors** in browser
✅ **Products load** on homepage from backend
✅ **User can register/login** successfully
✅ **Cart updates** persist to backend (when logged in)
✅ **Orders create** in MongoDB
✅ **Admin can create products** with images
✅ **Images display** correctly on product cards
✅ **Categories work** in filters
✅ **Search returns** correct results

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Check backend terminal for logs
3. Check MongoDB for data
4. Verify `.env` configuration
5. Ensure both servers are running

---

**Happy Testing! 🚀**

# Collaborative Workflow Management System

This is a full-stack collaborative workflow management system designed to manage projects, tasks, and users with role-based access control.

---

## 🛠️ Technologies Used

### Frontend:
- **React** with **Vite** for fast development.
- **TailwindCSS** for styling (configured in `postcss.config.js`).
- **SweetAlert2** for user-friendly alerts.

### Backend:
- **Node.js** with **Express** for server-side logic.
- **MongoDB** with **Mongoose** for database management.
- **JWT** for authentication.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (or **yarn**)
- **MongoDB** (local or cloud instance)

---

## 📦 Installation

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following:
   ```env
   JWT_SECRET=your-secret-key
   PORT=5000
   MONGO_URI=your-mongodb-connection-string
   ```

4. Start the backend server:
   ```bash
   npm run start
   ```

   The backend server will run on `http://localhost:5000`.

---

### run the seed file 
 node seed.js

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`.

---

## 🌐 Deployment

### Backend Deployment
1. Deploy the backend to a hosting platform like **Heroku**, **Render**, or **AWS**.
2. Set environment variables (`JWT_SECRET`, `MONGO_URI`,`PORT` etc.) in the hosting platform.

### Frontend Deployment
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to a static hosting platform like **Netlify**, **Vercel**, or **AWS S3**.

---

## 📄 License

This project is licensed under the MIT License.
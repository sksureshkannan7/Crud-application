# ⚡ Full-Stack CRUD App
**React.js + Node.js + PostgreSQL (Neon)**

---

## 📁 Project Structure

```
crud-app/
├── backend/
│   ├── src/
│   │   ├── server.js        ← Express server
│   │   ├── db.js            ← PostgreSQL connection
│   │   ├── init.sql         ← Run this in Neon dashboard
│   │   └── routes/
│   │       └── users.js     ← All CRUD API routes
│   ├── .env.example         ← Copy to .env and fill values
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx           ← Main component
    │   ├── api.js            ← All API calls
    │   ├── main.jsx          ← React entry point
    │   ├── index.css         ← Global styles
    │   └── components/
    │       ├── UserForm.jsx  ← Create / Edit form
    │       └── UserTable.jsx ← Display users table
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🗄️ STEP 1 — Set Up Neon Database

1. Go to **https://neon.tech** and create a free account
2. Click **"New Project"** → give it a name (e.g. `crud-app`)
3. Neon will create a database and show you a **connection string** like:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Copy that connection string — you'll need it in the next step

### Create the Table
5. In the Neon dashboard, click **"SQL Editor"**
6. Paste and run the contents of `backend/src/init.sql`
7. You should see a `users` table created ✅

---

## ⚙️ STEP 2 — Configure Backend

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
```

Now open `.env` and paste your Neon connection string:
```env
DATABASE_URL=postgresql://your_user:your_password@your_host.neon.tech/your_db?sslmode=require
PORT=5000
```

---

## 🚀 STEP 3 — Run the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to Neon PostgreSQL
🚀 Server running at http://localhost:5000
```

Test it in your browser: http://localhost:5000/api/users

---

## 🎨 STEP 4 — Run the Frontend

Open a **new terminal tab**:

```bash
cd frontend
npm install
npm run dev
```

Open your browser: **http://localhost:5173** 🎉

---

## 📡 API Endpoints

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | /api/users        | Get all users     |
| GET    | /api/users/:id    | Get one user      |
| POST   | /api/users        | Create a user     |
| PUT    | /api/users/:id    | Update a user     |
| DELETE | /api/users/:id    | Delete a user     |

### Example POST body:
```json
{
  "name": "Suresh Kannan",
  "email": "suresh@example.com",
  "role": "Developer"
}
```

---

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, Axios         |
| Backend   | Node.js, Express.js           |
| Database  | PostgreSQL via Neon (cloud)   |
| Styling   | Plain CSS with CSS variables  |
| Toasts    | react-hot-toast               |

---

## 🐛 Common Issues

**"Cannot connect to database"**
→ Check your DATABASE_URL in .env is correct and has `?sslmode=require` at the end

**"CORS error" in browser**
→ Make sure backend is running on port 5000 and frontend on port 5173

**"relation users does not exist"**
→ You forgot to run init.sql in the Neon dashboard SQL editor

---

Built with ❤️ by Suresh Kannan

# Leave Management System

A web-based Leave Management System built with React that allows employees to apply for leaves and admins to manage them.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router DOM
- JSON Server (mock backend)

## Features

**Employee**

- Login and access dashboard
- Apply for leave
- View leave history and status

**Admin**

- Login and access admin dashboard
- View all employee leave requests
- Approve or reject leaves

## Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── Dashboard.jsx
│   ├── LeaveForm.jsx
│   ├── LeaveHistory.jsx
│   └── AdminDashboard.jsx
├── services/
│   ├── authService.js
│   └── leaveService.js
├── utils/
│   └── helpers.js
├── App.jsx
└── main.jsx
```

## Getting Started

1. Clone the repo

```bash
git clone https://github.com/SiddhantDwivedi1/Leave-Management-System.git
cd Leave-Management-System
```

2. Install dependencies

```bash
npm install
```

3. Start JSON Server

```bash
npx json-server db.json --port 5000
```

4. Start the app

```bash
npm run dev
```

5. Open in browser

```
http://localhost:5174/
```

## Login Credentials

**Employee (1)**

- Email: siddhant@company.com
- Password: sid123

**Employee (2)**

- Email: rashi@company.com
- Password: rashi123

**Admin**

- Email: admin@company.com
- Password: admin123

## Author

Siddhant Dwivedi  
[GitHub](https://github.com/SiddhantDwivedi1) • [LinkedIn](https://linkedin.com/in/siddhantdwivedi25)

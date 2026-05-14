# Quanture - MERN Application

Quanture is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for trading and market analysis.

## Features
- User Authentication (JWT, Cookie-based)
- Dashboard for Market Insights
- Trade Management
- Watchlist Functionality
- Secure Profile Settings
- Email Notifications

## Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- npm or yarn

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/NeavPanjwani/MERN_application.git
cd MERN_application
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory based on `.env.example`.
- Fill in your MongoDB URI, JWT Secret, and Email credentials.

### 3. Frontend Setup
```bash
cd ../user_interface
npm install
```

### 4. Running the Application
**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd user_interface
npm start
```

## Security Measures
- **Helmet**: Secured HTTP headers.
- **Express Rate Limit**: Brute-force protection.
- **Environment Variables**: Sensitive data is managed via `.env` (not included in the repository).
- **CORS**: Configured for secure cross-origin requests.

## Lessons Learned & Security Improvements

During the development of this project, I made several critical mistakes that served as valuable learning opportunities for professional software engineering:

### 1. The Mistake: Leaking Sensitive Data
- **Problem**: I accidentally pushed `.env` files containing database credentials, JWT secrets, and email passwords to a public GitHub repository.
- **Consequence**: This exposed my private credentials to anyone on the internet, which could lead to unauthorized database access or service abuse.
- **Lesson**: Never track environment variables in Git. Always use `.gitignore` from the very first commit.
- **Solution**: I removed the `.env` files from Git tracking, added them to `.gitignore`, and rotated all exposed secrets to ensure security.

### 2. The Mistake: Committing Redundant Files
- **Problem**: I committed the `node_modules` directory to the repository.
- **Consequence**: This made the repository unnecessarily large (thousands of files) and difficult to manage, as these dependencies should be installed locally using `npm install`.
- **Lesson**: Keep repositories lightweight by only tracking source code. Use `.gitignore` to exclude package manager artifacts.
- **Solution**: I removed `node_modules` from the Git history and standardized the setup process using `package.json`.

### 3. The Mistake: Hardcoded API URLs
- **Problem**: I used `http://localhost:5000` directly in the frontend code.
- **Consequence**: The application would break when deployed to a different environment (like a production server) because it would still look for the API on the user's local machine.
- **Lesson**: Always use environment variables for configuration that changes between environments.
- **Solution**: I migrated all hardcoded URLs to `process.env.REACT_APP_API_URL`, making the application environment-agnostic.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

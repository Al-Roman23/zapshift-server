
# ⚡ ZapShift - Parcel Delivery Platform (Server)

![ZapShift Server Banner](assets/ZapShifT1.PNG)

## 📌 API Overview

This is the robust **Backend API Server** for **ZapShift**, a full-stack parcel delivery platform. Built with **Node.js** and **Express.js**, it orchestrates the entire logistics workflow, from user authentication and parcel booking to real-time tracking and payment processing.

The backend is architected for scalability, security, and maintainability, employing a **Controller-Service-Repository** pattern to ensure clean separation of concerns.

🌐 **Live API:** [https://zapshift23.vercel.app/](https://zapshift23.vercel.app/)


---

## 📸 App Glimpses

<div align="center">
  <img src="assets/ZapShifT1.PNG" width="48%" />
  <img src="assets/ZapShifT2.PNG" width="48%" />
  <img src="assets/ZapShifT3.PNG" width="48%" />
  <img src="assets/ZapShifT4.PNG" width="48%" />
  <img src="assets/ZapShifT5.PNG" width="48%" />
  <img src="assets/ZapShifT6.PNG" width="48%" />
  <img src="assets/ZapShifT7.PNG" width="48%" />
</div>

---

## 🏗 Infrastructure & Architecture

### **Architecture: Controller-Service-Repository**
This project follows a structured layered architecture to ensure code modularity and testability:
1.  **Controllers:** Handle incoming HTTP requests, validate input, and send responses.
2.  **Services:** Contain the core business logic (e.g., calculating shipping costs, processing payments).
3.  **Repositories:** Manage direct database interactions (CRUD operations), keeping the data layer isolated.

### **Core Capabilities**
-   **Secure Authentication:** Firebase Admin SDK integration for verifying user tokens and managing sessions.
-   **Role-Based Access Control (RBAC):** Middleware-enforced permissions for User, Rider, and Admin roles.
-   **Payment Processing:** Secure Stripe integration for handling transactions and webhooks.
-   **Real-Time Tracking Logic:** Complex state management for parcel status transitions (Pending → In Transit → Delivered).
-   **Data Validation:** Strict input validation using `express-validator` to ensure data integrity.

---

## 🛠 Tech Stack

### Core Technologies
-   **Node.js:** Runtime environment for efficient, scalable network applications.
-   **Express.js 5:** Fast, unopinionated, minimalist web framework.
-   **MongoDB:** NoSQL database for flexible data modeling (using Native Driver for performance).

### Security & Performance
-   **Helmet.js:** Secure HTTP headers to protect against well-known vulnerabilities.
-   **CORS:** Configured Cross-Origin Resource Sharing for secure frontend communication.
-   **Express Rate Limit:** Brute-force protection by limiting repeated requests.
-   **Bcrypt:** Salary for hashing sensitive data (though Firebase handles auth, this is used for specific internal logic).

### Utilities & Tools
-   **Firebase Admin SDK:** Server-side authentication and user management.
-   **Stripe SDK:** robust payment processing.
-   **Pino:** Structured logging for better debugging and monitoring.
-   **Dotenv:** Environment variable management.
-   **UUID:** Unique identifier generation for tracking IDs.

---

## 🚀 Installation & Setup

Follow these steps to run the server locally.

### Prerequisites
-   Node.js (v18 or higher)
-   MongoDB Instance (Local or Atlas)
-   Firebase Service Account Credentials

### 1. Clone the Repository
```bash
git clone https://github.com/Al-Roman23/zapshift-server.git
cd zapshift-server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
DB_USER=your_mongodb_user
DB_PASS=your_mongodb_password
DB_NAME=zapshift

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 5. Production Build
```bash
npm start
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── controllers/    # Request handlers (Input -> Service -> Response)
│   ├── services/       # Business logic (Calculations, logic flow)
│   ├── repositories/   # Database Access Layer (MongoDB queries)
│   ├── routes/         # API endpoint definitions
│   └── validators/     # Input validation schemas
├── config/             # Configuration (DB, Firebase, Stripe)
├── core/               # Core modules (Error handling, Constants)
├── middlewares/        # Custom middleware (Auth, RBAC, ErrorHandler)
├── utils/              # Helper functions (Logger, formatting)
└── server.js           # Entry point
```

---

## 📁 Key API Endpoints

### 🔐 Authentication (Users)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Create or update user profile | Public |
| `GET` | `/users/:email` | Get user details | Auth Required |
| `PATCH` | `/users/:email/role` | Promote/Demote user role | **Admin** |

### 📦 Parcel Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/parcels` | Book a new parcel | User |
| `GET` | `/parcels/user/:email` | Get all parcels for a user | User |
| `PATCH` | `/parcels/:id/status` | Update parcel status | Rider/Admin |
| `PATCH` | `/parcels/:id/assign` | Assign rider to parcel | **Admin** |

### 💳 Payments
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/create-payment-intent` | Initiate Stripe payment | User |
| `GET` | `/payments/history/:email` | Get payment history | User |

---

## 🔗 Related Repositories

- **Client Repository:** [GitHub Link](https://github.com/Al-Roman23/zapshift-client.git)
- **Live Site:** [https://zapshiftcourier.web.app/](https://zapshiftcourier.web.app/)

---

## 👨‍💻 Author

**Al-Roman Molla**  
Backend-Focused Full Stack Developer

- **Email:** alromanmolla@gmail.com
- **LinkedIn:** [Profile](https://www.linkedin.com/in/al-roman/)

---

Made with ❤️ by Al-Roman!

# NexLearn



**NexLearn** is a futuristic learning platform built with **Next.js**, **Redux Toolkit**, and **Tailwind CSS**. It supports **multi-step authentication**, **secure token management**, **exam handling**, and **result tracking**.

---

##  Project Duration
- **Started:** Yesterday evening 4 PM  
- **Completed:** Today 11:30 AM (Multi-step authentication, exam & result management, protected routes, token handling, UI integration)

---

## Features

- **Multi-Step Authentication**
  - Enter mobile number → Send OTP  
  - Verify OTP → Login  
  - Create profile → Upload image, name, email, qualification  

- **Secure Token Management**
  - Access & refresh tokens stored in **sessionStorage**  
  - Axios interceptors handle **automatic token refresh**  

- **Protected Routes**
  - Only authenticated users can access exams  
  - Redirect to login if tokens are invalid  

- **Exam Management**
  - Fetch questions from backend  
  - Track answers, visited questions, and marked-for-review questions  
  - Timer with start, stop, and countdown functionality  

- **Result Management**
  - Submit answers and store exam results  
  - Clear results for new attempts  

---

##  Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **State Management:** Redux Toolkit, Async Thunks  
- **Authentication:** OTP + Profile creation, JWT tokens  
- **HTTP Requests:** Axios with token interceptors  
- **Storage:** sessionStorage for tokens  

---

##  Authentication Flow

1. User enters **mobile number** → OTP sent.  
2. User enters **OTP** → Tokens saved → User authenticated.  
3. User creates **profile** → Profile saved + tokens updated.  
4. Authenticated users access **exam pages** via **ProtectedRoute**.  
5. Fetch questions → Track answers → Timer countdown.  
6. Submit answers → Store **result** in Redux.  
7. Tokens auto-refresh if expired.  
8. Logout clears tokens and redirects to login.  

---

##  Key Components & Slices

### **Auth Slice (`authSlice`)**
Handles user authentication, profile creation, token storage, and logout.

### **Exam Slice (`examSlice`)**
Handles fetching questions, tracking answers, question statuses, current index, and timer.

### **Result Slice (`resultSlice`)**
Handles storing and clearing exam results.

### **Axios Instance**
- Automatically adds access tokens to requests  
- Refreshes tokens on 401 responses  
- Retries failed requests after refresh  

### **ProtectedRoute Component**
- Restricts access to authenticated users  
- Redirects to login if no token found  
- Displays logout button  

---

##  How to Run

1. Clone the repository:
```bash
git clone https://github.com/vimal7736/nexlearn.git
cd nexlearn
```

2. Install Module

npm install



3. .env.local

NEXT_PUBLIC_API_BASE_URL=<Your API URL>



npm run dev


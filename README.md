# Hostel Management System (AIP Project)

A complete web-based application for managing hostel operations, including student registration, room allocation, complaint redressal, and fee tracking.

---
## 🛠️ Technology Stack
- **Frontend**: React.js (Vite), Axios, Lucide Icons, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Additional**: Core Java (Separate Module)

---

## How to Run the Project

### 1. Backend Setup
1. Open a new terminal in VS Code.
2. Navigate to the `backend` folder: `cd backend`
3. Install dependencies: `npm install`
4. Start the server (using nodemon): `npm start` or `node server.js`
   *Note: Ensure MongoDB is running on your machine.*

### 2. Frontend Setup
1. Open another terminal in VS Code.
2. Navigate to the `frontend` folder: `cd frontend`
3. Install dependencies: `npm install`
4. Start the React app: `npm run dev`
5. Open the URL shown in the terminal (usually `http://localhost:5173`).

### 3. Java Module Demo
1. Navigate to the `java_module` folder: `cd java_module`
2. Compile the Java file: `javac RoomAllocation.java`
3. Run the logic module: `java RoomAllocation`

---

## Project Structure
- **/backend**: Express API endpoints, Mongoose models, and server configuration.
- **/frontend**: React functional components, custom hooks, and modern UI layout.
- **/java_module**: Standalone Core Java file representing room allocation logic for Viva/Demo.

---

## Features & Workflow
1. **Dashboard**: Live counter for students, rooms, pending complaints, and total revenue.
2. **Student Module**: Admins can register new students and view their details.
3. **Room Management**: Manual assignment of rooms based on availability.
4. **Complaint Module**: Interface for students to submit issues and admins to resolve them.
5. **Fee Management**: Dedicated dashboard for tracking revenue (Collected vs Pending) with student payment progress bars.

---

##  Sample Test Data
- **Student**: Rahul Kumar, rahul@example.com, 9876543210
- **Room**: Room 101, Capacity 2
- **Complaint**: "Fan not working in Room 101"

---
### 9. How is the Dark/Light Mode toggle implemented?
It uses **React state** (`darkMode`) in `App.jsx` which is passed to the `Sidebar`. A global **CSS Safety Net** in `index.css` uses the `:not(.badge)` pseudo-class and CSS variables (`var(--text-main)`) to ensure that all text instantly flips color (White/Black) when the theme is toggled, maintaining perfect contrast at all times.

## Advantages
- Easy to use and modern UI.
- Secure database storage with MongoDB.
- Real-time room availability tracking.

##  Limitations
- No multi-role login (currently a simple admin-focused dashboard).
- No file upload (e.g., identity proofs).


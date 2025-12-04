# SmartSchedule - Online Lecture Scheduling System

SmartSchedule is a comprehensive web application designed to streamline the process of scheduling lectures, managing instructors, and organizing courses. It features a dual-role system with a powerful Admin Panel for management and an Instructor Dashboard for viewing schedules.

## 🚀 Features

### 👨‍💼 Admin Panel
- **Instructor Management**: 
  - View, Add, Edit, and Delete instructors.
  - Search functionality for quick access.
- **Course Management**:
  - Create and manage courses with details like level, duration, and description.
  - **View Lectures**: Dedicated view to see all scheduled batches for a specific course.
- **Lecture Scheduling**:
  - Schedule lectures with conflict detection (prevents double-booking instructors).
  - Calendar and List views for schedule management.
  - **Edit Capabilities**: Modify existing lecture details securely.

### 👨‍🏫 Instructor Dashboard
- **Personalized Schedule**: View assigned lectures in a clear, organized format.
- **Calendar View**: Visual representation of monthly/weekly schedule.
- **Lecture Details**: Access topic, notes, and timing information.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Persistence**: LocalStorage (Simulated Backend)
- **Utilities**: 
  - `date-fns` for date manipulation
  - `react-calendar` for calendar visualizations
  - `clsx` & `tailwind-merge` for dynamic styling

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartSchedule
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🔗 Application Routes

| Route | Description | Access Control |
|-------|-------------|----------------|
| `/login` | Authentication page for Admins and Instructors | Public |
| `/admin/dashboard` | Main control panel for Admins | **Protected** (Admin only) |
| `/instructor/dashboard` | Dashboard for Instructors to view schedules | **Protected** (Instructor only) |
| `/` | Redirects to `/login` | Public |

## 🔑 Demo Credentials

The application comes pre-loaded with demo data. You can use the following credentials to test the system:

### **Admin Account**
- **Email**: `admin@smart.com`
- **Password**: `admin123`

### **Instructor Account**
- **Email**: `sarah@smart.com`
- **Password**: `sarah123`

*(Note: You can also create new instructors via the Admin Panel and log in with their credentials)*

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components (Buttons, Cards, Modals, etc.)
├── context/           # Global state (Auth, Data, Toast, Theme)
├── pages/
│   ├── admin/         # Admin Dashboard & Tabs (Instructors, Courses, Schedule)
│   ├── instructor/    # Instructor Dashboard
│   └── Login.jsx      # Authentication Page
├── utils/             # Helper functions (Storage, Validation, DateUtils)
└── App.jsx            # Main routing configuration
```

## 🛡️ Key Features Implementation

- **Conflict Detection**: The system automatically checks for scheduling conflicts. An instructor cannot be assigned to two lectures at the same time or on the same date if it overlaps.
- **Protected Routes**: Ensures that only authenticated users with the correct role can access specific dashboards.
- **Data Persistence**: All data (instructors, courses, lectures) is saved to the browser's LocalStorage, so your changes persist even after refreshing the page.

---
Built for the **Internshala** assignment.

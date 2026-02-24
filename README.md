# HRMS Lite - Human Resource Management System

A lightweight, professional Human Resource Management System built as a part of a full-stack coding assignment.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide React
- **Backend**: Django, Django REST Framework
- **Database**: MySQL
- **Tools**: PostCSS, Headless UI

## Features
- **Dashboard**: Quick summary of total employees, daily attendance stats, and department distribution.
- **Employee Management**:
  - Add new employees with unique IDs.
  - View detailed employee directory.
  - Search and filter employees.
  - Delete employee records.
- **Attendance Management**:
  - Mark daily attendance (Present/Absent).
  - Prevent duplicate attendance for the same employee on the same date.
  - View attendance history.
  - Filter history by employee.

## Setup Instructions

### Backend (Django)
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers mysqlclient
   ```
3. Create a MySQL database named `hrms_lite`.
4. Update database credentials in `hrms_backend/settings.py` if necessary.
5. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend (React)
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Assumptions & Limitations
- Assumes a single admin user; no authentication is implemented as per requirements.
- Attendance can only be marked once per employee per day.
- MySQL server is expected to be running locally on port 3306.

## Bonus Features Implemented
- **Dashboard Summary**: Real-time counts and department charts.
- **Attendance Filtering**: Filter records by employee.
- **Search**: Search functionality in the employee directory.
- **UI/UX**: Premium dark-mode ready design with micro-animations and loading states.

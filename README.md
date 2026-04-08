# NEP 2020 Intelligent Timetable Generator

An automated timetable generation system designed for Higher Education Institutions, adhering to NEP 2020 guidelines.

## Features

- **Automated Generation**: Conflict-free timetable generation based on course workload, faculty expertise, and room availability.
- **Role-based Access**: Separate dashboards for Admin, Faculty, and Students.
- **Leave Management**: Faculty can apply for leave with exact timings; Admins can approve/reject requests.
- **Resource Management**: Manage Programs, Courses, Faculty, and Rooms (Classrooms/Labs).
- **Responsive Design**: Modern, premium UI built with React and Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, React Toastify.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Authentication**: JWT-based role-based authentication.

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd timetable
   ```

2. **Setup Server**:
   ```bash
   cd server
   npm install
   # Create a .env file with:
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret_key
   # PORT=5000
   npm start
   ```

3. **Setup Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Usage

1. **Admin**: Log in to add infrastructure (Rooms), Faculty, and Curriculum (Programs/Courses). Generate timetables from the Timetable section.
2. **Faculty**: Log in to view personal schedules, search student timetables, and apply for leave.
3. **Student**: Log in to view the published timetable for your program and semester.

## License

MIT

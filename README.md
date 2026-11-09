
# Private Notes 

A full-stack private note-taking application that allows users to create, organise, edit, and manage their personal notes in a secure, user-friendly environment.

Built using **React, Tailwind CSS, Node.js, Express, and Supabase**.

## Project Overview

Private Notes is a web application designed to give users a personal space to capture their thoughts, ideas, and important information.

The application features user authentication, a responsive dashboard, a rich-text note editor, and database integration.

Each user has their own account and can manage their notes independently.

## Features

### User Authentication
- Register an account using a name, email, and password.
- Log in using Supabase Authentication.
- Protected dashboard routes.
- HTTP-only cookies for authentication tokens.
- Session refresh functionality.
- Log out of the application.

### Note Management
- Create new notes.
- View saved notes.
- Edit existing notes.
- Delete notes.
- Archive and restore notes.
- Pin important notes.
- Organise notes by category.
- Search through notes.

### Rich-Text Editor
- Bold, italic, and underline formatting.
- Bulleted and numbered lists.
- Text size adjustments.
- Custom text colours and highlights.
- Insert links and inline code.
- Undo and redo functionality.
- Word count.
- Save formatted content.

### User Interface
- Responsive layouts for desktop and mobile.
- Sidebar navigation.
- Personalised dashboard greeting.
- User profile initial.
- Grid and list note layouts.
- Custom burgundy colour palette.
- Modern, minimal design.

## Technologies Used

### Frontend
- React
- JavaScript
- Vite
- Tailwind CSS
- React Router
- React Icons

### Backend
- Node.js
- Express.js
- REST API
- Cookie Parser
- CORS
- Dotenv

### Database & Authentication
- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

### Development Tools
- Visual Studio Code
- Git & GitHub
- Postman
- Supabase Dashboard

## Project Structure

```text
private-notes-app/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── authorisation/
│   │   │   ├── layout/
│   │   │   └── notes/
│   │   ├── pages/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── NoteEditor.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── supabase.js
│   │   └── cookies.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── notesController.js
│   ├── validation/
│   │   └── authValidator.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── notesRoutes.js
│   ├── app.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

Ensure you have the following installed or available:

- Node.js and npm
- Git
- A Supabase account
- A Supabase project

### 1. Clone the Repository

```bash
git clone <repository-url>
cd private-notes-app
```

Replace `<repository-url>` with the GitHub repository URL.

### 2. Install Frontend Dependencies

```bash
cd client
npm install / npm.cmd install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install / npm.cmd install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=3001
CLIENT_URL=http://localhost:5173

SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Create a `.env` file inside the `client` directory.

```env
VITE_API_URL=http://localhost:3001
```

**Important:** Environment files are excluded from Git. Never commit private credentials or secret API keys.

### 5. Configure Supabase

Create a Supabase project and set up the `notes` table.

The table contains the following fields:

| Column | Data Type |
|--------|-----------|
| id | UUID |
| user_id | UUID |
| title | TEXT |
| content | TEXT |
| category | TEXT |
| pinned | BOOLEAN |
| archived | BOOLEAN |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

The `user_id` column references the authenticated user in Supabase Auth.

Enable Row Level Security (RLS) on the `notes` table.

Configure SELECT, INSERT, UPDATE, and DELETE policies so authenticated users can access only their own notes.

The table must also be available through the Supabase Data API with the appropriate database permissions.

### 6. Start the Backend Server

From the `server` directory:

```bash
npm run dev / npm.cmd run dev
```

The backend runs at:

```text
http://localhost:3001
```

### 7. Start the Frontend

From the `client` directory:

```bash
npm run dev / npm.cmd run dev
```

The frontend runs at:

```text
http://localhost:5173
```

If the Vite port differs, ensure the backend CORS configuration permits the actual frontend origin.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register a new user |
| POST | /api/auth/login | Authenticate a user |
| GET | /api/auth/me | Retrieve the current user |
| POST | /api/auth/refresh | Refresh authentication tokens |
| POST | /api/auth/logout | Clear authentication cookies |

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes | Retrieve authenticated user's notes |
| POST | /api/notes | Create a new note |
| PUT | /api/notes/:id | Update an existing note |
| DELETE | /api/notes/:id | Delete a note |

Notes endpoints require authentication.

## Security

The application implements several authentication and data-access protections:

- Supabase Authentication for user registration and login.
- HTTP-only authentication cookies.
- Backend authentication middleware.
- Protected API endpoints.
- Supabase Row Level Security policies.
- User-specific note queries.
- Environment variables for configuration.
- HTML sanitisation for rich-text content.

### Security Considerations

The application is currently intended for development and demonstration.

Before deploying it for production use, the following improvements are required:

- Complete server-side session revocation during logout.
- Implement CSRF protection for cookie-authenticated requests.
- Configure production-specific cookie settings.
- Re-enable and configure email verification.
- Test session expiry and recovery.
- Review input validation and rate limiting.
- Verify user-data isolation across multiple accounts.

The application should not be used to store sensitive personal information until these security measures have been completed and tested.

## Testing

The backend API was tested using Postman.

Testing covered:

- User registration and login.
- Valid and invalid authentication sessions.
- Authentication cookie handling.
- Token refresh.
- Protected routes.
- Creating notes.
- Retrieving notes.
- Updating notes.
- Deleting notes.
- Handling invalid requests.

Frontend testing included authentication, dashboard navigation, note editing, and database persistence.

## Challenges and Learning Outcomes

Developing Private Notes provided practical experience in building and connecting a full-stack application.

Key learning areas included:

- Connecting a React frontend to an Express backend.
- Understanding REST APIs and HTTP methods.
- Implementing authentication with Supabase.
- Managing authentication using HTTP-only cookies.
- Configuring Cross-Origin Resource Sharing (CORS).
- Working with PostgreSQL through Supabase.
- Implementing Row Level Security.
- Managing asynchronous requests in React.
- Handling API errors.
- Debugging frontend and backend integration issues.
- Preserving formatted note content when saving and retrieving data.

One of the main development challenges was configuring CORS correctly so the frontend and backend could communicate across different local development ports.

## Future Improvements

Potential future enhancements include:

- Password reset functionality.
- Automatic session refresh on expired access tokens.
- Production-ready security improvements.
- Improved error notifications.
- Note tags and advanced filtering.
- Automatic note saving.
- More rich-text formatting options.
- Improved accessibility.
- Deployment of the complete application.

## Developer

**Lusizo Sibiya**

Software Development Student | Melsoft Academy

Developed as a full-stack software development project to practise React, JavaScript, backend API development, authentication, and database integration.

## Project Status

**Full-stack development project — Core functionality implemented and tested locally.**

Production security hardening and deployment remain future improvements.

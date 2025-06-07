# Node SAS App

A simple Node.js application for user management, built with Express, MySQL, EJS, and Bootstrap. Features include user registration, login, profile management, user listing, and file upload.

## Features

- User authentication (login/signup/logout)
- User profile management (view, edit, update profile picture)
- User listing with search, sort, and pagination (DataTables)
- Add, edit, and delete users
- Flash messages for success and error notifications
- File upload support (profile picture)
- Session management

## Tech Stack

- Node.js
- Express.js
- MySQL
- EJS (templating)
- Bootstrap (styling)
- Multer (file uploads)
- bcrypt (password hashing)
- connect-flash (flash messages)
- express-session (session management)
- method-override (for RESTful forms)

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MySQL

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/node-sas-app.git
   cd node-sas-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the database:**
   - Create a MySQL database (e.g., `nodesas`).
   - Update your database credentials in `config/database.js`.

4. **Run database migrations (if any):**
   - Create the `accounts` table as required by the app.

5. **Start the application:**
   ```bash
   npm start
   ```
   or for development with auto-reload:
   ```bash
   npx nodemon app.js
   ```

6. **Visit in your browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
/controllers      # Express controllers
/routes           # Express routes
/views            # EJS templates
/public           # Static files (uploads, CSS, JS)
/config           # Database config
app.js            # Main app entry point
```

## Usage

- Register a new user or login with existing credentials.
- Manage your profile and upload a profile picture.
- View, add, edit, and delete users from the users list (admin features).
- Flash messages will notify you of actions and errors.

## License

ISC

---

**Author:** Ritesh
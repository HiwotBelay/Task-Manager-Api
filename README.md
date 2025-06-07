# Task Manager API - Backend Developer Test

A complete REST API for task management built with Next.js, featuring all required endpoints and bonus features

## 🚀 Features

### Required Endpoints
- ✅ `GET /api/tasks` - Return all tasks
- ✅ `POST /api/tasks` - Add a new task  
- ✅ `PUT /api/tasks/:id` - Mark a task as completed (toggle)
- ✅ `DELETE /api/tasks/:id` - Delete a task

### 🎯 Bonus Features
- ✅ **Filtering**: Query parameter support for completed vs pending tasks
- ✅ **Validation**: Title must not be empty, proper error handling
- ✅ **Frontend Demo**: Simple React interface to test all endpoints
- ✅ **Professional UI**: Clean, responsive design with real-time updates

## 🛠️ Technology Stack

- **Backend**: Next.js API Routes (Node.js)
- **Frontend**: React with TypeScript
- **Storage**: In-memory array (easily upgradeable to database)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Validation**: Built-in request validation

## 📁 Project Structure

\`\`\`
backend/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts          # GET, POST /api/tasks
│   │       └── [id]/
│   │           └── route.ts      # PUT, DELETE /api/tasks/:id
│   ├── page.tsx                  # Frontend demo interface
│   └── layout.tsx               # App layout
├── components/                   # UI components
├── README.md                    # This file
└── package.json                # Dependencies
\`\`\`

## 🚀 Quick Start

### Installation
\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

### Access the Application
- **Frontend Demo**: http://localhost:3000
- **API Base URL**: http://localhost:3000/api/tasks

## 📡 API Documentation

### 1. Get All Tasks
\`\`\`http
GET /api/tasks
\`\`\`

**Optional Query Parameters:**
- \`filter=completed\` - Show only completed tasks
- \`filter=pending\` - Show only pending tasks

**Response:**
\`\`\`json
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "title": "Complete the backend test",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1
}
\`\`\`

### 2. Create New Task
\`\`\`http
POST /api/tasks
Content-Type: application/json

{
  "title": "New task title"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "task": {
    "id": 2,
    "title": "New task title",
    "completed": false,
    "createdAt": "2024-01-15T10:35:00.000Z"
  },
  "message": "Task created successfully"
}
\`\`\`

### 3. Toggle Task Completion
\`\`\`http
PUT /api/tasks/1
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Complete the backend test",
    "completed": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Task marked as completed"
}
\`\`\`

### 4. Delete Task
\`\`\`http
DELETE /api/tasks/1
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Complete the backend test",
    "completed": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Task deleted successfully"
}
\`\`\`

## 🧪 Testing the API

### Using the Frontend Demo
1. Visit http://localhost:3000
2. Use the interface to create, toggle, and delete tasks
3. Test the filtering functionality
4. All operations are performed via the REST API

### Using cURL Commands
\`\`\`bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Create a new task
curl -X POST http://localhost:3000/api/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Test task"}'

# Toggle task completion
curl -X PUT http://localhost:3000/api/tasks/1

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/1

# Filter completed tasks
curl "http://localhost:3000/api/tasks?filter=completed"
\`\`\`

## ✅ Validation & Error Handling

- **Empty Title**: Returns 400 error if title is empty or missing
- **Invalid ID**: Returns 400 error for non-numeric task IDs
- **Task Not Found**: Returns 404 error for non-existent tasks
- **Server Errors**: Proper 500 error responses with meaningful messages

## 🔄 Data Persistence

Currently uses in-memory storage for simplicity. To upgrade to a database:

1. **SQLite**: Add \`better-sqlite3\` package
2. **PostgreSQL**: Add \`pg\` package  
3. **MongoDB**: Add \`mongodb\` package
4. **Prisma ORM**: Add \`prisma\` for any SQL database

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

### Other Platforms
- **Netlify**: Works with Next.js
- **Railway**: Node.js support
- **Heroku**: Add \`Procfile\`

## 📝 Notes

- All endpoints return consistent JSON responses
- CORS is handled automatically by Next.js
- TypeScript provides type safety
- Responsive design works on all devices
- Production-ready error handling

## 👨‍💻 Developer

Built for the Backend Developer position test. This implementation demonstrates:

- Clean, maintainable code structure
- Proper REST API design principles
- Comprehensive error handling
- Professional documentation
- Bonus features implementation
- Full-stack development capabilities

---

**API Status**: ✅ Running and ready for testing!

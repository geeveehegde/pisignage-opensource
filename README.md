# PiSignage - Digital Signage Management System

A full-stack digital signage management system with user authentication, built with Node.js/Express backend and Next.js frontend.

## 🚀 Features

- **Backend (Node.js/Express)**
  - User authentication with Passport.js
  - MongoDB integration with Mongoose
  - Session management with connect-mongo
  - RESTful API endpoints
  - Password hashing with PBKDF2

- **Frontend (Next.js)**
  - Modern React with TypeScript
  - User authentication UI (login/register)
  - Protected routes
  - Responsive design with Tailwind CSS
  - Form validation with React Hook Form and Zod

## 📁 Project Structure

```
pisignage/
├── backend/                 # Express.js backend
│   ├── app/
│   │   └── session.js      # Authentication handlers
│   ├── config/
│   │   ├── config.js       # Configuration
│   │   ├── express.js      # Express app setup
│   │   ├── passport.js     # Passport authentication
│   │   └── routes.js       # API routes
│   ├── models/
│   │   └── user.js         # User model
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utility libraries
│   └── package.json
└── README.md
```

## 🛠️ Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to project root
cd pisignage

# Install backend dependencies
npm install

# Set up MongoDB (make sure MongoDB is running)
# Update config/config.js with your MongoDB URL if needed

# Start the backend server
npm start
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3001`

### 3. Access the Application

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000

## 🔐 Authentication Flow

1. **Registration:** Users create accounts with email and password
2. **Login:** Users authenticate with credentials
3. **Session Management:** Secure session storage with MongoDB
4. **Protected Routes:** Dashboard accessible only to authenticated users
5. **Logout:** Secure session termination

## 📡 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Health Check
- `GET /api/health` - Server health status

## 🛡️ Security Features

- **Password Hashing:** PBKDF2 with salt
- **Session Security:** HTTP-only cookies
- **CORS Protection:** Configured for frontend
- **Input Validation:** Zod schema validation
- **Error Handling:** Comprehensive error responses

## 🎨 Frontend Features

- **Modern UI:** Clean, responsive design
- **Form Validation:** Real-time validation with helpful error messages
- **Loading States:** User feedback during operations
- **Type Safety:** Full TypeScript support
- **State Management:** React Context for authentication

## 🔧 Configuration

### Backend Configuration (`config/config.js`)
```javascript
export const CONFIG = {
    PORT: 3000,
    DB_URL: 'mongodb://localhost:27017/pisignage-server'
};
```

### Frontend Configuration (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Testing

### Backend Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/health
```

### Frontend Testing
- Open browser developer tools
- Check network requests
- Verify authentication flow

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Configure MongoDB connection
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection URL in config

2. **CORS Errors**
   - Verify backend CORS configuration
   - Check frontend API URL

3. **Authentication Issues**
   - Clear browser cookies
   - Check session configuration

4. **Port Conflicts**
   - Backend: Change port in `config/config.js`
   - Frontend: Change port in `package.json` scripts

### Getting Help

- Check the console for error messages
- Verify all dependencies are installed
- Ensure both servers are running
- Check network connectivity between frontend and backend 
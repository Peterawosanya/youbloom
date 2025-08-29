# Youbloom Technical task-React Demo App

A modern React application built for technical interview demonstration, featuring authentication, API integration, and responsive design.

## 🚀 Features

- **Phone-based Authentication**: Secure login with +254 format validation
- **API Integration**: Real-time data from JSONPlaceholder API
- **Search & Filter**: Dynamic search functionality across users and posts
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Protected Routes**: Authentication-based navigation
- **State Management**: Context API for global state
- **Modern UI**: Clean, professional interface with animations
- **Type Safety**: Full TypeScript implementation
- **Testing**: Unit tests with Jest and React Testing Library

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite
- **State Management**: React Context API

## 📱 Pages

### Login Page
- Phone number validation (+254 format)
- Mock authentication system
- Form validation with error handling
- Demo credentials: `+254712345678`

### Main Page
- Toggle between Users and Posts data
- Real-time search functionality
- Responsive grid layout
- Loading states and error handling
- Click to navigate to details

### Detail Page
- Comprehensive user/post information
- Back navigation
- Responsive design
- Error states for not found items

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-demo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

For testing the application, use:
- **Phone**: `+254712345678`
- Any valid +254 format will also work

## 🧪 Testing

Run tests with:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🏗 Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ErrorMessage.tsx
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── context/            # Context API state management
│   └── AppContext.tsx
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── MainPage.tsx
│   └── DetailPage.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── __tests__/          # Test files
│   ├── LoginPage.test.tsx
│   └── AppContext.test.tsx
└── App.tsx            # Main app component
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Teal (#14B8A6)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Orange (#F59E0B)

### Spacing
- Consistent 8px spacing system
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

### Typography
- Clear hierarchy with proper font weights
- Accessible font sizes and line heights

## 🔧 Configuration

### API Endpoints
- Base URL: `https://jsonplaceholder.typicode.com`
- Users: `/users`
- Posts: `/posts`

### Authentication
- Mock authentication system
- Phone number format: +254XXXXXXXXX
- Session persistence via localStorage

## 🧩 Key Features Implementation

### State Management
- Context API for global state
- Persistent login sessions
- Loading and error states
- Optimistic updates

### API Integration
- RESTful API consumption
- Error handling with custom error types
- Loading states
- Data caching in context

### Form Validation
- Real-time phone number validation
- Error message display
- User feedback

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions

## 📝 Testing Strategy

- **Unit Tests**: Components and utilities
- **Integration Tests**: Context and routing
- **User Interaction Tests**: Form submission and navigation
- **Accessibility Tests**: Screen reader compatibility

## 🔍 Performance Optimizations

- Lazy loading of components
- Efficient re-renders with proper state structure
- Memoized computed values
- Optimized bundle size

## 📈 Future Enhancements

- Real authentication system
- Data persistence (backend integration)
- Advanced search filters
- User profile management
- Offline support
- Push notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is created for technical interview purposes.

## 👥 Contact

For questions or feedback about this demo application, please reach out through the provided channels.

---

**Note**: This is a demo application built for technical interview purposes. It uses mock authentication and public APIs for demonstration only.

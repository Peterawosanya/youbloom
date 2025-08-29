import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NetworkStatus } from './components/NetworkStatus';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';
import { DetailPage } from './pages/DetailPage';

function App() {
  return (
    <AppProvider>
      <NetworkStatus />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/main" 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/detail/:type/:id" 
            element={
              <ProtectedRoute>
                <DetailPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
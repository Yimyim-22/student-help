import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Assignments from './pages/Assignments';
import Exams from './pages/Exams';
import Gpa from './pages/Gpa';

import { AppProvider } from './context/AppContext';

import Welcome from './pages/Welcome';
import { useApp } from './context/AppContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { username } = useApp();
  if (!username) return <Navigate to="/welcome" replace />;
  return <Outlet />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="classes" element={<Classes />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="exams" element={<Exams />} />
              <Route path="gpa" element={<Gpa />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

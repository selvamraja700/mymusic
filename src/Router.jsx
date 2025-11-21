import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import {
  Home,
  Search,
  Settings,
  Premium,
  Subscribe,
  Profile,
  Login,
  Register,
  Library,
  LikedSongs,
  NotFound,
} from './pages';

/**
 * Authentication check
 */
const isAuthenticated = () => {
  try {
    return localStorage.getItem('user') !== null;
  } catch {
    return false;
  }
};

/**
 * Protected Route
 */
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

/**
 * Public Route
 */
const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/home" replace />;
};

/**
 * Main Router
 */
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Root redirect */}
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Protected routes (each page handles its own layout via AppLayout) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />

        <Route
          path="/liked"
          element={
            <ProtectedRoute>
              <LikedSongs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/premium"
          element={
            <ProtectedRoute>
              <Premium />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscribe"
          element={
            <ProtectedRoute>
              <Subscribe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "../Layout/Header/Header";
import Login from "../Auth/Login";
import Dashboard from '../../pages/Dashboard/Dashboard'
import PrivateRoute from '../Auth/PrivateRoute';
import {Navigate} from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from '../../services/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
            <div className="main-wrapper">
              <Header/>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                <Route path="/" element={<Navigate to="/login" />} /> {/* Default route */}
              </Routes>
            </div>
          </Router>
    </AuthProvider>
  );
}

export default App;

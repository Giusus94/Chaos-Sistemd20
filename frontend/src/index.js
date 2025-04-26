import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
	  <AuthProvider>
	  <ToastContainer position="top-center" autoClose={3000} />
		<App />
	  </AuthProvider>
	</BrowserRouter>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import Register from './Register';
import Login from './Login';
import ErrorPage from './components/ErrorPage';

// react router stuff
const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <App/>,
    errorElement: <ErrorPage/>,
  },
  { path: "/register",
    element: <Register/>,
    errorElement: <ErrorPage/>
  },
  { path: "/login",
    element: <Login/>,
    errorElement: <ErrorPage/>
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


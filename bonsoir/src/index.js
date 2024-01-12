import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App';
import Login from './Login';
import Home from './Home';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/home",
    element: <Home/>
  },
]);

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-6aw2611vi2ravbh4.us.auth0.com"
    clientId="BQUsRFgtA4Mn6upCH1sjtBi8EsgHQCau"
    authorizationParams={{
      redirect_uri: window.location.origin + '/home'
    }}
  >
    <RouterProvider router={router} />
  </Auth0Provider>,
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain='dev-6aw2611vi2ravbh4.us.auth0.com'
        clientId='BQUsRFgtA4Mn6upCH1sjtBi8EsgHQCau'
        authorizationParams={{ redirect_uri: window.location.origin + '/profile' }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
        >
        <App/>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

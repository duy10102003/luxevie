import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App.jsx';
import './index.css';


// import '@coreui/coreui/dist/css/coreui.min.css'; // giữ nếu bạn đang dùng
// import './styles/tokens.css'; // comment nếu file chưa tồn tại
// import './styles/tailwind.css'; // comment nếu file chưa tồn tại

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AppWrapper = googleClientId ? (
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
  </GoogleOAuthProvider>
) : (
  <App />
);

ReactDOM.createRoot(document.getElementById('root')).render(AppWrapper);

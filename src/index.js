//cd C:\Users\bajuri\Downloads\Programs
//.\cloudflared.exe service install
//.\cloudflared.exe tunnel --url http://localhost:3000
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './styles/main.scss'
import './i18n';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './assets/fonts/mangolaine/mangolaine.ttf';
import './assets/fonts/mosafin/Mosafin-Bold.ttf';
import 'animate.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);



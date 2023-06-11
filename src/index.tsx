import React from 'react';

import 'style/main.css'

import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'

import App from 'App';

const root = createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <HashRouter>
          <App />
      </HashRouter>
  </React.StrictMode>
);

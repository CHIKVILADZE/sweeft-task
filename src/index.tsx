import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GalleryProvider } from './context/PhotoContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GalleryProvider>
      <App />
    </GalleryProvider>
  </React.StrictMode>
);

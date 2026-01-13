import React from 'react';
import ReactDOM from 'react-dom/client';
import { InsforgeProvider } from '@insforge/react';
import App from './App';
import { client } from './services/insforge';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <InsforgeProvider client={client}>
      <App />
    </InsforgeProvider>
  </React.StrictMode>
);
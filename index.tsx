import React from 'react';
import ReactDOM from 'react-dom/client';
import { InsforgeProvider } from '@insforge/react';
import { createClient } from '@insforge/sdk';
import App from './App';

// Explicitly create client with Live Production Config
// @ts-ignore - bypassing strict type check for config properties
const productionClient = createClient({
  baseUrl: 'https://3cfrtvt6.us-west.insforge.app',
  projectId: 'ik_bbd06f551be2c3e1ddd1cdff804eb445',
  apiKey: 'ik_bbd06f551be2c3e1ddd1cdff804eb445',
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'djflowerz-auth-token',
    flowType: 'pkce'
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <InsforgeProvider
      client={productionClient}
      afterSignInUrl="/admin"
    >
      <App />
    </InsforgeProvider>
  </React.StrictMode>
);
import React from "react";
import ReactDOM from "react-dom/client";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

// Cookies Provider Context
import { CookiesProvider } from "react-cookie";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./utils/active-directory/config";

import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

try {
  const reactPlugin = new ReactPlugin();

  const appInsights = new ApplicationInsights({
    config: {
      connectionString: process.env.REACT_APP_INSIGHT_CONNECTION_STRING,
      // *** If you're adding the Click Analytics plug-in, delete the next line. ***
      extensions: [reactPlugin],
    },
  });
  appInsights.loadAppInsights();
} catch (error) {
  console.error(
    `No se pudo configurar el application insights. Error: ${error}`
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const msalInstance = new PublicClientApplication(msalConfig);

// Create a client
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MsalProvider instance={msalInstance}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </MsalProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

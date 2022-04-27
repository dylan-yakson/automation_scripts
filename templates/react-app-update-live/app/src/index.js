/* eslint-disable no-unused-vars */
/**
=========================================================
* Material Dashboard 2 PRO React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, useLocation } from "react-router-dom";
// Soft UI Context Provider
import { MaterialUIControllerProvider } from "context";
import { Provider } from "react-redux";
import { PublicClientApplication } from "@azure/msal-browser";
import { createStore } from "redux";
import { msalConfig } from "authConfig";
import allReducers from "reducers/index";
import { CustomNavigationClient } from "utils/NavigationClient";
import App from "App";

// Auth Components
import {
  // AuthenticatedTemplate,
  // UnauthenticatedTemplate,
  // useIsAuthenticated,
  // useMsal,
  MsalProvider,
} from "@azure/msal-react";

const store = createStore(allReducers);
// MSAL configuration
const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <MsalProvider instance={msalInstance}>
        <Provider store={store}>
          <App />
        </Provider>
      </MsalProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

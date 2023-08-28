import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient } from "react-query";
import { AuthProvider, useAuth } from "react-oidc-context";

import FeastUI from "@feast-dev/feast-ui";
import "@feast-dev/feast-ui/dist/feast-ui.css";

import RFVDemoCustomTab from "./custom-tabs/DemoCustomTab.tsx";

const domNode = document.getElementById('root');
const root = createRoot(domNode);

const queryClient = new QueryClient();

const tabsRegistry = {
  DataSourceCustomTabs: [
    {
      label: "Shubhi's Demo Tab", // Navigation Label for the tab
      path: "demo-tab", // Subpath for the tab
      Component: RFVDemoCustomTab, // a React Component
    },
  ]
}


const oidcConfig = {
  authority: 'https://auth.pingone.asia/4759a5a7-74de-492c-8a51-92efbcd5149a',
  client_id: '512719ef-db11-425d-9dd8-9ed72cb7da8e',
  redirect_uri:'http://localhost:3000/',
  client_secret: 'ykurNyOJen5MUgvK-6QH~IRjVjLQ7F2RN4LuM9ZW50XBxf7rC19k6Lv_bLAq1PGv',
  response_type: 'code',
  post_logout_redirect_uri:'http://localhost:3000/',
  host:'localhost:3000',
  scope:'openid profile',
  grant_type:'implicit',
  code_verifier: true,
  token_type_hint:'Bearer',
  code_challenge_method:'S256',
  metadata:{
    authorization_endpoint: 'https://auth.pingone.asia/4759a5a7-74de-492c-8a51-92efbcd5149a/as/authorize',
    issuer: 'https://auth.pingone.asia/4759a5a7-74de-492c-8a51-92efbcd5149a',
    token_endpoint: 'https://auth.pingone.asia/4759a5a7-74de-492c-8a51-92efbcd5149a/as/token',
    code_challenge_method_supported:'S256',
  }
};

const onSigninCallback = () => {
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
};

function Securedfeast() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div> Loading ....</div>
  }

  if (auth.error) {
    return <div> Oopss .... {auth.error.message}</div>
  }
  if (auth.isAuthenticated) {
    auth.startSilentRenew();
    return <div> <FeastUI
      reactQueryClient={queryClient}
      feastUIConfigs={{
        tabsRegistry: tabsRegistry,
        projectListPromise: fetch((process.env.PUBLIC_URL || "") + "/projects-list.json", {
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          return res.json();
        })
      }}
    /></div>
  }
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
  }
}

root.render(
  <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
    <Securedfeast />
  </AuthProvider>
);

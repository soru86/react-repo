import React from "react";
import ReactDOM from "react-dom/client";
import "./tailwind.css";
import App from "./app/app";
import { apolloClient } from "./app/common/apollo/apollo.client";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { store } from "./app/common/redux/store/store";
import "react-toastify/dist/ReactToastify.css";
import * as swRegistration from "./service-worker-utils";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);

swRegistration.register();

import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";

import "antd/dist/reset.css";
import "./assets/css/style.css";
import "./assets/css/style.z.css";
import "./assets/css/antd.customize.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>,
);

reportWebVitals();

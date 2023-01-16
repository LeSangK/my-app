import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./app/store";
import { Form } from "./container/Form";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Form />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

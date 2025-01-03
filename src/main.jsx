import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "./Auth/AuthContext/AuthContext.jsx";
import store from "./Redux/store.js";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";

export const basePath = import.meta.env.VITE_URL;

axios.defaults.baseURL = basePath;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer />
      </ReduxProvider>
    </AuthProvider>
  </StrictMode>
);

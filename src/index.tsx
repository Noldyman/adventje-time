import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import { ProtectedRoute } from "./components/utils/ProtectedRoute";
import { Home } from "./pages/Home";
import { SignUp } from "./pages/auth/SignUp";
import { SignIn } from "./pages/auth/SignIn";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Dashboard } from "./pages/Dashboard";
import { AccountSettings } from "./pages/AccountSettings";
import { NotFound } from "./pages/NotFound";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route element={<ProtectedRoute userForbidden />}>
              <Route path="signup" element={<SignUp />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route element={<ProtectedRoute userRequired />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="account-settings" element={<AccountSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

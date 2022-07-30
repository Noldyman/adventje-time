import { useEffect, useState } from "react";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../services/user";
import { notificationState } from "../services/notifications";
import { Snackbar, Alert } from "@mui/material";
import { TopBar } from "./TopBar";
import { Outlet } from "react-router-dom";

const App = () => {
  const notification = useRecoilValue(notificationState);
  const setUser = useSetRecoilState(userState);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userCopy = JSON.parse(JSON.stringify(user)); //Due to bug in recoil
      setUser(userCopy);
    } else {
      setUser(null);
    }
  });

  useEffect(() => {
    if (notification.text) {
      setNotificationIsOpen(true);
    }
  }, [notification]);

  return (
    <>
      <TopBar />
      <div className="content">
        <Outlet />
      </div>
      <Snackbar
        open={notificationIsOpen}
        autoHideDuration={5000}
        onClose={() => setNotificationIsOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => setNotificationIsOpen(false)}
        >
          {notification.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;

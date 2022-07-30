import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../services/user";
import { notificationState } from "../services/notifications";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle, ManageAccounts, ExitToApp } from "@mui/icons-material";

export const TopBar = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const setNotification = useSetRecoilState(notificationState);

  const serveHomepage = () => {
    if (user) return navigate("/dashboard");
    return navigate("/");
  };

  const handleMenu = async (e: React.MouseEvent<HTMLElement>) => {
    await setAnchorEl(e.currentTarget);
    setMenuIsOpen(true);
  };

  const handleLogout = async () => {
    setMenuIsOpen(false);
    setAnchorEl(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
      setNotification({
        text: "Something went wrong, failed to sign out",
        severity: "error",
      });
    }
  };

  const handleAccountSettings = () => {
    setMenuIsOpen(false);
    setAnchorEl(null);
    navigate("/account-settings");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography
            onClick={serveHomepage}
            variant="h4"
            component="div"
            style={{ cursor: "pointer" }}
          >
            Adventje time
          </Typography>
          {!user ? (
            <div
              style={{ display: "flex", justifyContent: "right", gap: "10px" }}
            >
              <Button
                size="small"
                color="inherit"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </Button>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </div>
          ) : (
            <>
              <Button
                startIcon={<AccountCircle />}
                size="large"
                color="inherit"
                onClick={handleMenu}
              >
                Account
              </Button>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={menuIsOpen}
                onClose={() => setMenuIsOpen(false)}
              >
                <MenuItem onClick={handleAccountSettings}>
                  <ManageAccounts style={{ marginRight: "10px" }} />
                  Account settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp style={{ marginRight: "10px" }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

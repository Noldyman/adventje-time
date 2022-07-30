import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, TextField, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save, Delete } from "@mui/icons-material";
import { validateNewPassword } from "../validation/validateNewPassword";
import {
  updatePassword,
  reauthenticateWithCredential,
  deleteUser,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../app/firebase";
import { useSetRecoilState } from "recoil";
import { notificationState } from "../services/notifications";

interface IErrors {
  [k: string]: string;
}

const initialFormValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  delAccConfirmPassword: "",
};

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState<IErrors>({});
  const [delAccLoading, setDelAccLoading] = useState(false);
  const setNotification = useSetRecoilState(notificationState);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevValue) => {
      return { ...prevValue, [e.target.name]: e.target.value };
    });
  };

  const cancelChangePassword = () => {
    setPwdErrors({});
    setFormValues((prevValue) => {
      return {
        ...prevValue,
        newPassword: "",
        confirmPassword: "",
      };
    });
  };

  const handleChangePassword = async () => {
    setPwdErrors({});
    let errors: IErrors = {};
    const yupError = await validateNewPassword({
      oldPassword: formValues.oldPassword,
      password: formValues["newPassword"],
    });
    if (yupError) errors = { ...yupError };
    if (formValues["confirmPassword"] !== formValues["newPassword"]) {
      errors["confirmPassword"] = "Passwords do not match";
    }
    if (Object.keys(errors).length) return setPwdErrors(errors);

    const user = auth.currentUser;
    if (user) {
      try {
        setPwdLoading(true);
        await reauthenticateWithCredential(
          user,
          EmailAuthProvider.credential(user.email!, formValues.oldPassword)
        );
        await updatePassword(user, formValues.newPassword);
        setNotification({
          text: "Password has been changed",
          severity: "success",
        });
      } catch (err) {
        console.log(err);
        setNotification({
          text: "Something went wrong. Did you enter the correct password?",
          severity: "error",
        });
      }
      setPwdLoading(false);
      cancelChangePassword();
    }
  };

  const cancelDeleteAccount = () => {
    setFormValues((prevValue) => {
      return { ...prevValue, delAccConfirmPassword: "" };
    });
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        setDelAccLoading(true);
        await reauthenticateWithCredential(
          user,
          EmailAuthProvider.credential(
            user.email!,
            formValues.delAccConfirmPassword
          )
        );
        await deleteUser(user);
        setDelAccLoading(false);
        setNotification({
          text: "You're account has been deleted. Sorry to see you go",
          severity: "success",
        });
        setDelAccLoading(false);
        navigate("/");
      } catch (err) {
        console.log(err);
        setNotification({
          text: "Something went wrong, your account could not be deleted",
          severity: "error",
        });
      }
      setDelAccLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Card
        style={{
          margin: "auto",
          width: "600px",
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Typography variant="h5">Change password</Typography>
        <TextField
          fullWidth
          id="changePwd-old"
          name="oldPassword"
          label="Old password"
          size="small"
          type="password"
          value={formValues.oldPassword}
          onChange={handleFormChange}
          error={Boolean(pwdErrors["oldPassword"])}
          helperText={pwdErrors["oldPassword"]}
        />
        <TextField
          fullWidth
          id="changePwd-new"
          name="newPassword"
          label="New password"
          size="small"
          type="password"
          value={formValues.newPassword}
          onChange={handleFormChange}
          error={Boolean(pwdErrors["password"])}
          helperText={pwdErrors["password"]}
        />
        <TextField
          fullWidth
          id="changePwd-confrim"
          name="confirmPassword"
          label="Confirm password"
          size="small"
          type="password"
          value={formValues.confirmPassword}
          onChange={handleFormChange}
          error={Boolean(pwdErrors["confirmPassword"])}
          helperText={pwdErrors["confirmPassword"]}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Button
            style={{ width: "175px" }}
            size="small"
            variant="contained"
            color="secondary"
            onClick={cancelChangePassword}
          >
            Cancel
          </Button>
          <LoadingButton
            style={{ width: "175px" }}
            size="small"
            color="primary"
            loading={pwdLoading}
            loadingPosition="start"
            startIcon={<Save />}
            variant="contained"
            onClick={handleChangePassword}
            disabled={
              !formValues.oldPassword ||
              !formValues.newPassword ||
              !formValues.confirmPassword
            }
          >
            Save changes
          </LoadingButton>
        </div>
      </Card>
      <Card
        style={{
          margin: "auto",
          width: "600px",
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Typography variant="h5">Delete account</Typography>
        <TextField
          fullWidth
          name="delAccConfirmPassword"
          label="Password"
          placeholder="Confirm your password to delete account"
          size="small"
          type="password"
          value={formValues.delAccConfirmPassword}
          onChange={handleFormChange}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Button
            style={{ width: "175px" }}
            size="small"
            variant="contained"
            color="secondary"
            onClick={cancelDeleteAccount}
          >
            Cancel
          </Button>
          <LoadingButton
            style={{ width: "175px" }}
            size="small"
            color="error"
            loading={delAccLoading}
            loadingPosition="start"
            startIcon={<Delete />}
            variant="contained"
            disabled={!formValues.delAccConfirmPassword}
            onClick={handleDeleteAccount}
          >
            Delete account
          </LoadingButton>
        </div>
      </Card>
    </div>
  );
};

export { AccountSettings };

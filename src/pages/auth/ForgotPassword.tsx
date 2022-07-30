import React, { useState, ChangeEvent } from "react";
import { auth } from "../../app/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Card, Typography, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";
import { validateEmail } from "../../validation/validateEmail";
import { useSetRecoilState } from "recoil";
import { notificationState } from "../../services/notifications";

const ForgotPassword: React.FC = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setNotification = useSetRecoilState(notificationState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    const error = await validateEmail({ email: input });
    if (error) return setError(error["email"]);
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, input);
      setLoading(false);
      setNotification({ text: "Email has been sent", severity: "success" });
    } catch (err) {
      console.log(err);
      setLoading(false);
      setNotification({
        text: "Something went wrong. Is your email address correct?",
        severity: "error",
      });
    }
  };

  return (
    <>
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
        <Typography variant="h5">Password reset</Typography>
        <Typography>
          Please enter your email address. If the address is known, an email
          will be sent to reset your password. Be aware that the email might end
          up in your junk folder.
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="text"
          name="email"
          label="Email address"
          value={input}
          onChange={handleChange}
          error={Boolean(error)}
          helperText={error}
        />
        <LoadingButton
          loading={loading}
          startIcon={<Send />}
          loadingPosition="start"
          style={{ width: "175px" }}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!input}
        >
          Send email
        </LoadingButton>
      </Card>
    </>
  );
};

export { ForgotPassword };

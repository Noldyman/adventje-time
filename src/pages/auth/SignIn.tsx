import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Typography, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Login as LoginIcon } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../app/firebase";

const initialFormValues = {
  email: "",
  password: "",
};

export const SignIn = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevValue) => {
      return { ...prevValue, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setErrorMsg("Incorrect email address or password");
    }
    setLoading(false);
  };

  return (
    <Card
      style={{
        margin: "auto",
        width: "600px",
        padding: "20px 40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Typography style={{ margin: "auto" }} variant="h5">
        Sign in
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          size="small"
          type="text"
          name="email"
          label="Email address"
          value={formValues.email}
          onChange={handleChange}
          error={Boolean(errorMsg)}
        />
        <TextField
          fullWidth
          size="small"
          type="password"
          name="password"
          label="Password"
          value={formValues.password}
          onChange={handleChange}
          error={Boolean(errorMsg)}
        />
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <Button
            style={{ width: "175px" }}
            type="button"
            variant="contained"
            color="secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<LoginIcon />}
            style={{ width: "175px" }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formValues.email || !formValues.password}
          >
            Sign in
          </LoadingButton>
        </div>
        {errorMsg && <Typography color="error">{errorMsg}</Typography>}
      </form>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <Link to="/signup">Register account</Link>
        <Link to="/forgot-password">Forgot password</Link>
      </div>
    </Card>
  );
};

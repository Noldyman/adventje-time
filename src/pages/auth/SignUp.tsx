import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, TextField, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { validateNewAccount } from "../../validation/validateNewAccount";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../app/firebase";
import { PersonAdd } from "@mui/icons-material";
import { useSetRecoilState } from "recoil";
import { notificationState } from "../../services/notifications";

interface IErrors {
  [k: string]: string;
}

const initialFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const SignUp = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState<IErrors>({});
  const [loading, setLoading] = useState(false);
  const setNotification = useSetRecoilState(notificationState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevValue) => {
      return { ...prevValue, [e.target.name]: e.target.value };
    });
  };

  const validateForm = async () => {
    let err: IErrors = {};
    let yupErrors = await validateNewAccount(formValues);
    if (yupErrors) err = { ...yupErrors };
    if (formValues.confirmPassword !== formValues.password) {
      err["confirmPassword"] = "Passwords do not match";
    }
    return Object.keys(err).length ? err : null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors = await validateForm();
    if (newErrors) return setErrors({ ...newErrors });
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setNotification({
        text: "Failed to register account",
        severity: "error",
      });
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
        Register new account
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
          error={Boolean(errors["email"])}
          helperText={errors["email"]}
        />
        <TextField
          fullWidth
          size="small"
          type="password"
          name="password"
          label="Password"
          value={formValues.password}
          onChange={handleChange}
          error={Boolean(errors["password"])}
          helperText={errors["password"]}
        />
        <TextField
          fullWidth
          size="small"
          type="password"
          name="confirmPassword"
          label="Confirm password"
          value={formValues.confirmPassword}
          onChange={handleChange}
          error={Boolean(errors["confirmPassword"])}
          helperText={errors["confirmPassword"]}
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
            startIcon={<PersonAdd />}
            style={{ width: "175px" }}
            disabled={
              !formValues.email ||
              !formValues.password ||
              !formValues.confirmPassword
            }
            type="submit"
            variant="contained"
            color="primary"
          >
            Sign up
          </LoadingButton>
        </div>
      </form>
      <div style={{ margin: "auto" }}>
        <Link to="/signin">I already have an account</Link>
      </div>
    </Card>
  );
};

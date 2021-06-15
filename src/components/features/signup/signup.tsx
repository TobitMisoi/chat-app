import React from "react";
import { Link, useHistory } from "react-router-dom";
import { GoHome } from "react-icons/go";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Snackbar,
} from "@material-ui/core";
import * as Yup from "yup";
import MuiAlert from "@material-ui/lab/Alert";
import { useFormik } from "formik";

// local imports
import styles from "./styles.module.scss";
import CustomButton from "../../shared/customButton/customButton";
import axios from "axios";
import { useDispatch } from "react-redux";

type SnackData = {
  open: boolean;
  message: string | null;
};

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoading, setIsLoading] = React.useState(false);
  const [snack, setSnack] = React.useState<SnackData>({
    open: false,
    message: null,
  });
  const [checked, setChecked] = React.useState(false);

  // Async request
  const signupSubmit = async (
    checked: boolean,
    email: string,
    password: string,
    username: string
  ) => {
    let resp;
    try {
      resp = await axios.post(`http://localhost:5000/users`, {
        checked,
        email: email.toLowerCase(),
        password: password.toLowerCase(),
        username,
      });
    } catch (error) {
      console.log("[ERROR][AUTH][SIGNUP] ", error);
      setIsLoading(false);
      return;
    }

    if (!resp.data) {
      setSnack({ open: true, message: resp.data.message });
      setIsLoading(false);
      return;
    }

    if (checked) {
      localStorage.setItem(
        "userData",
        JSON.stringify({ id: resp.data.userId, token: resp.data.userToken })
      );
    }
    dispatch({ type: "LOGIN", payload: resp.data.message });
    history.push("");
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, "Must be 2 characters at least")
        .required("Required")
        .max(12, "Can not exceed 12 characters"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be 6 characters at least")
        .required("Required")
        .max(20, "Can not exceed 20 characters"),
    }),
    onSubmit: (values) =>
      signupSubmit(checked, values.email, values.password, values.username),
  });

  return (
    <div className={styles.container}>
      <Link to="/">
        <GoHome />
      </Link>
      <form action="" className={styles.form}>
        <TextField
          className={styles.input}
          id="username"
          label="Username"
          variant="outlined"
          helperText={formik.touched.username && formik.errors.username}
          error={formik.touched.username && !!formik.errors.username}
          {...formik.getFieldProps("username")}
        />
        <TextField
          className={styles.input}
          id="email"
          label="Email"
          variant="outlined"
          helperText={formik.touched.email && formik.errors.email}
          error={formik.touched.email && !!formik.errors.email}
          {...formik.getFieldProps("email")}
        />
        <TextField
          className={styles.input}
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          helperText={formik.touched.password && formik.errors.password}
          error={formik.touched.password && !!formik.errors.password}
          {...formik.getFieldProps("password")}
        />
        <FormControlLabel
          className={styles.check}
          control={
            <Checkbox
              checked={checked}
              onChange={() => setChecked((prev) => !prev)}
              name="checkedB"
              color="primary"
            />
          }
          label="Remamber me"
        />
        <CustomButton
          type="submit"
          isPurple
          title="Signup"
          small={false}
          onClick={formik.handleSubmit}
        />
      </form>
      {isLoading && <CircularProgress />}
      <Link to="/login">
        <p className={styles.guest}>{`Already a memeber? Login`}</p>
      </Link>
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack({ open: false, message: null })}
      >
        <MuiAlert
          variant="filled"
          onClose={() => setSnack({ open: true, message: null })}
          severity="error"
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Signup;

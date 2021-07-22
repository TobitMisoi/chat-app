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
import MuiAlert from "@material-ui/lab/Alert";
import { useFormik } from "formik";

// local imports
import styles from "./styles.module.scss";
import CustomButton from "../../shared/customButton/customButton";
import axios from "axios";
import { apiConfig } from "../../../config/api";
import { useDispatch } from "react-redux";

type SnackData = {
  open: boolean;
  message: string | null;
};

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [snack, setSnack] = React.useState<SnackData>({
    open: false,
    message: null,
  });
  const [checked, setChecked] = React.useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const register = async (
    checked: boolean,
    email: string,
    password: string,
    username: string
  ) => {
    setIsLoading(true);

    let resp;
    try {
      resp = await axios.post(`${apiConfig.url}/users/signup`, {
        checked,
        email: email.toLowerCase(),
        password: password.toLowerCase(),
        username,
      });
    } catch (err) {
      console.log("[ERROR][AUTH][SIGNUP] ", err);
      setIsLoading(false);
      return;
    }

    if (!resp.data.access) {
      setSnack({ open: true, message: resp.data.message });
      setIsLoading(false);
      return;
    }
    if (checked) {
      localStorage.setItem(
        "userData",
        JSON.stringify({ id: resp.data.user.id, token: resp.data.user.token })
      );
    }

    dispatch({ type: "LOGIN", payload: { ...resp.data.user } });
    history.push("");
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: (val) => register(checked, val.email, val.password, val.username),
  });

  return (
    <div className={styles.container}>
      <Link to='/'>
        <GoHome />
      </Link>
      <form action='' className={styles.form}>
        <TextField
          className={styles.input}
          id='username'
          label='Username'
          variant='outlined'
          helperText={formik.touched.username && formik.errors.username}
          {...formik.getFieldProps("username")}
        />
        <TextField
          className={styles.input}
          id='email'
          label='Email'
          variant='outlined'
          helperText={formik.touched.email && formik.errors.email}
          {...formik.getFieldProps("email")}
        />
        <TextField
          className={styles.input}
          id='password'
          label='Password'
          variant='outlined'
          type='password'
          helperText={formik.touched.password && formik.errors.password}
          {...formik.getFieldProps("password")}
        />
        <FormControlLabel
          className={styles.check}
          control={
            <Checkbox
              checked={checked}
              onChange={() => setChecked((prev) => !prev)}
              name='checkedB'
              color='primary'
            />
          }
          label='Remember me'
        />
        <CustomButton
          type='submit'
          isPurple
          title='Signup'
          small={false}
          onClick={formik.handleSubmit}
        />
      </form>
      {isLoading && <CircularProgress />}
      <Link to='/login'>
        <p className={styles.guest}>{`Already a member? Login`}</p>
      </Link>
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack({ open: false, message: null })}
      >
        <MuiAlert
          variant='filled'
          onClose={() => setSnack({ open: true, message: null })}
          severity='error'
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Signup;

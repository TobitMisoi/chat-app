import { Checkbox, CircularProgress, FormControlLabel, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import axios from "axios";
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import styles from './styles.module.scss';


type Props = {};

type SnackData = {
    open: boolean,
    message: string | null
}

const Login: React.FC<Props> = props => {
    const dispatch = useDispatch()
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [snack, setSnack] = useState<SnackData>({ open: false, message: null })

    const loginSubmit = async (checked: boolean, email: string, password: string) => {
        setIsLoading(true);
        let res;

        try {
            res = await axios.post(`http://localhost:5000/api/users/login`, {
                checked,
                email: email.toLowerCase(),
                password: password.toLowerCase()
            });
        } catch (err) {
            console.log('[ERROR][AUTH][LOGIN];', err)
            setIsLoading(false);
            return;
        }
        if (!res.data.access) {
            setSnack({ open: true, message: res.data.message })
            setIsLoading(false);
            return;
        }
        if (checked) {
            localStorage.setItem('userData', JSON.stringify({ id: res.data.user.id, token: res.data.user.token }))
        }
        dispatch({ type: 'LOGIN', payload: { ...res.data.user } })
        history.push('');
        setIsLoading(false);
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string()
                .min(6, 'Must be 6 characters at least')
                .max(20, 'Cannot exceed 20 characters')
                .required('Required')
        }),
        onSubmit: val => loginSubmit(checked, val.password, val.password)
    })

    return (
        <>
            <div className={styles.container}>
                <Link to="/">
                    <img className={styles.logo} src="https://github.com/KillianFrappartDev/GroupChat/blob/master/frontend/src/assets/gc-logo-symbol-nobg.png" alt="logo" />
                </Link>
                <form action="" className={styles.form}>
                    <TextField
                        id="email"
                        className={styles.input}
                        label="Email"
                        variant="outlined"
                        type="email"
                        helperText={formik.touched.email && formik.errors.email}
                        error={formik.touched.email && !!formik.errors.email}
                        {...formik.getFieldProps('email')}
                    />
                    <TextField
                        id="password"
                        className={styles.input}
                        label="Password"
                        variant="outlined"
                        type="password"
                        {...formik.getFieldProps('password')}
                        helperText={formik.touched.password && formik.errors.password}
                        error={formik.touched.password && !!formik.errors.password}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={checked} onChange={() => setChecked(prev => !prev)} name="checked" color="primary" />
                        }
                        label="Remember me"
                    />
                    <button type="submit" title="login" onClick={() => formik.handleSubmit} >Login</button>
                </form>
                <Link to="/signup">
                    <p>Don't have an account Sign Up</p>
                </Link>
                {isLoading && <CircularProgress />}
                <Snackbar
                    open={snack.open}
                    onClose={() => { setSnack({ open: false, message: null }) }}
                    autoHideDuration={5000}
                >
                    <MuiAlert variant="filled" onClose={() => setSnack({ open: false, message: null })} severity="error">
                        {snack.message}
                    </MuiAlert>
                </Snackbar>
            </div>
        </>
    )
}

export default Login;
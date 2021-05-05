import React from 'react'
import { GoHome } from 'react-icons/go'
import { Link, useHistory } from 'react-router-dom'
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
  CircularProgress
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// internal imports
import styles from './styles.module.scss'
import CustomButton from '../../shared/customButton'

type SnackData = {
  open: boolean
  message: string | null
}

const Login: React.FC = () => {
  const dispatch = useDispatch()
  const hist = useHistory()

  const [isLoading, setIsLoading] = React.useState(false)
  const [checked, setChecked] = React.useState(false)
  const [snack, setSnack] = React.useState<SnackData>({
    open: false,
    message: null
  })

  //   Login
  const loginSubmit = async (
    checked: boolean,
    email: string,
    password: string
  ) => {
    setIsLoading(true)
    let resp
    try {
      resp = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/login`,
        {
          checked,
          email: email.toLowerCase(),
          password: password.toLowerCase()
        }
      )
    } catch (err) {
      console.log('[ERROR][AUTH][LOGIN]', err)
      setIsLoading(false)
      return
    }

    if (!resp.data.access) {
      setSnack({ open: true, message: resp.data.message })
      setIsLoading(false)
      return
    }

    if (checked) {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          id: resp.data.user.id,
          token: resp.data.user.token
        })
      )
    }

    dispatch({
      type: 'LOGIN',
      payload: { ...resp.data.user }
    })
    hist.push('')
    setIsLoading(false)
  }

  //   Formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(6, 'Must be 6 characters at least')
        .required('Required')
        .max(20, 'Can not exceed 20 characters')
    }),
    onSubmit: (val) => loginSubmit(checked, val.email, val.password)
  })

  return (
    <div className={styles.container}>
      <Link to='/'>
        <GoHome />
      </Link>
      <form action='' className={styles.form}>
        <TextField
          className={styles.input}
          id='email'
          label='Email'
          variant='outlined'
          type='text'
          {...formik.getFieldProps('email')}
          helperText={formik.touched.email && formik.errors.email}
          error={formik.touched.email && !!formik.errors.email}
        />
        <TextField
          className={styles.input}
          id='password'
          label='Password'
          variant='outlined'
          type='password'
          {...formik.getFieldProps('password')}
          helperText={formik.touched.password && formik.errors.password}
          error={formik.touched.password && !!formik.errors.password}
        />
        <FormControlLabel
          className={styles.check}
          control={
            <Checkbox
              checked={checked}
              onChange={() => setChecked((prev) => !prev)}
              name='checked'
              color='primary'
            />
          }
          label='Remember me'
        />
        <CustomButton
          type='submit'
          onClick={formik.handleSubmit}
          small={false}
          isPurple
          title='Login'
        />
      </form>
      <Link to='/signup'>
        <p className={styles.guest}>Don&apos;t have an account? Sign Up</p>
      </Link>
      {isLoading && <CircularProgress />}
      <Snackbar
        open={snack.open}
        onClose={() => setSnack({ open: false, message: null })}
        autoHideDuration={5000}
      >
        <MuiAlert
          variant='filled'
          onClose={() => setSnack({ open: false, message: null })}
          severity='error'
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>
    </div>
  )
}

export default Login

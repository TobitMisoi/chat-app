import React from 'react'
import { GoHome } from 'react-icons/go'
import { Link } from 'react-router-dom'
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
// internal imports
import styles from './styles.module.scss'
import CustomButton from '../../shared/customButton'

const Login: React.FC = (props) => {
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
        />
        <TextField
          className={styles.input}
          id='password'
          label='Password'
          variant='outlined'
          type='password'
        />
        <FormControlLabel
          className={styles.check}
          control={<Checkbox />}
          label='Remember me'
        />
        <CustomButton
          type='submit'
          onClick={() => {}}
          small={false}
          isPurple
          title='Login'
        />
      </form>
      <Link to='/signup'>
        <p className={styles.guest}>Don&apos;t have an account? Sign Up</p>
      </Link>
      <Snackbar>
        <MuiAlert>{`snack.message`}</MuiAlert>
      </Snackbar>
    </div>
  )
}

export default Login

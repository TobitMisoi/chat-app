import React from 'react'
import { Link } from 'react-router-dom'
import { GoHome } from 'react-icons/go'
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Snackbar
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { useFormik } from 'formik'

// local imports
import styles from './styles.module.scss'
import CustomButton from '../../shared/customButton'

type SnackData = {
  open: boolean
  message: string | null
}

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [snack, setSnack] = React.useState<SnackData>({
    open: false,
    message: null
  })
  const register = async () => {
    setIsLoading(true)
    setSnack({ open: true, message: 'Working on it: Signup not working now' })
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: ''
    },
    onSubmit: () => register()
  })

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
        />
        <TextField
          className={styles.input}
          id='email'
          label='Email'
          variant='outlined'
        />
        <TextField
          className={styles.input}
          id='password'
          label='Password'
          variant='outlined'
        />
        <FormControlLabel
          className={styles.check}
          control={<Checkbox />}
          label='Remamber me'
        />
        <CustomButton
          type='submit'
          isPurple
          title='Sigup'
          small={false}
          onClick={formik.handleSubmit}
        />
      </form>
      {isLoading && <CircularProgress />}
      <Link to='/login'>
        <p className={styles.guest}>{`Already a memeber? Login`}</p>
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
  )
}

export default Signup

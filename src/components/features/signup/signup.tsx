import React from 'react'
import { Link } from 'react-router-dom'
import { GoHome } from 'react-icons/go'
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core'
// local imports
import styles from './styles.module.scss'
import CustomButton from '../../shared/customButton'

const Signup: React.FC = (props) => {
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
          onClick={() => {}}
          small={false}
        />
      </form>
    </div>
  )
}

export default Signup

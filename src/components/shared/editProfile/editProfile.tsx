/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createMuiTheme,
  ThemeProvider,
  TextField,
  CircularProgress
} from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import CustomButton from '../customButton/customButton'
import styles from './styles.module.scss'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

interface IRootState {
  auth: {
    username: string
    image: string
  }
}

const EditProfile: React.FC = (props) => {
  const { image } = useSelector((state: IRootState) => state.auth)

  const [isLoading, setIsLoading] = React.useState(false)
  const [isValid, setIsValid] = React.useState(true)
  const [newImage, setImage] = React.useState(image)

  const imgPickerRef = React.useRef<HTMLInputElement>(null)

  return (
    <div
      className={styles.backdrop}
      onClick={() => console.log('dispatch data')}
    >
      <div className={styles.modal}>
        <h2>Profile</h2>
        <ThemeProvider theme={darkTheme}>
          <form action='' className={styles.form}>
            <img
              src={newImage}
              alt='User'
              className={styles.image}
              onClick={() => console.log('Pick image')}
            />
            <input
              type='file'
              accept='.jpg,.png,.jpeg'
              className={styles.file}
              ref={imgPickerRef}
              onChange={() => console.log('upload handler')}
            />
            <TextField
              className={styles.input}
              id='username'
              label='Username'
              variant='outlined'
              onChange={() => console.log('use name handler')}
            />
            <CustomButton
              onClick={() => console.log('edit handler')}
              isPurple
              title='Edit'
              small
            />
            {!isValid && <p className={styles.error}>Invalid entries.</p>}
            {isLoading && <CircularProgress />}
          </form>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default EditProfile

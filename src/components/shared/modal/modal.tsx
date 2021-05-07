/* eslint-disable react/prop-types */
import React from 'react'

import { ThemeProvider, createMuiTheme, TextField } from '@material-ui/core'

// styles
import styles from './styles.module.scss'
import CustomButton from '../customButton/customButton'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

type Props = {
  title: string
  onCreate: (title: string, description: string) => void
}

const Modal: React.FC<Props> = (props) => {
  const [title, setTitle] = React.useState('')
  const [isValid, setIsValid] = React.useState(true)
  const [titleErr, setTitleErr] = React.useState(false)
  const [description, setDescription] = React.useState('')
  const [titleHelper, setTitleHelper] = React.useState('')

  //   functions
  const createHandler = (title: string, description: string) => {
    if (titleErr) {
      setIsValid(false)
      return
    }

    props.onCreate(title, description)
  }

  const titleHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //   titleHandler conditions
    if (e.target.value.length <= 2 || e.target.value.length > 12) {
      setTitleErr(true)
      setTitleHelper('Title should contain 3 to 12 characters')
    } else {
      setTitleErr(false)
      setTitleHelper('')
      setIsValid(true)
    }
    setTitle(e.target.value)
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>{props.title}</h2>
        <ThemeProvider theme={darkTheme}>
          <form className={styles.form}>
            <TextField
              className={styles.input}
              id='title'
              label='title'
              variant='outlined'
              value={title}
              helperText={titleHelper}
              error={titleErr}
              onChange={(e) => titleHandler(e)}
            />
            <TextField
              className={styles.input}
              id='description'
              rows={3}
              label='Description'
              variant='outlined'
              multiline
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <CustomButton
              isPurple
              title='Create'
              small
              onClick={() => createHandler(title, description)}
            />
            {!isValid && <p className={styles.error}>Invalid Entries</p>}
          </form>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Modal

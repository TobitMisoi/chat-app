import React from 'react'

import { ThemeProvider, createMuiTheme, TextField } from '@material-ui/core'

// styles
import styles from './styles.module.scss'
import CustomButton from '../customButton'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

type Props = {
  title: string
}

const Modal: React.FC<Props> = (props) => {
  const [title, setTitle] = React.useState('')

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
            />
            <TextField
              className={styles.input}
              id='description'
              rows={3}
              label='Description'
              variant='outlined'
              multiline
            />
            <CustomButton isPurple title='Create' small onClick={() => {}} />
          </form>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Modal

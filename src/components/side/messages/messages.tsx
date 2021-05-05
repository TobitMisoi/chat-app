import React from 'react'
import { CircularProgress } from '@material-ui/core'

// local imports
import styles from './styles.module.scss'

type Props = {
  onClick: () => void
  loading: boolean
}

const Messages: React.FC<Props> = (props) => {
  return (
    <div id='chat' className={styles.container} onClick={props.onClick}>
      <div className={styles.wrapper}>
        {props.loading ? (
          <div className={styles.loading}>
            <CircularProgress />
          </div>
        ) : (
          <div className={styles.wraper}></div>
        )}
      </div>
    </div>
  )
}

export default Messages

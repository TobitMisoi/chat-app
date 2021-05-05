/* eslint-disable react/prop-types */
import React from 'react'
import { CircularProgress } from '@material-ui/core'

// local imports
import styles from './styles.module.scss'
import Message from './message'

type PropsMessage = {
  username: string
  text: string
  image: string
  _id: string
  date: string
}

type Props = {
  onClick: () => void
  loading: boolean
  messages: PropsMessage[]
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
          <div className={styles.wraper}>
            {props.messages.map((item) => (
              <Message
                key={item._id}
                _id={item._id}
                text={item.text}
                image={item.image}
                date={item.date}
                username={item.username}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages

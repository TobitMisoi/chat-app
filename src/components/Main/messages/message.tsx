/* eslint-disable react/prop-types */
import React from 'react'

// local imports
import styles from './styles.module.scss'
import { PropsMessage } from './types'


const Message: React.FC<PropsMessage> = (props) => {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.image}>
        <div className={styles.textBox}>
          <p className={styles.userName}>
            {props.username} <span className={styles.date}>{props.date}</span>
          </p>
          <p className={styles.message}>{props.text}</p>
        </div>
      </div>
    </div>
  )
}

export default Message

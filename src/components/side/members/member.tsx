/* eslint-disable react/prop-types */
import React from 'react'
import { MemberProps } from './interface'

// local imports
import styles from './styles.module.scss'

const Member: React.FC<MemberProps> = (props) => {
  return (
    <div className={styles.container}>
      <img src='https://unsplash.it/102' alt='User' className={styles.image} />
      <p className={styles.username}>{props.username}</p>
    </div>
  )
}

export default Member

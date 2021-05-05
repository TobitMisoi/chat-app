import React from 'react'
import { MemberProps } from './interface'

// local imports
import styles from './styles.module.scss'

const Members: React.FC<MemberProps> = (props) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Members</p>
    </div>
  )
}

export default Members

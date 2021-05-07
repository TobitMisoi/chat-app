/* eslint-disable react/prop-types */
import React from 'react'

import styles from './styles.module.scss'

type Props = {
  currGroup: {
    title: string
    description: string
  } | null
}

const GroupInfo: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <p className={styles.title}>{props.currGroup?.title}</p>
        <p className={styles.description}>{props.currGroup?.description}</p>
      </div>
    </div>
  )
}

export default GroupInfo

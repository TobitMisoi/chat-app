import React from 'react'

// local import
import styles from './styles.module.scss'

// interface
import { PropGroup } from './interfaces'

const Group: React.FC<PropGroup> = (props) => {
  return (
    <div className={styles.group} onClick={() => props.groupClick(props._id)}>
      <span className={styles.tag}>{props.tag}</span>
      <p className={styles.title}>{props.title}</p>
    </div>
  )
}

export default Group

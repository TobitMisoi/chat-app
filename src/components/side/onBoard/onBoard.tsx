import React from 'react'

// Local imports
import styles from './styles.module.scss'

type Props = {
  onClick: () => void
}

const OnBoard: React.FC<Props> = (props) => {
  return (
    <div className={styles.container} onClick={props.onClick}>
      <div className={styles.wrapper}>
        <img src='https://unsplash.it/110' alt='' className={styles.logo} />
      </div>
    </div>
  )
}

export default OnBoard

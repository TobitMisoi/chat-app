/* eslint-disable react/prop-types */
import { IconButton, Tooltip } from '@material-ui/core'
import { BugReport, ExitToApp } from '@material-ui/icons'
import React, { FC } from 'react'

import styles from './styles.module.scss'

type Props = {
  profileClick: () => void
  bugClick: () => void
  exitClick: () => void
}

const BottomBar: FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.userBox}>
          <Tooltip title='Edit Profile'>
            <img
              src='https://raw.githubusercontent.com/KillianFrappartDev/GroupChat/master/frontend/src/assets/gc-logo-symbol-nobg.png'
              alt='User'
              className={styles.image}
              onClick={props.profileClick}
            />
          </Tooltip>
          <p className={styles.username}>Tobit Misoi</p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Tooltip title='Report a bug' placement='top'>
          <IconButton className={styles.exitButton} onClick={props.bugClick}>
            <BugReport className={styles.exit} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Logout' placement='top'>
          <IconButton className={styles.exitButton} onClick={props.exitClick}>
            <ExitToApp className={styles.exit} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
export default BottomBar

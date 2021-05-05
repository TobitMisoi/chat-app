/* eslint-disable react/prop-types */
import { IconButton, Tooltip } from '@material-ui/core'
import { Add, ArrowBackIos } from '@material-ui/icons'
import React from 'react'

import styles from './styles.module.scss'

type Props = {
  inChannel: boolean
  arrowClick: () => void
  plusClick: () => void
}

const TopBar: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.inChannel ? (
        <div className={styles.wrapperInChannel}>
          <Tooltip title='Back to channels list' placement='bottom'>
            <IconButton
              className={styles.arrowButton}
              onClick={props.arrowClick}
            >
              <ArrowBackIos className={styles.arrow}></ArrowBackIos>
            </IconButton>
          </Tooltip>
          <h2 className={styles.title}>All Channels</h2>
        </div>
      ) : (
        <div className={styles.wrapperOutChannel}>
          <h2 className={styles.title}>Channels</h2>
          <Tooltip title='Create Channel' placement='bottom'>
            <IconButton className={styles.addButton} onClick={props.plusClick}>
              <Add className={styles.add} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  )
}

export default TopBar

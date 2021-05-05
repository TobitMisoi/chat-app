/* eslint-disable react/prop-types */
import { CircularProgress } from '@material-ui/core'
import React from 'react'
import { MemberProps } from './interface'
import Member from './member'

// local imports
import styles from './styles.module.scss'

type Props = {
  members: MemberProps[]
  loading: boolean
}

const Members: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Members</p>
      {props.loading ? (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div className={styles.wrapper}>
          {props.members.map((member) => (
            <Member
              key={member?._id}
              _id={member?._id}
              username={member?.username}
              image={member?.image}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Members

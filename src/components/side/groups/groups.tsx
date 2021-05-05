/* eslint-disable react/prop-types */
import React from 'react'
import { PropGroup } from './interfaces'

// local imports
import styles from './styles.module.scss'
import Group from './group'

type Props = {
  groups: PropGroup[]
  groupClick: (id: string) => void
}

const Groups: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {props.groups.map((grp) => (
          <Group
            _id={grp._id}
            key={grp._id}
            title={grp.title}
            tag={`${grp.title[0]}${grp.title[1]}`.toUpperCase()}
            groupClick={(id) => props.groupClick(id)}
          />
        ))}
      </div>
    </div>
  )
}

export default Groups

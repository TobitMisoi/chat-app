import { FC, useState } from 'react'
import { BottomBar, Search, TopBar } from '../../components'
import '../../styles.module.scss'

import styles from './styles.module.scss'

type Props = {}

const AppView: FC<Props> = (props) => {
  const [mobile] = useState(false)

  return (
    <div className={styles.container}>
      <div className={mobile ? styles.mobile : styles.side}>
        <TopBar inChannel={false} arrowClick={() => {}} plusClick={() => {}} />
        <Search update={() => {}} groups={[]} />
        <BottomBar
          profileClick={() => {}}
          bugClick={() => {}}
          exitClick={() => {}}
        />
      </div>
    </div>
  )
}

export default AppView

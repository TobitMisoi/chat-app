/* eslint-disable react/prop-types */
import { IconButton, InputBase } from '@material-ui/core'
import React from 'react'
import SearchIcon from '@material-ui/icons/Search'

import styles from './styles.module.scss'

type Props = {
  groups: Group[]
  update: (groups: Group[]) => void
}

type Group = {
  _id: string
  title: string
  description: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: any
  groupClick: () => void
}

const Search: React.FC<Props> = (props) => {
  const [searchValue, setSearchValue] = React.useState('')

  const searchHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchValue(e.target.value)
    const allGroups = props.groups
    const filteredGroups: Group[] = allGroups.filter((grp) =>
      grp.title.toLowerCase().includes(e.target.value.toLowerCase())
    )
    props.update(filteredGroups)
  }

  return (
    <div className={styles.container}>
      <IconButton className={styles.iconButton}>
        <SearchIcon className={styles.search} />
      </IconButton>
      <InputBase
        className={styles.input}
        placeholder='Search...'
        onChange={(e) => searchHandler(e)}
        value={searchValue}
      />
    </div>
  )
}

export default Search

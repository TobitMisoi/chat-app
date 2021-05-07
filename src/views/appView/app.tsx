/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BottomBar, TopBar as SideTopBar, Search } from '../../components'
import { MainTopBar, Messages, OnBoard } from '../../components/Main'
import { Modal, EditProfile } from '../../components/shared/'
import GroupInfo from '../../components/side/groupInfo/groupInfo'
import Groups from '../../components/side/groups/groups'
import Members from '../../components/side/members/members'
import { IRootState } from './interface'
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'

import styles from './styles.module.scss'
import { SnackData } from './types'
import axios from 'axios'

const AppView: React.FC = () => {
  const [mobile, setMobile] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [snack, setSnack] = React.useState<SnackData>({
    open: false,
    severity: undefined,
    message: null
  })

  const dispatch = useDispatch()

  const userData = useSelector((state: IRootState) => state.auth)
  const {
    inChannel,
    currGroup,
    members,
    messages,
    groups,
    modal
  } = useSelector((state: IRootState) => state.app)

  // creating a group
  const createGroup = async (title: string, description: string) => {
    const { token, id } = userData

    if (!token) {
      setSnack({
        open: true,
        severity: 'error',
        message: 'Guests are not are allowed to create group, please register'
      })
      return
    }

    let verifiedToken
    try {
      verifiedToken = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/verify`,
        {
          id,
          token
        }
      )
    } catch (err) {
      console.log('[ERROR][AUTH][VERIFY] :', err)
      return
    }

    if (!verifiedToken.data.access) {
      localStorage.removeItem('userData')
      return
    }

    let resp
    try {
      resp = await axios.post(`${process.env.REACT_APP_SERVER_URL}/groups`, {
        title,
        description: description ? description : 'No description'
      })
    } catch (err) {
      console.log('[ERROR][AUTH][GROUPS][CREATE] :', err)
      setSnack({
        open: true,
        severity: 'error',
        message: 'An error occured: Could not create group.'
      })
      return
    }

    if (!resp) return
    dispatch({ type: 'MODAL', payload: { modal: null } })
    // fetchGroups()
  }

  // Render
  let sideContent
  let mainContent

  if (inChannel) {
    sideContent = (
      <div className={styles.sideContent}>
        <GroupInfo currGroup={currGroup} />
        <Members members={members} loading={loading} />
      </div>
    )
    mainContent = (
      <div className={styles.main}>
        <MainTopBar
          title={currGroup?.title}
          menuClick={() => setMobile(true)}
        />
        <Messages
          onClick={() => setMobile(false)}
          loading={loading}
          messages={messages}
        />
      </div>
    )
  } else {
    sideContent = (
      <div className={styles.sideContent}>
        <Search groups={groups} update={() => console.log('update')} />
        <Groups groups={groups} groupClick={() => console.log('groupClick')} />
      </div>
    )
    mainContent = (
      <div className={styles.main}>
        <MainTopBar title='' menuClick={() => setMobile(true)} />
        <OnBoard onClick={() => setMobile(false)} />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={mobile ? styles.mobile : styles.side}>
        <SideTopBar
          arrowClick={() => {}}
          plusClick={() => {}}
          inChannel={mobile}
        />
        {sideContent}
        <BottomBar
          profileClick={() => {}}
          bugClick={() => {}}
          exitClick={() => {}}
        />
        {mainContent}
        {modal === 'create' && (
          <Modal
            onCreate={() => console.log('Create group')}
            title='New Channel'
          />
        )}
        {modal === 'edit' && <EditProfile />}
        {modal === 'bug' && (
          <Modal
            title='Report bug'
            onCreate={() => console.log('report bug')}
          />
        )}
        <Snackbar
          open={snack.open}
          onClose={() =>
            setSnack({
              open: false,
              severity: snack.severity,
              message: null
            })
          }
          autoHideDuration={5000}
        >
          <MuiAlert
            variant='filled'
            severity={snack.severity}
            onClose={() =>
              setSnack({
                open: false,
                severity: snack.severity,
                message: null
              })
            }
          >
            {snack.message}
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  )
}

export default AppView

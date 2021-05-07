import axios from 'axios'
import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import CustomButton from '../../shared/customButton/customButton'
import styles from './styles.module.scss'

const Welcome: FC = () => {
  const dispatch = useDispatch()

  const guestRequest = async () => {
    let resp
    try {
      resp = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/guest`)
    } catch (err) {
      console.log('[ERROR][AUTH][GUEST]', err)
      return
    }
    if (!resp.data.access) return

    dispatch({ type: 'GUEST', payload: { ...resp.data.user } })
  }

  return (
    <div className={styles.container}>
      <img
        src='https:unsplash.it/2190'
        alt='GrouspChat Logo'
        className={styles.logo}
      />
      <Link to='/login'>
        <CustomButton
          isPurple={false}
          small={false}
          onClick={() => console.log()}
          title='Login'
        />
      </Link>
      <Link to='/signup'>
        <CustomButton
          isPurple={true}
          small={false}
          onClick={() => console.log()}
          title='SignUp'
        />
      </Link>
      <p className={styles.guest} onClick={guestRequest}>
        Continue as guest
      </p>
    </div>
  )
}

export default Welcome

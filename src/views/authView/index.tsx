import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import axios from 'axios'
import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import Login from '../../components/features/Login/Login'
import Signup from '../../components/features/signup'
import Welcome from '../../components/features/welcome'
import Cookie from '../../components/shared/cookie/cookie'

type UserData = {
  id: string
  token: string
}

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

const AuthView: FC = () => {
  const dispatch = useDispatch()
  const [cookie, setCookie] = React.useState(true)

  // TODO: #37 wrap the definition of 'verifyRequest' in its own useCallback() Hook.
  // Async request
  const verifyRequest = async (id: string, token: string) => {
    let resp

    try {
      resp = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/verify`,
        {
          id,
          token
        }
      )
    } catch (err) {
      console.log('[ERROR][AUTH][VERIFY]', err)
      return
    }
    if (!resp.data.access) {
      localStorage.removeItem('userData')
      return
    }

    dispatch({ type: 'LOGIN', payload: { ...resp.data.user } })
  }

  React.useEffect(() => {
    const cookieData = localStorage.getItem('cookieData')

    if (cookieData) setCookie(false)
    const userData = localStorage.getItem('getItem')
    if (!userData) return
    const parsedData: UserData = JSON.parse(userData)
    verifyRequest(parsedData.id, parsedData.token)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      {cookie && (
        <Cookie
          onAccept={() => {
            localStorage.setItem('cookieData', 'accepted')
            setCookie(false)
          }}
        />
      )}

      <Router>
        <Switch>
          <Route path='/login' exact component={Login} />
          <Route path='/signup' component={Signup} />
          <Route path='/' exact component={Welcome} />
          <Redirect to='/' />
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default AuthView

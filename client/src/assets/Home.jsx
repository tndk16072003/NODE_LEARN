import axios from 'axios'
import reactLogo from './react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
const getGoogleoAuthUrl = () => {
  const { VITE_GOOGLE_REDIRECT_URI, VITE_GOOGLE_CLIENT_ID } = import.meta.env
  const url = `https://accounts.google.com/o/oauth2/v2/auth`
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    ),
    prompt: 'consent',
    access_type: 'offline'
  }
  const queryString = new URLSearchParams(query).toString()
  return `${url}?${queryString}`
}

const getFacebookoAuthUrl = () => {
  const { VITE_FACEBOOK_CLIENT_ID, VITE_FACEBOOK_REDIRECT_URI } = import.meta.env
  const url = 'https://www.facebook.com/v18.0/dialog/oauth'
  const query = {
    client_id: VITE_FACEBOOK_CLIENT_ID,
    redirect_uri: VITE_FACEBOOK_REDIRECT_URI,
    response_type: 'code',
    scope: ['email', 'public_profile']
  }
  const queryString = new URLSearchParams(query).toString()
  return `${url}?${queryString}`
}

const facebookOAuthUrl = getFacebookoAuthUrl()
const googleOAuthUrl = getGoogleoAuthUrl()
export default function Home() {
  const isAuthenticated = Boolean(localStorage.getItem('accessToken'))
  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:4000/api/users/logout',
        {
          refresh_token: localStorage.getItem('refreshToken')
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
          }
        }
      )
    } catch (error) {
      console.error('Error during logout:', error.response.data)
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.reload()
  }
  return (
    <>
      <div>
        <span target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </span>
        <span target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </span>
      </div>
      <h1>Google OAuth 2.0</h1>
      <p className='read-the-docs'>
        {isAuthenticated ? (
          <>
            <span>Hello, welcome back.</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to={googleOAuthUrl} style={{ marginRight: '10px' }}>
              Login with googles
            </Link>
            <Link to={facebookOAuthUrl}>Login with facebook</Link>
          </>
        )}
      </p>
    </>
  )
}

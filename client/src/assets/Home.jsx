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

const googleOAuthUrl = getGoogleoAuthUrl()

export default function Home() {
  const isAuthenticated = Boolean(localStorage.getItem('accessToken'))
  const logout = () => {
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
          <Link to={googleOAuthUrl}>Login with googles</Link>
        )}
      </p>
    </>
  )
}

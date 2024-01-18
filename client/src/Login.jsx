import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  useEffect(() => {
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    // const newUser = params.get('newUser')
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    navigate('/')
  }, [params, navigate])
}
